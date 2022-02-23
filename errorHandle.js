function errorHandle(res, headers) {
    res.writeHead(400, headers);
        res.write(JSON.stringify({
            status: 'fail',
            message: '欄位未填寫正確, 或無此todo id'
        }));
    res.end();
}

module.exports = errorHandle;