/**
 * Created by hailp on 11/30/16.
 */

"use strict";

let pg = require('pg'),
    db = require('./config/database'),
    config = require('./config/config.json'),
    script = require('./scripts/query'),
    generator = require('./utils/generator'),
    chalk = require('chalk'),
    fs = require('fs'),
    spawn = require('child_process').spawn;

let Promise = require('bluebird');

var pool = new pg.Pool(db.postgres);


pool.connect((err, client, done) => {

    if (err) {
        return console.error('error fetching client from pool', err);
    }

    client.query(script.tables_list, (err, result) => {
        if (err) {
            return console.error('error running query', err);
        }

        let tbl_comment = {};

        client.query(script.tables_comment, (err, tbl_result) => {
            for (let i = 0; i < tbl_result.rows.length; i++) {
                tbl_comment[tbl_result.rows[i].tname] = tbl_result.rows[i].description;
            }

            let tables = result.rows;

            let actions = Promise.map(tables, (t) => {
                return new Promise(resolve => {
                    client.query(script.comment_query, [db.postgres.database, t.table_name, db.postgres.schema], (err, result) => {

                        console.log(chalk.white.bgRed.bold('\n    create table: ', t.table_name) + chalk.green.bold(" OK!"), '\n');

                        resolve(generator.mkdocs(tbl_comment, t.table_name, result.rows));
                    })
                })
            });

            Promise.all(actions).then(data => {
                fs.writeFileSync('./docs/index.md', data.join('\n'), {mode: 0x1b6});
                console.log(chalk.green(
                    '\nAll runs OK ' +
                    chalk.blue.underline.bold('./docs/index.md') +
                    ' file created successfully!\n'
                ));

                fs.writeFileSync('./mkdocs.yml', `site_name: ${config.site_name}\ntheme: ${config.theme}`);

                if (config.split) {
                    let _docs = '/docs/';

                    fs.readdir(__dirname + '/docs/', (err, files) => {
                        if (err) process.exit(1);

                        if (files.length) {

                            // Rename file to index.md
                            fs.renameSync(__dirname + _docs + files[0], __dirname + _docs + 'index.md');
                        }
                    });
                }
                spawn('mkdocs', ['build']);

                done();
                process.exit(0);
            });
        });
    })
});

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
});