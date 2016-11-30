/**
 * Created by hailp on 11/30/16.
 */

"use strict";

/**
 * Nếu không khai báo schema thì mặc định sẽ document tất cả các schema
 * Nếu schema là string thì sẽ document duy nhất 1 schema
 * Nếu schema là 1 array thì sẽ document tất cả schema trong array.
 */

module.exports = {
    postgres: {
        user: "postgres",
        database: "payroll",
        password: "abc",
        host: "192.168.1.60",
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000,
        // schema: 'public' // Optional
    }
};