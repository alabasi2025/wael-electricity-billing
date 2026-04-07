const oracledb = require('oracledb');
const { Client } = require('pg');
const bcrypt = require('bcrypt');

function toInt(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

function toNum(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toStr(v) {
  if (v === null || v === undefined) return null;
  const s = String(v);
  return s.length ? s : null;
}

function left(v, len) {
  const s = toStr(v);
  if (!s) return null;
  return s.length > len ? s.slice(0, len) : s;
}

function joinNotes(parts) {
  const out = parts.filter((x) => x !== null && x !== undefined && String(x).trim() !== '').join(' | ');
  return out.length ? out : null;
}

async function fetchRows(conn, sql) {
  const sourceOwner = process.env.ORACLE_SOURCE_OWNER || process.env.ORACLE_USER || 'C##DATASO3';
  const normalizedSql = sql.replaceAll('C##DATASO3', sourceOwner);
  const r = await conn.execute(normalizedSql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
  return r.rows || [];
}

async function fetchRowsOptional(conn, sql) {
  try {
    return await fetchRows(conn, sql);
  } catch (err) {
    if (err && (err.errorNum === 942 || err.code === 'ORA-00942')) {
      return [];
    }
    throw err;
  }
}

async function main() {
  const oracleUser = process.env.ORACLE_USER || 'C##DATASO3';
  const oraclePassword = process.env.ORACLE_PASSWORD || '774424555';
  const oracleConnectString = process.env.ORACLE_CONNECT_STRING || 'localhost:1521/XE';

  const ora = await oracledb.getConnection({
    user: oracleUser,
    password: oraclePassword,
    connectString: oracleConnectString,
  });

  const pg = new Client({
    host: 'localhost',
    port: 5432,
    user: 'electricity_user',
    password: '774424555',
    database: 'electricity_accounting',
  });

  await pg.connect();

  try {
    await pg.query('BEGIN');

    const clearOrder = [
      'sndkf', 'sndk22', 'sndk', 'repmsm', 'thoel', 'tr', 'dataffx', 'datafy', 'dataff', 'datak',
      'data_am',
      'sysdata', 'usergn', 'user_u', 'typems', 'ty_ms', 'tyht', 'ttel', 'trmb', 'reprorh',
      'prg', 'nurs', 'mz', 'msc', 'moldat', 'mkb2', 'mkb', 'grp',
      'data_ac', 'data_a', 'amlh', 'akd', '"year"',
    ];

    for (const t of clearOrder) {
      await pg.query(`DELETE FROM ${t}`);
    }

    const accountNames = new Map();
    const chartAccountIds = new Set();
    const receiptNos = new Set();

    for (const row of await fetchRows(ora, `SELECT NOR, TNO FROM C##DATASO3.AKD ORDER BY NOR`)) {
      await pg.query(`INSERT INTO akd (nor, tno) VALUES ($1,$2)`, [toInt(row.NOR), left(row.TNO, 300)]);
    }

    for (const row of await fetchRows(ora, `SELECT NO, NAMEM, SARS, FLS, NACHAR, SARS1, SARS2, NAMEM2, RYL FROM C##DATASO3.AMLH ORDER BY NO`)) {
      const notes = joinNotes([
        row.FLS ? `FLS=${row.FLS}` : null,
        row.NACHAR ? `NACHAR=${row.NACHAR}` : null,
        row.SARS1 !== null && row.SARS1 !== undefined ? `SARS1=${row.SARS1}` : null,
        row.SARS2 !== null && row.SARS2 !== undefined ? `SARS2=${row.SARS2}` : null,
        row.NAMEM2 ? `NAMEM2=${row.NAMEM2}` : null,
        row.RYL ? `RYL=${row.RYL}` : null,
      ]);
      await pg.query(`INSERT INTO amlh (name, type, amount, notes) VALUES ($1,$2,$3,$4)`, [
        left(row.NAMEM || row.NAMEM2 || row.NACHAR, 200),
        toInt(row.NO),
        toNum(row.SARS),
        notes,
      ]);
    }

    for (const row of await fetchRows(ora, `SELECT NO_A, NAME_A, REP_A, IND, TS, WK FROM C##DATASO3.DATA_A ORDER BY NO_A`)) {
      const noA = toInt(row.NO_A);
      await pg.query(`INSERT INTO data_a (no_a, name_a, rep_a, ind, ts, typea) VALUES ($1,$2,$3,$4,$5,$6)`, [
        noA,
        left(row.NAME_A, 200),
        toStr(row.REP_A),
        toInt(row.IND),
        toInt(row.TS) ?? 0,
        toInt(row.WK),
      ]);
      if (noA !== null) {
        chartAccountIds.add(noA);
      }
    }

    for (const row of await fetchRows(ora, `SELECT NOA, NAMEA, TYPEA, NOAN, AMLHH, SARAM FROM C##DATASO3.DATA_AC ORDER BY NOA`)) {
      const saramRaw = toStr(row.SARAM);
      const saram = saramRaw && /^-?\d+$/.test(saramRaw.trim()) ? parseInt(saramRaw.trim(), 10) : null;
      const noa = toInt(row.NOA);
      const namea = left(row.NAMEA, 200);
      const typea = toInt(row.TYPEA);
      if (typea !== null && !chartAccountIds.has(typea)) {
        await pg.query(
          `INSERT INTO data_a (no_a, name_a, rep_a, ind, ts, typea) VALUES ($1,$2,$3,$4,$5,$6)`,
          [typea, `Legacy Parent ${typea}`, null, null, 0, null],
        );
        chartAccountIds.add(typea);
      }
      await pg.query(`INSERT INTO data_ac (noa, namea, typea, noan, amlhh, saram) VALUES ($1,$2,$3,$4,$5,$6)`, [
        noa,
        namea,
        typea,
        toInt(row.NOAN),
        toNum(row.AMLHH),
        saram,
      ]);
      if (noa !== null) {
        accountNames.set(noa, namea);
      }
    }

    for (const row of await fetchRows(ora, `SELECT NOA, MHLT, NOTMS, NOG, NOMO, HL, DAY, SARAM, KN, DATEF, DATET, PRFG, TYP, GKM, MMSN, KMSN, MODR, SDAD FROM C##DATASO3.DATA_AM ORDER BY NOA`)) {
      const noa = toInt(row.NOA);
      if (noa !== null && !accountNames.has(noa)) {
        await pg.query(
          `INSERT INTO data_ac (noa, namea, typea, noan, amlhh, saram) VALUES ($1,$2,$3,$4,$5,$6)`,
          [noa, `Legacy Account ${noa}`, null, null, null, null],
        );
        accountNames.set(noa, `Legacy Account ${noa}`);
      }
      const notes = joinNotes([
        row.NOG !== null && row.NOG !== undefined ? `NOG=${row.NOG}` : null,
        row.NOMO !== null && row.NOMO !== undefined ? `NOMO=${row.NOMO}` : null,
        row.HL !== null && row.HL !== undefined ? `HL=${row.HL}` : null,
        row.DAY !== null && row.DAY !== undefined ? `DAY=${row.DAY}` : null,
        row.SARAM ? `SARAM=${row.SARAM}` : null,
        row.KN !== null && row.KN !== undefined ? `KN=${row.KN}` : null,
        row.DATEF ? `DATEF=${row.DATEF.toISOString().slice(0, 10)}` : null,
        row.DATET ? `DATET=${row.DATET.toISOString().slice(0, 10)}` : null,
        row.PRFG !== null && row.PRFG !== undefined ? `PRFG=${row.PRFG}` : null,
        row.TYP !== null && row.TYP !== undefined ? `TYP=${row.TYP}` : null,
        row.GKM !== null && row.GKM !== undefined ? `GKM=${row.GKM}` : null,
        row.MMSN !== null && row.MMSN !== undefined ? `MMSN=${row.MMSN}` : null,
        row.KMSN !== null && row.KMSN !== undefined ? `KMSN=${row.KMSN}` : null,
        row.MODR ? `MODR=${row.MODR}` : null,
        row.SDAD !== null && row.SDAD !== undefined ? `SDAD=${row.SDAD}` : null,
      ]);
      await pg.query(
        `INSERT INTO data_am (noa, namea, mhlt, tel, notes) VALUES ($1,$2,$3,$4,$5)`,
        [noa, accountNames.get(noa) || null, left(row.MHLT, 200), left(row.NOTMS, 50), notes],
      );
    }

    for (const row of await fetchRows(ora, `SELECT NOG, NAMEG, TY, NOADDR, NOGN, NOGS FROM C##DATASO3.GRP ORDER BY NOG`)) {
      const groupId = toInt(row.NOG);
      if (groupId === null) continue;
      const accountsObj = { noaddr: toInt(row.NOADDR), nogn: toInt(row.NOGN), nogs: toInt(row.NOGS) };
      const accounts = Object.values(accountsObj).every((x) => x === null) ? null : JSON.stringify(accountsObj);
      await pg.query(`INSERT INTO grp (id, name, type, accounts) VALUES ($1,$2,$3,$4)`, [
        groupId,
        left(row.NAMEG, 200),
        toInt(row.TY),
        accounts,
      ]);
    }

    for (const row of await fetchRows(ora, `SELECT NOM, NAMEM, NOMS FROM C##DATASO3.MKB ORDER BY NOM`)) {
      await pg.query(`INSERT INTO mkb (nom, namem, noms) VALUES ($1,$2,$3)`, [toInt(row.NOM), left(row.NAMEM, 50), toInt(row.NOMS)]);
    }

    for (const row of await fetchRowsOptional(ora, `SELECT NOM, NAMEM FROM C##DATASO3.MKB2 ORDER BY NOM`)) {
      await pg.query(`INSERT INTO mkb2 (nom, namem) VALUES ($1,$2)`, [toInt(row.NOM), left(row.NAMEM, 100)]);
    }

    for (const row of await fetchRowsOptional(ora, `SELECT NOG, NAMEG, REDA, TIM FROM C##DATASO3.MOLDAT ORDER BY NOG`)) {
      await pg.query(
        `INSERT INTO moldat (name, capacity, location, status, notes, fuel_consumption, working_hours)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          left(row.NAMEG, 200),
          toNum(row.REDA),
          row.NOG !== null && row.NOG !== undefined ? `NOG:${row.NOG}` : null,
          1,
          null,
          null,
          toNum(row.TIM),
        ],
      );
    }

    for (const row of await fetchRowsOptional(ora, `SELECT NOX, T FROM C##DATASO3.MSC ORDER BY NOX`)) {
      await pg.query(`INSERT INTO msc (nox, t) VALUES ($1,$2)`, [toInt(row.NOX), toInt(row.T)]);
    }

    for (const row of await fetchRows(ora, `SELECT NOZ, NAMEZ, HL, NOMZ, XR FROM C##DATASO3.MZ ORDER BY NOZ`)) {
      await pg.query(
        `INSERT INTO mz (meter_number, subscriber_name, location, reading, prev_reading, last_read_date, status, noa)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [toStr(row.NOZ), left(row.NAMEZ, 200), null, toNum(row.NOMZ), toNum(row.XR), null, toInt(row.HL) ?? 1, null],
      );
    }

    for (const row of await fetchRows(ora, `SELECT NO FROM C##DATASO3.NURS ORDER BY NO`)) {
      await pg.query(`INSERT INTO nurs (no) VALUES ($1)`, [toInt(row.NO)]);
    }

    for (const row of await fetchRows(ora, `SELECT NOPR, NAPRG, LAPRG, ALLS, HS FROM C##DATASO3.PRG ORDER BY NOPR`)) {
      await pg.query(`INSERT INTO prg (nopr, naprg, laprg, alls, hs) VALUES ($1,$2,$3,$4,$5)`, [
        toInt(row.NOPR),
        left(row.NAPRG, 20),
        left(row.LAPRG, 50),
        toInt(row.ALLS),
        toInt(row.HS),
      ]);
    }

    for (const row of await fetchRows(ora, `SELECT NOA, NAMEA, NOAN, RSD, MDIN, DAN, MEMOA, TYP FROM C##DATASO3.REPRORH ORDER BY NOA`)) {
      await pg.query(`INSERT INTO reprorh (noa, namea, noan, rsd, mdin, dan, memoa, typ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [
        toInt(row.NOA),
        left(row.NAMEA, 50),
        toInt(row.NOAN),
        toInt(row.RSD),
        toInt(row.MDIN),
        toInt(row.DAN),
        left(row.MEMOA, 300),
        toInt(row.TYP),
      ]);
    }

    for (const row of await fetchRows(ora, `SELECT NOG, NAMEG, REDA, HL FROM C##DATASO3.TRMB ORDER BY NOG`)) {
      await pg.query(`INSERT INTO trmb (nog, nameg, reda, hl) VALUES ($1,$2,$3,$4)`, [toInt(row.NOG), left(row.NAMEG, 50), toNum(row.REDA), toInt(row.HL)]);
    }

    for (const row of await fetchRows(ora, `SELECT NOTL, NATL FROM C##DATASO3.TTEL ORDER BY NOTL`)) {
      await pg.query(`INSERT INTO ttel (notl, natl) VALUES ($1,$2)`, [toInt(row.NOTL), toInt(row.NATL)]);
    }

    for (const row of await fetchRows(ora, `SELECT NOH, NAMEH FROM C##DATASO3.TYHT ORDER BY NOH`)) {
      await pg.query(`INSERT INTO tyht (noh, nameh) VALUES ($1,$2)`, [toInt(row.NOH), left(row.NAMEH, 10)]);
    }

    for (const row of await fetchRows(ora, `SELECT NOTY, NATY, REP FROM C##DATASO3.TYPEMS ORDER BY NOTY`)) {
      await pg.query(`INSERT INTO typems (noty, naty, rep) VALUES ($1,$2,$3)`, [toInt(row.NOTY), left(row.NATY, 15), toInt(row.REP)]);
    }

    for (const row of await fetchRowsOptional(ora, `SELECT NOM, NAMEM FROM C##DATASO3.TY_MS ORDER BY NOM`)) {
      await pg.query(`INSERT INTO ty_ms (nom, namem) VALUES ($1,$2)`, [toInt(row.NOM), left(row.NAMEM, 50)]);
    }

    for (const row of await fetchRows(ora, `SELECT NOU, NOPR FROM C##DATASO3.USERGN ORDER BY NOU, NOPR`)) {
      await pg.query(`INSERT INTO usergn (nou, nopr) VALUES ($1,$2)`, [toInt(row.NOU), toInt(row.NOPR)]);
    }

    for (const row of await fetchRows(ora, `SELECT NOU, NAMEU, PASS, PASSS, STATU, ED, DE, REPA, KOKOGO FROM C##DATASO3.USER_U ORDER BY NOU`)) {
      const rawPass = toStr(row.PASS) || toStr(row.PASSS) || '123456';
      const rawPasss = toStr(row.PASSS) || rawPass;
      const hashPass = await bcrypt.hash(rawPass, 10);
      const hashPasss = await bcrypt.hash(rawPasss, 10);
      await pg.query(
        `INSERT INTO user_u (nou, nameu, pass, passs, statu, ed, de, repa, kokogo)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          toInt(row.NOU),
          left(row.NAMEU, 100) || `User ${toInt(row.NOU) ?? ''}`,
          hashPass,
          hashPasss,
          toInt(row.STATU) ?? 1,
          toStr(row.ED),
          toStr(row.DE),
          toStr(row.REPA),
          toInt(row.KOKOGO) ?? 0,
        ],
      );
    }

    for (const row of await fetchRows(ora, `SELECT Y_YEAR, STAT, STATX FROM C##DATASO3.YEAR ORDER BY Y_YEAR`)) {
      const y = toInt(row.Y_YEAR);
      if (!y) continue;
      await pg.query(`INSERT INTO "year" (year, start_date, end_date, status, stat) VALUES ($1,$2,$3,$4,$5)`, [
        y,
        `${y}-01-01`,
        `${y}-12-31`,
        toInt(row.STAT) ?? 1,
        toInt(row.STATX) ?? 1,
      ]);
    }

    for (const row of await fetchRows(ora, `SELECT NOS, NOA, MT, KAST, MEMOA, DATES, DATES2, KS, KH, AST, NOADDN, MONTH, RECNO, MSGG FROM C##DATASO3.DATAFF ORDER BY NOS, NOA, RECNO`)) {
      const amount = toNum(row.MT) ?? toNum(row.KAST) ?? toNum(row.AST);
      const notes = joinNotes([
        row.MEMOA,
        row.DATES ? `DATES=${row.DATES.toISOString().slice(0, 10)}` : null,
        row.DATES2 ? `DATES2=${row.DATES2.toISOString().slice(0, 10)}` : null,
        row.KS !== null && row.KS !== undefined ? `KS=${row.KS}` : null,
        row.KH !== null && row.KH !== undefined ? `KH=${row.KH}` : null,
        row.AST !== null && row.AST !== undefined ? `AST=${row.AST}` : null,
        row.NOADDN !== null && row.NOADDN !== undefined ? `NOADDN=${row.NOADDN}` : null,
        row.MONTH !== null && row.MONTH !== undefined ? `MONTH=${row.MONTH}` : null,
        row.RECNO !== null && row.RECNO !== undefined ? `RECNO=${row.RECNO}` : null,
        row.MSGG !== null && row.MSGG !== undefined ? `MSGG=${row.MSGG}` : null,
      ]);
      await pg.query(`INSERT INTO dataff (nos_parent, noa, amount, notes) VALUES ($1,$2,$3,$4)`, [
        toInt(row.NOS),
        toInt(row.NOA),
        amount,
        notes,
      ]);
    }

    for (const row of await fetchRows(ora, `SELECT NOS, DATES, NOAON, NOA, RECNO, NOSM, NOKB, KS, KH, AST, SK, KAST, HD, MT, MD, DATES2, KASB, MEMOA, HAST, ASTS, NOADDN, SKSB, FRKAS, SKM, SKFM, NOFAT, RMG, KRMG, NOFSL, KASD, MONTH, KMSN, SN, FRSN, RTR FROM C##DATASO3.DATAFFX ORDER BY NOS, NOA, RECNO`)) {
      await pg.query(
        `INSERT INTO dataffx (nos, dates, noaon, noa, recno, nosm, nokb, ks, kh, ast, sk, kast, hd, mt, md, dates2, kasb, memoa, hast, asts, noaddn, sksb, frkas, skm, skfm, nofat, rmg, krmg, nofsl, kasd, month, kmsn, sn, frsn, rtr, msgg)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36)`,
        [
          toInt(row.NOS), row.DATES ?? null, toInt(row.NOAON), toInt(row.NOA), toInt(row.RECNO), toInt(row.NOSM), toInt(row.NOKB),
          toNum(row.KS), toNum(row.KH), toNum(row.AST), toInt(row.SK), toNum(row.KAST), toInt(row.HD), toNum(row.MT), toNum(row.MD),
          row.DATES2 ?? null, toNum(row.KASB), left(row.MEMOA, 100), toInt(row.HAST), toNum(row.ASTS), toInt(row.NOADDN), toInt(row.SKSB),
          toNum(row.FRKAS), toInt(row.SKM), toInt(row.SKFM), toInt(row.NOFAT), toInt(row.RMG), toNum(row.KRMG), toInt(row.NOFSL),
          toInt(row.KASD), toInt(row.MONTH), toInt(row.KMSN), toInt(row.SN), toNum(row.FRSN), toNum(row.RTR), null,
        ],
      );
    }

    for (const row of await fetchRows(ora, `SELECT NOS, DATES, NOAON, NOA, RECNO, NOSM, NOKB, KS, KH, AST, SK, KAST, HD, MT, MD, DATES2, KASB, MEMOA, HAST, ASTS, NOADDN, SKSB, FRKAS, SKM, SKFM, NOFAT, RMG, KRMG, NOFSL FROM C##DATASO3.DATAFY ORDER BY NOS, NOA, RECNO`)) {
      await pg.query(
        `INSERT INTO datafy (nos, dates, noaon, noa, recno, nosm, nokb, ks, kh, ast, sk, kast, hd, mt, md, dates2, kasb, memoa, hast, asts, noaddn, sksb, frkas, skm, skfm, nofat, rmg, krmg, nofsl)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)`,
        [
          toInt(row.NOS), row.DATES ?? null, toInt(row.NOAON), toInt(row.NOA), toInt(row.RECNO), toInt(row.NOSM), toInt(row.NOKB),
          toNum(row.KS), toNum(row.KH), toNum(row.AST), toInt(row.SK), toNum(row.KAST), toInt(row.HD), toNum(row.MT), toNum(row.MD),
          row.DATES2 ?? null, toNum(row.KASB), left(row.MEMOA, 100), toInt(row.HAST), toNum(row.ASTS), toInt(row.NOADDN), toInt(row.SKSB),
          toNum(row.FRKAS), toInt(row.SKM), toInt(row.SKFM), toInt(row.NOFAT), toInt(row.RMG), toNum(row.KRMG), toInt(row.NOFSL),
        ],
      );
    }

    for (const row of await fetchRows(ora, `SELECT NOK, DATEK, DATEMO, MDIN, DAN, NOA, NOMS, TYPEMS, MEMOS, TYK, NOKON, RECNO, DKYEAR, NMS, DORY, KG, NOZ, KWKL, NOSNF, MDINAML, DANAML, NOAML, SARSF, NOAML2, NOKALL FROM C##DATASO3.DATAK ORDER BY NOK`)) {
      const noa = toInt(row.NOA);
      const entryDate = row.DATEK ?? row.DATEMO ?? new Date();
      const sourceYear = row.DKYEAR instanceof Date ? row.DKYEAR.getFullYear() : (row.DATEMO instanceof Date ? row.DATEMO.getFullYear() : null);
      const notes = joinNotes([
        row.MEMOS,
        row.NMS ? `NMS=${row.NMS}` : null,
        row.TYPEMS !== null && row.TYPEMS !== undefined ? `TYPEMS=${row.TYPEMS}` : null,
        row.TYK !== null && row.TYK !== undefined ? `TYK=${row.TYK}` : null,
        row.NOKON !== null && row.NOKON !== undefined ? `NOKON=${row.NOKON}` : null,
        row.RECNO !== null && row.RECNO !== undefined ? `RECNO=${row.RECNO}` : null,
        row.DORY !== null && row.DORY !== undefined ? `DORY=${row.DORY}` : null,
        row.KG !== null && row.KG !== undefined ? `KG=${row.KG}` : null,
        row.NOZ !== null && row.NOZ !== undefined ? `NOZ=${row.NOZ}` : null,
        row.KWKL !== null && row.KWKL !== undefined ? `KWKL=${row.KWKL}` : null,
        row.NOSNF !== null && row.NOSNF !== undefined ? `NOSNF=${row.NOSNF}` : null,
        row.MDINAML !== null && row.MDINAML !== undefined ? `MDINAML=${row.MDINAML}` : null,
        row.DANAML !== null && row.DANAML !== undefined ? `DANAML=${row.DANAML}` : null,
        row.NOAML !== null && row.NOAML !== undefined ? `NOAML=${row.NOAML}` : null,
        row.SARSF !== null && row.SARSF !== undefined ? `SARSF=${row.SARSF}` : null,
        row.NOAML2 !== null && row.NOAML2 !== undefined ? `NOAML2=${row.NOAML2}` : null,
        row.NOKALL !== null && row.NOKALL !== undefined ? `NOKALL=${row.NOKALL}` : null,
      ]);
      await pg.query(
        `INSERT INTO datak (noa, datemo, namea, debit, credit, no_m, year, notes, user_id, posted, entry_ref, entry_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          noa,
          row.DATEMO ?? entryDate,
          accountNames.get(noa) || left(row.NMS, 500),
          toNum(row.MDIN) ?? 0,
          toNum(row.DAN) ?? 0,
          toInt(row.NOMS),
          sourceYear,
          notes,
          null,
          0,
          toInt(row.NOK),
          entryDate,
        ],
      );
    }

    for (const row of await fetchRows(ora, `SELECT NOS, NOSON, DATES, NOA, TOTALS, MEMOS, NOK, NOKON, NOAS, NMS, AMR, NOUSX FROM C##DATASO3.SNDK ORDER BY NOS`)) {
      const noa = toInt(row.NOA);
      const nos = toInt(row.NOS);
      await pg.query(
        `INSERT INTO sndk (nos, noson, dates, noa, namea, totals, memos, nms, noas, nok, nokon, amr, sds, nousx)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [
          nos,
          toInt(row.NOSON),
          row.DATES ?? null,
          noa,
          accountNames.get(noa) || null,
          toNum(row.TOTALS) ?? 0,
          left(row.MEMOS, 500),
          toStr(row.NMS),
          toInt(row.NOAS),
          toInt(row.NOK),
          toInt(row.NOKON),
          toInt(row.AMR) ?? 0,
          null,
          toInt(row.NOUSX),
        ],
      );
      if (nos !== null) {
        receiptNos.add(nos);
      }
    }

    for (const row of await fetchRows(ora, `SELECT NOS, NOSM, DATES, NOA, TOTALS, NOAS, MEMOS, TYPEH, RECNO, BAKI, MEMO FROM C##DATASO3.SNDKF ORDER BY NOS, NOA, RECNO`)) {
      const nosParent = toInt(row.NOS);
      const noaf = toInt(row.NOA);
      if (nosParent !== null && !receiptNos.has(nosParent)) {
        await pg.query(
          `INSERT INTO sndk (nos, noson, dates, noa, namea, totals, memos, nms, noas, nok, nokon, amr, sds, nousx)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
          [
            nosParent,
            null,
            row.DATES ?? new Date(),
            noaf,
            accountNames.get(noaf) || null,
            0,
            'Imported placeholder parent for orphan SNDKF row',
            null,
            toInt(row.NOAS),
            null,
            null,
            0,
            null,
            null,
          ],
        );
        receiptNos.add(nosParent);
      }
      const notes = joinNotes([
        row.DATES ? `DATES=${row.DATES.toISOString().slice(0, 10)}` : null,
        row.NOSM !== null && row.NOSM !== undefined ? `NOSM=${row.NOSM}` : null,
        row.MEMOS,
        row.TYPEH !== null && row.TYPEH !== undefined ? `TYPEH=${row.TYPEH}` : null,
        row.RECNO !== null && row.RECNO !== undefined ? `RECNO=${row.RECNO}` : null,
        row.BAKI !== null && row.BAKI !== undefined ? `BAKI=${row.BAKI}` : null,
        row.MEMO !== null && row.MEMO !== undefined ? `MEMO=${row.MEMO}` : null,
      ]);
      await pg.query(
        `INSERT INTO sndkf (nos_parent, noaf, nameaf, amount, noaon, notes)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [nosParent, noaf, accountNames.get(noaf) || null, toNum(row.TOTALS) ?? 0, toInt(row.NOAS), notes],
      );
    }

    for (const row of await fetchRows(ora, `SELECT NOS, NOSON, DATES, NOK, NOA, NOAS, NOSF, SARS, NMS, NOUES, NOKALL, TOTALM, TOTAL, MEMO, NOAM, NOM, NOKON, NOM2, K2020, AMT, NBM, TS FROM C##DATASO3.SNDK22 ORDER BY NOS`)) {
      await pg.query(
        `INSERT INTO sndk22 (nos, noson, dates, nok, noa, noas, nosf, sars, nms, noues, nokall, totalm, total, memo, noam, nom, nokon, nom2, k2020, amt, nbm, ts)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`,
        [
          toInt(row.NOS), toInt(row.NOSON), row.DATES ?? null, toInt(row.NOK), toInt(row.NOA), toInt(row.NOAS), toInt(row.NOSF),
          toNum(row.SARS), left(row.NMS, 50), toInt(row.NOUES), toInt(row.NOKALL), toNum(row.TOTALM), toNum(row.TOTAL), left(row.MEMO, 100),
          toInt(row.NOAM), toInt(row.NOM), toInt(row.NOKON), toInt(row.NOM2), toInt(row.K2020), toNum(row.AMT), left(row.NBM, 30), toInt(row.TS),
        ],
      );
    }

    for (const row of await fetchRows(ora, `SELECT NOA, NAMEA, NOAN, RSD, DA, NAMEG, NAMEH, NOAK, TMIN, TMIN2, TL, NOMO, HL, GKM, TYP, PRFG, NOG, INDXX, NOTMS, TYPC, MEM, TMINALL, FRTM, DA1, RM, RD FROM C##DATASO3.REPMSM ORDER BY NOA`)) {
      await pg.query(
        `INSERT INTO repmsm (noa, namea, noan, rsd, da, nameg, nameh, noak, tmin, tmin2, tl, nomo, hl, gkm, typ, prfg, nog, indxx, notms, typc, mem, tminall, frtm, da1, rm, rd)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,
        [
          toInt(row.NOA), left(row.NAMEA, 50), toInt(row.NOAN), toInt(row.RSD), row.DA ?? null, left(row.NAMEG, 20), left(row.NAMEH, 10),
          left(row.NOAK, 80), toInt(row.TMIN), toInt(row.TMIN2), left(row.TL, 30), toInt(row.NOMO), toInt(row.HL), toInt(row.GKM), toInt(row.TYP),
          toInt(row.PRFG), toInt(row.NOG), left(row.INDXX, 80), toInt(row.NOTMS), left(row.TYPC, 10), left(row.MEM, 100), toNum(row.TMINALL),
          toNum(row.FRTM), row.DA1 ?? null, toInt(row.RM), toInt(row.RD),
        ],
      );
    }

    for (const row of await fetchRows(ora, `SELECT NOS, DATES, NOA, NOA2, KMA, TOTL, SARA, UPD, NMS, NOSON, NOUSX, NOKSNF, NOKONSNF, NOK, NOKON, MEMOS, NOSNF FROM C##DATASO3.THOEL ORDER BY NOS`)) {
      await pg.query(
        `INSERT INTO thoel (nos, dates, noa, noa2, kma, totl, sara, upd, nms, noson, nousx, noksnf, nokonsnf, nok, nokon, memos, nosnf)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          toInt(row.NOS), row.DATES ?? null, toInt(row.NOA), toInt(row.NOA2), toNum(row.KMA), toNum(row.TOTL), toNum(row.SARA), toInt(row.UPD),
          left(row.NMS, 30), toInt(row.NOSON), toInt(row.NOUSX), toInt(row.NOKSNF), toInt(row.NOKONSNF), toInt(row.NOK), toInt(row.NOKON),
          left(row.MEMOS, 50), toInt(row.NOSNF),
        ],
      );
    }

    for (const row of await fetchRows(ora, `SELECT NOA, R, S, D, AST, M FROM C##DATASO3.TR ORDER BY D, NOA`)) {
      const dateValue = row.D ?? null;
      const yearValue = dateValue instanceof Date ? dateValue.getFullYear() : null;
      await pg.query(`INSERT INTO tr (noa, r, s, d, ast, m, y1, y2) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [
        toInt(row.NOA),
        toInt(row.R),
        toInt(row.S),
        dateValue,
        toInt(row.AST),
        toInt(row.M),
        yearValue,
        yearValue,
      ]);
    }

    const seqTables = ['akd','amlh','dataff','dataffx','datafy','datak','grp','mkb','mkb2','moldat','msc','mz','nurs','prg','repmsm','reprorh','sndk22','sndkf','thoel','tr','trmb','ttel','tyht','typems','ty_ms','usergn'];
    for (const t of seqTables) {
      await pg.query(`SELECT setval(pg_get_serial_sequence('${t}','id'), COALESCE((SELECT MAX(id) FROM ${t}), 1), true)`);
    }

    await pg.query('COMMIT');
    console.log('MIGRATION_OK');
  } catch (err) {
    await pg.query('ROLLBACK');
    console.error('MIGRATION_FAILED');
    console.error(err);
    process.exit(1);
  } finally {
    await pg.end();
    await ora.close();
  }
}

main().catch((e) => {
  console.error('FATAL');
  console.error(e);
  process.exit(1);
});
