# Oracle to PostgreSQL Replace Migration

This script replaces mapped PostgreSQL tables with data imported from the legacy Oracle dump user.

## Script

- `scripts/migrate-oracle-to-postgres-replace.js`
- `scripts/clone-oracle-full-raw.js`

## Run

```bash
npm run migrate:oracle:replace
npm run clone:oracle:raw
```

## Connections used inside script

- Oracle: `C##DATASO3 / 774424555 @ localhost:1521/XE`
- PostgreSQL: `electricity_user / 774424555 @ localhost:5432/electricity_accounting`

## Notes

- Mode is replace (delete then insert) for mapped tables.
- Legacy plain passwords are re-hashed with bcrypt for `user_u` to keep login compatible with NestJS auth.
- Some legacy columns are mapped into `notes` fields where the new schema differs.
- Raw clone mode creates a separate PostgreSQL schema and copies every Oracle table as-is with generic PostgreSQL types.
