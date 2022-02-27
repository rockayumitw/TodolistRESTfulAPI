function sucessHandle(res, todos, message = '', headers) {
    res.writeHead(200, headers)
    res.write(JSON.stringify({
        status: 'sucess',
        data: todos,
        message: message,
    }))
    res.end();
}

module.exports = sucessHandle;