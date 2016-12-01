/**
 * Created by hailp on 11/30/16.
 */

"use strict";

let config = require('../config/config.json');

/**
 *
 * @param tbl_comment: Dach sách các bảng có comment
 * @param table_name: Tên bảng cần được generate ra document
 * @param columns: Danh sách các cột trong bảng và các bình luận của cột nếu có
 * @returns {string}: Nội dung document dạng markdown
 */
function mkdocs(tbl_comment, table_name, columns) {

    let column_content = '',
        result = '';

    for (let i = 0; i < columns.length; i++) {
        column_content += '\n' + '* `' + columns[i].column_name + '` - ' + columns[i].column_comment;
    }

    if (tbl_comment[table_name]) {
        // If table exist comment
        result = `## ${table_name}\n
    ${tbl_comment[table_name]}
${column_content}\n`;

    } else {
        result = `## ${table_name}${column_content}\n`;
    }


    if (config.split) {
        let fs = require('fs'),
            path = require('path');

        fs.writeFileSync(path.resolve(__dirname, '..') + `/docs/${table_name}.md`, result, {mode: 0x1b6});
    }

    return result;
}

function v2_mkdocs(model_schema) {

    let draw_title = '';


    model_schema.map((s) => {
        let file_name = s.schema;
        let data = s.data;

        let content = '';

        data.map((t) => {
            draw_title = `## ${Object.keys(t.tableName)[0]}\n
    ${t.tableName[Object.keys(t.tableName)[0]]}\n`;

            let draw_table = `
Tên cột      | Kiểu dữ liệu  | Not null    | key       | ckey 		 | def		 | comment
------------ | ------------- | ----------- | --------- | ----------- | --------- | ---------
`;
            let columns = Object.keys(t.columns);

            if (columns.length) {
                for (let i = 0; i < columns.length; i++) {
                    draw_table += `${columns[i]} | ${t.columns[columns[i]].data_type || ''} | ${t.columns[columns[i]].not_null}| ${t.columns[columns[i]].key} | ${t.columns[columns[i]].ckey} | ${t.columns[columns[i]].def} | ${t.columns[columns[i]].comment}\n`;
                }
            }
            content += `${draw_title} ${draw_table}\n\n`;
        });

        let fs = require('fs'),
            path = require('path');
        fs.writeFileSync(path.resolve(__dirname, '..') + `/docs/${file_name}.md`, `${content}`, {mode: 0x1b6});
    });

    process.exit(0);

}


module.exports = {
    mkdocs,
    v2_mkdocs
};