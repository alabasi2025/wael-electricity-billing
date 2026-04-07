const oracledb = require('oracledb');
const { Client } = require('pg');

oracledb.fetchAsString = [oracledb.NUMBER];

const ORACLE_ADMIN_USER = process.env.ORACLE_USER || 'DBAIMP';
const ORACLE_ADMIN_PASSWORD = process.env.ORACLE_PASSWORD || '774424555';
const ORACLE_CONNECT_STRING = process.env.ORACLE_CONNECT_STRING || 'localhost:1521/XE';
const ORACLE_SOURCE_OWNER = (process.env.ORACLE_SOURCE_OWNER || 'DATASOGW').toUpperCase();

const PG_HOST = process.env.PGHOST || 'localhost';
const PG_PORT = Number(process.env.PGPORT || 5432);
const PG_USER = process.env.PGUSER || 'electricity_user';
const PG_PASSWORD = process.env.PGPASSWORD || '774424555';
const PG_DATABASE = process.env.PGDATABASE || 'electricity_accounting';
const PG_SCHEMA = (process.env.PG_RAW_SCHEMA || 'legacy_clone').toLowerCase();

const FETCH_BATCH_SIZE = Number(process.env.ORACLE_FETCH_BATCH || 500);
const INSERT_BATCH_SIZE = Number(process.env.PG_INSERT_BATCH || 200);

function pgIdent(name) {
  return `"${String(name).replace(/"/g, '""').toLowerCase()}"`;
}

function oracleIdent(name) {
  return `"${String(name).replace(/"/g, '""').toUpperCase()}"`;
}

function mapOracleType(column) {
  switch (column.DATA_TYPE) {
    case 'NUMBER':
      return 'numeric';
    case 'DATE':
      return 'timestamp without time zone';
    default:
      return 'text';
  }
}

function normalizeValue(value) {
  if (value === undefined || value === null) return null;
  if (value instanceof Date) return value;
  if (Buffer.isBuffer(value)) return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
}

