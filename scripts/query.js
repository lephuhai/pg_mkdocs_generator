/**
 * Created by hailp on 11/30/16.
 */

"use strict";

module.exports = {
    schema_list: `select schema_name
from information_schema.schemata where schema_name not in ('information_schema', 'pg_catalog') and schema_name not like 'pg_t%'`,

    tables_list: `SELECT table_name FROM information_schema.tables 
WHERE table_schema = $1`,

    findTableCommentBySchema: `SELECT c.relname As tname, CASE WHEN c.relkind = 'v' THEN 'view' ELSE 'table' END As type, 
    pg_get_userbyid(c.relowner) AS towner, t.spcname AS tspace, 
    n.nspname AS sname,  d.description
   FROM pg_class As c
   LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
   LEFT JOIN pg_tablespace t ON t.oid = c.reltablespace
   LEFT JOIN pg_description As d ON (d.objoid = c.oid AND d.objsubid = 0)
   WHERE c.relkind IN('r', 'v') AND d.description > '' AND n.nspname = $1
   ORDER BY n.nspname, c.relname ;`,

    tables_comment: `SELECT c.relname As tname, CASE WHEN c.relkind = 'v' THEN 'view' ELSE 'table' END As type, 
    pg_get_userbyid(c.relowner) AS towner, t.spcname AS tspace, 
    n.nspname AS sname,  d.description
   FROM pg_class As c
   LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
   LEFT JOIN pg_tablespace t ON t.oid = c.reltablespace
   LEFT JOIN pg_description As d ON (d.objoid = c.oid AND d.objsubid = 0)
   WHERE c.relkind IN('r', 'v') AND d.description > ''
   ORDER BY n.nspname, c.relname ;`,

    findAllColumnAndComment: `SELECT
    cols.column_name,
    (
        SELECT
            pg_catalog.col_description(c.oid, cols.ordinal_position::int)
        FROM
            pg_catalog.pg_class c
        WHERE
            c.oid = (SELECT ('"' || cols.table_name || '"')::regclass::oid)
            AND c.relname = cols.table_name
    ) AS column_comment
FROM
    information_schema.columns cols
WHERE
    cols.table_catalog    = $1
    AND cols.table_name   = $2
    AND cols.table_schema = $3;`
};