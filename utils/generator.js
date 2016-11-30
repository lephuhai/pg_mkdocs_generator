/**
 * Created by hailp on 11/30/16.
 */

"use strict";

/**
 *
 * @param tbl_comment: Dach sách các bảng có comment
 * @param table_name: Tên bảng cần được generate ra document
 * @param columns: Danh sách các cột trong bảng và các bình luận của cột nếu có
 * @returns {string}: Nội dung document dạng markdown
 */
function mkdocs(tbl_comment, table_name, columns) {

    let column_content = '';

    for (let i = 0; i < columns.length; i++) {
        column_content += '\n' + '* `' + columns[i].column_name + '` - ' + columns[i].column_comment;
    }

    if (tbl_comment[table_name]) {
        // If table exist comment
        return `## ${table_name}\n
    ${tbl_comment[table_name]}
${column_content}\n`;
    } else {
        return `## ${table_name}${column_content}\n`;
    }

}


module.exports = {
    mkdocs
};