async function getAllTables(conn, owner) {
  const result = await conn.execute(
    `
      SELECT table_name
      FROM all_tables
      WHERE owner = :owner
      ORDER BY table_name
    `,
    { owner },
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  return (result.rows || []).map((row) => row.TABLE_NAME);
}

async function getColumns(conn, owner, tableName) {
  const result = await conn.execute(
    `
      SELECT
        column_name,
        data_type,
        data_length,
        data_precision,
        data_scale,
        nullable,
        column_id
      FROM all_tab_columns
      WHERE owner = :owner
        AND table_name = :tableName
      ORDER BY column_id
    `,
    { owner, tableName },
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  return result.rows || [];
}

async function getViews(conn, owner) {
  const result = await conn.execute(
    `
      SELECT view_name, text
      FROM all_views
      WHERE owner = :owner
      ORDER BY view_name
    `,
    { owner },
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  return result.rows || [];
}

async function recreateSchema(pg, schema) {
  await pg.query(`DROP SCHEMA IF EXISTS ${pgIdent(schema)} CASCADE`);
  await pg.query(`CREATE SCHEMA ${pgIdent(schema)}`);

  await pg.query(`
    CREATE TABLE ${pgIdent(schema)}."__clone_meta" (
      source_owner text not null,
      cloned_at timestamp without time zone not null default now(),
      table_count integer not null,
      view_count integer not null
    )
  `);

  await pg.query(`
    CREATE TABLE ${pgIdent(schema)}."__table_meta" (
      source_owner text not null,
      table_name text not null,
      target_table_name text not null,
      row_count numeric,
      cloned_at timestamp without time zone not null default now()
    )
  `);

  await pg.query(`
    CREATE TABLE ${pgIdent(schema)}."__column_meta" (
      source_owner text not null,
      table_name text not null,
      column_name text not null,
      data_type text not null,
      data_length numeric,
      data_precision numeric,
      data_scale numeric,
      nullable text,
      ordinal_position integer not null
    )
  `);

  await pg.query(`
    CREATE TABLE ${pgIdent(schema)}."__view_meta" (
      source_owner text not null,
      view_name text not null,
      view_sql text
    )
  `);
}

async function createTargetTable(pg, schema, tableName, columns) {
  const pgColumns = columns.map((column) => {
    const targetType = mapOracleType(column);
    return `  ${pgIdent(column.COLUMN_NAME)} ${targetType}`;
  });

  const sql = `
    CREATE TABLE ${pgIdent(schema)}.${pgIdent(tableName)} (
${pgColumns.join(',\n')}
    )
  `;

  await pg.query(sql);
}

async function insertRows(pg, schema, tableName, columns, rows) {
  if (!rows.length) return;

  const columnSql = columns.map((column) => pgIdent(column.COLUMN_NAME)).join(', ');
  const values = [];
  const placeholders = [];
  let position = 1;

  for (const row of rows) {
    const rowPlaceholders = [];
    for (const column of columns) {
      values.push(normalizeValue(row[column.COLUMN_NAME]));
      rowPlaceholders.push(`$${position++}`);
    }
    placeholders.push(`(${rowPlaceholders.join(', ')})`);
  }

  await pg.query(
    `
      INSERT INTO ${pgIdent(schema)}.${pgIdent(tableName)} (${columnSql})
      VALUES ${placeholders.join(',\n')}
    `,
    values,
  );
}

async function cloneTable(ora, pg, schema, owner, tableName, columns) {
  const result = await ora.execute(
    `SELECT * FROM ${oracleIdent(owner)}.${oracleIdent(tableName)}`,
    [],
    {
      resultSet: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      fetchArraySize: FETCH_BATCH_SIZE,
    },
  );

  const resultSet = result.resultSet;
  let totalRows = 0;

  try {
    while (true) {
      const oracleRows = await resultSet.getRows(FETCH_BATCH_SIZE);
      if (!oracleRows.length) break;

      for (let index = 0; index < oracleRows.length; index += INSERT_BATCH_SIZE) {
        const batch = oracleRows.slice(index, index + INSERT_BATCH_SIZE);
        await insertRows(pg, schema, tableName, columns, batch);
      }

      totalRows += oracleRows.length;
      console.log(`CLONED ${tableName}: ${totalRows}`);
    }
  } finally {
    await resultSet.close();
  }

  return totalRows;
}

async function main() {
  const ora = await oracledb.getConnection({
    user: ORACLE_ADMIN_USER,
    password: ORACLE_ADMIN_PASSWORD,
    connectString: ORACLE_CONNECT_STRING,
  });

  const pg = new Client({
    host: PG_HOST,
    port: PG_PORT,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
  });

  await pg.connect();

  try {
    const tables = await getAllTables(ora, ORACLE_SOURCE_OWNER);
    const views = await getViews(ora, ORACLE_SOURCE_OWNER);

    await recreateSchema(pg, PG_SCHEMA);

    await pg.query(
      `
        INSERT INTO ${pgIdent(PG_SCHEMA)}."__clone_meta" (source_owner, table_count, view_count)
        VALUES ($1, $2, $3)
      `,
      [ORACLE_SOURCE_OWNER, tables.length, views.length],
    );

    for (const view of views) {
      await pg.query(
        `
          INSERT INTO ${pgIdent(PG_SCHEMA)}."__view_meta" (source_owner, view_name, view_sql)
          VALUES ($1, $2, $3)
        `,
        [ORACLE_SOURCE_OWNER, view.VIEW_NAME, view.TEXT || null],
      );
    }

    for (const tableName of tables) {
      const columns = await getColumns(ora, ORACLE_SOURCE_OWNER, tableName);

      await createTargetTable(pg, PG_SCHEMA, tableName, columns);

      for (const column of columns) {
        await pg.query(
          `
            INSERT INTO ${pgIdent(PG_SCHEMA)}."__column_meta"
              (source_owner, table_name, column_name, data_type, data_length, data_precision, data_scale, nullable, ordinal_position)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
          [
            ORACLE_SOURCE_OWNER,
            tableName,
            column.COLUMN_NAME,
            column.DATA_TYPE,
            column.DATA_LENGTH,
            column.DATA_PRECISION,
            column.DATA_SCALE,
            column.NULLABLE,
            column.COLUMN_ID,
          ],
        );
      }

      const rowCount = await cloneTable(ora, pg, PG_SCHEMA, ORACLE_SOURCE_OWNER, tableName, columns);

      await pg.query(
        `
          INSERT INTO ${pgIdent(PG_SCHEMA)}."__table_meta" (source_owner, table_name, target_table_name, row_count)
          VALUES ($1, $2, $3, $4)
        `,
        [ORACLE_SOURCE_OWNER, tableName, tableName.toLowerCase(), rowCount],
      );
    }

    console.log(`RAW_CLONE_OK schema=${PG_SCHEMA} source=${ORACLE_SOURCE_OWNER} tables=${tables.length} views=${views.length}`);
  } finally {
    await pg.end();
    await ora.close();
  }
}

main().catch((error) => {
  console.error('RAW_CLONE_FAILED', error);
  process.exit(1);
});
