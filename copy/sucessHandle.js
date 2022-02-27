function sucessHandle(res, code, todos, message='', headers) {
    res.writeHead(code, headers);
    res.write(JSON.stringify({
        status: 'sucess',
        data: todos,
        message: message,
    }))
    res.end();
}

module.exports = sucessHandle;