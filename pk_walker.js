/**
 * Created by hailp on 12/12/16.
 */

"use strict";

let pg = require('pg'),
    db = require('./config/database'),
    query = require('./utils/postgres'),
    inquirer = require('inquirer'),
    chalk = require('chalk');

var pool = new pg.Pool(db.postgres);

let questions = [{
    type: 'input',
    message: `Schema name`,
    name: 'schema',
    default: function () {
        return 'public'
    }
}, {
    type: 'input',
    message: `Table name`,
    name: 'table',
    default: function () {
        return 'arr_user'
    }
}, {
    type: 'input',
    message: `Column name`,
    name: 'column',
    default: function () {
        return 'id'
    }
}];

inquirer.prompt(questions).then((cmd) => {
    pool.connect((err, client, done) => {

        if (err) {
            return console.error('error fetching client from pool', err);
        }

        query.findForeignKeyFromPK(client, [db.postgres.database, cmd.schema, cmd.table, cmd.column]).then((tables) => {
            console.log(chalk.white.bold('\n    Found ') + chalk.green.bold(`${tables.length}`) + chalk.white.bold(' tables.\n'));
            console.log(JSON.stringify(tables, null, 4));
            done();
            process.exit(0);

        });

    });

    pool.on('error', function (err, client) {
        console.error('idle client error', err.message, err.stack)
    });
});