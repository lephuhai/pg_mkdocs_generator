/**
 * Created by hailp on 11/30/16.
 */

"use strict";

let items = [1, 2, 3, 4, 5];

var actions = items.map(function (v) {
    return new Promise(resolve => {
        resolve(v * 2);
    })
});

var results = Promise.all(actions);

results.then(data => {
    console.log(data);
});