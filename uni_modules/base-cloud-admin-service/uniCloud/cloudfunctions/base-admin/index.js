'use strict';
const { Router } = require("base-cloud-v3") ;
const router = new Router(require('./config.js'));

exports.main = async (event, context) => {
    return router.serve(event, context)
};