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


module.exports = {
    mkdocs
};