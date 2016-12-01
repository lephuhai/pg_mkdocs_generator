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
    AND cols.table_schema = $3;`,

    findColumnsAttribute: `SELECT distinct pg_tables.tablename, pg_attribute.attname AS field, 
    format_type(pg_attribute.atttypid, NULL) AS "type", 
    pg_attribute.atttypmod AS len,
    (SELECT col_description(pg_attribute.attrelid, 
            pg_attribute.attnum)) AS comment, 
    CASE pg_attribute.attnotnull 
        WHEN false THEN 1  ELSE 0  
    END AS "notnull", 
    pg_constraint.conname AS "key", pc2.conname AS ckey, 
    (SELECT pg_attrdef.adsrc FROM pg_attrdef 
        WHERE pg_attrdef.adrelid = pg_class.oid 
        AND pg_attrdef.adnum = pg_attribute.attnum) AS def 
FROM information_schema.columns cols, pg_tables, pg_class
JOIN pg_attribute ON pg_class.oid = pg_attribute.attrelid 
    AND pg_attribute.attnum > 0 
LEFT JOIN pg_constraint ON pg_constraint.contype = 'p'::"char" 
    AND pg_constraint.conrelid = pg_class.oid AND
    (pg_attribute.attnum = ANY (pg_constraint.conkey)) 
LEFT JOIN pg_constraint AS pc2 ON pc2.contype = 'f'::"char" 
    AND pc2.conrelid = pg_class.oid 
    AND (pg_attribute.attnum = ANY (pc2.conkey)) 
WHERE pg_class.relname = pg_tables.tablename  
    AND pg_tables.tableowner = "current_user"() 
    AND pg_attribute.atttypid <> 0::oid
    AND cols.table_catalog = $1 
    AND cols.table_schema = $2
    AND tablename= $3
ORDER BY field ASC`
};