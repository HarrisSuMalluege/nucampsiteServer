const requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}

console.log(requestTime);