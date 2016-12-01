/**
 * Created by hailp on 11/30/16.
 */

"use strict";

let pg = require('pg'),
    db = require('./config/database'),
    config = require('./config/config.json'),
    generator = require('./utils/generator'),
    chalk = require('chalk'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    query = require('./utils/postgres');

let Promise = require('bluebird');

var pool = new pg.Pool(db.postgres);


pool.connect((err, client, done) => {

    if (err) {
        return console.error('error fetching client from pool', err);
    }

    if (!db.schema) {
        // Get all schema list
        query.findAllSchema(client).then((Schema) => {
            let root = Schema.map((s) => {
                return new Promise(resolve => {
                    // List table has comment
                    query.findTableHasCommentBySchema(client, s).then((tableHasComment) => {

                        query.findTableBySchema(client, s).then((tables) => {
                            let actions = Promise.map(tables, (t) => {
                                return new Promise(r => {

                                    console.log(chalk.white.bgRed.bold('\n    create table: ', t) + chalk.green.bold(" OK!"), '\n');

                                    r(query.findColumnsAttribute(client, db.postgres.database, t, s, tableHasComment))
                                })
                            });

                            Promise.all(actions).then(data => {
                                resolve({
                                    schema: s,
                                    data
                                });
                            })
                        })
                    });
                });
            });

            Promise.all(root).then(function (results) {
                generator.v2_mkdocs(results);

                let fs = require('fs');

                // Rename file to index.md
                fs.renameSync(__dirname + '/docs/public.md', __dirname + '/docs/index.md');

                fs.writeFileSync('./mkdocs.yml', `site_name: ${config.site_name}\ntheme: ${config.theme}`);
                spawn('mkdocs', ['build']);

                setTimeout(() => {
                    if (config.theme == 'readthedocs') {
                        fs.unlinkSync(__dirname + '/site/css/theme.css');
                        require('fs-extra').copySync(__dirname + '/utils/readthedocs_theme.css', __dirname + '/site/css/theme.css');
                    }

                    console.log(chalk.green(
                        '\nAll runs OK ' +
                        chalk.blue.underline.bold('./site/') +
                        ' document created successfully!\n'
                    ));

                    done();
                    process.exit(0);
                }, 500);
            })
        });


    } else if (typeof db.schema === 'string') {
        // Get only schema
    } else if (typeof db.schema === 'object') {

    } else {
        console.log(chalk.red("ERROR: Schema not found!"))
    }
});

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
});