function errHandle(res, code, message='欄位未填寫正確, 或無此todo id', headers) {
    res.writeHead(code, headers);
    res.write(JSON.stringify({
        status: 'fail',
        message: message,
    }))
    res.end();
}

module.exports = errHandle;