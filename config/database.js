/**
 * Created by hailp on 11/30/16.
 */

"use strict";

module.exports = {
    postgres: {
        user: "postgres",
        database: "payroll",
        password: "abc",
        host: "192.168.1.60",
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000,
        schema: 'public'
    }
};