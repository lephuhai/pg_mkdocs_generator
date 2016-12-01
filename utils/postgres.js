/**
 * Created by hailp on 11/30/16.
 */

"use strict";

let script = require('../scripts/query');

function findAllSchema(client) {
    return new Promise((resolve, reject) => {
        client.query(script.schema_list, (err, s) => {
            if (err) {
                reject(Error(err))
            } else {
                let arr = [];
                s.rows.forEach(function (i) {
                    arr.push(i.schema_name);
                });
                resolve(arr);
            }
        })
    });
}

function findTableBySchema(client, schema_name) {
    return new Promise((resolve, reject) => {
        client.query(script.tables_list, [schema_name], (err, t) => {
            if (err) {
                reject(Error(err));
            } else {
                let arr = [];
                t.rows.forEach((i) => {
                    arr.push(i.table_name)
                });
                resolve(arr);
            }
        })
    })
}


// Lấy danh sách những table có comment, tìm kiếm theo schema.

function findTableHasCommentBySchema(client, schema_name) {
    return new Promise((resolve, reject) => {
        client.query(script.findTableCommentBySchema, [schema_name], (err, t) => {
            if (err) {
                reject(Error(err));
            } else {
                let _object = {};
                t.rows.forEach((i) => {
                    _object[i.tname] = i.description;
                });
                resolve(_object);
            }
        })
    })
}

function findAllColumnAndComment(client, catalog, table_name, schema_name, tableHasComment) {
    return new Promise((resolve, reject) => {
        client.query(script.findAllColumnAndComment, [catalog, table_name, schema_name], (err, t) => {
            if (err) {
                reject(Error(err))
            } else {
                let _object = {};
                _object.tableName = {};
                _object.tableName[table_name] = tableHasComment[table_name] || null;
                _object.columns = {};

                t.rows.forEach((i) => {
                    _object.columns[i.column_name] = i.column_comment;
                });
                resolve(_object);
            }
        })
    })
}

function findColumnsAttribute(client, catalog, table_name, schema_name, tableHasComment) {
    return new Promise((resolve, reject) => {

        client.query(script.findColumnsAttribute, [catalog, schema_name, table_name], (err, t) => {
            if (err) {
                reject(Error(err));
            } else {
                let _object = {};

                _object.tableName = {};
                _object.tableName[table_name] = tableHasComment[table_name] || null;
                _object.columns = {};

                t.rows.forEach((i) => {
                    if (_object.columns[i.field]) {
                        _object.columns[' ' + i.field] = {
                            data_type: i.type,
                            comment: i.comment,
                            not_null: i.notnull,
                            key: i.key,
                            ckey: i.ckey,
                            def: i.def
                        }
                    } else {
                        _object.columns[i.field] = {
                            data_type: i.type,
                            comment: i.comment,
                            not_null: i.notnull,
                            key: i.key,
                            ckey: i.ckey,
                            def: i.def
                        }
                    }
                });
                resolve(_object);
            }
        })
    })

}

module.exports = {
    findAllSchema,
    findTableBySchema,
    findTableHasCommentBySchema,
    findAllColumnAndComment,
    findColumnsAttribute
};