/**
 * 2020-07-21
 * This file is to create cors module for the origin (Cross-Origin Resource Sharing)
 * by: harris.su.malluege@gmail.com
 */


const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    // Check whether Origin can be found in request header or not
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true};
    } else {
        corsOptions = { origin: false};
    }
    callback(null, corsOptions);
};

exports.cors = cors();
// export the corsWithOptions middleware function
exports.corsWithOptions = cors(corsOptionsDelegate);
