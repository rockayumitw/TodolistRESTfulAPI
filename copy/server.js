const http = require('http');
const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    "Content-Type": "text/json"
}
const {v4: uuid4} = require('uuid');
const sucessHandle = require('./sucessHandle.js');
const errHandle = require('./errHandle.js');

const todos = [
    {
        title: '123',
        id: '111'
    }
]

const requestListener = (req, res) => {
    let body = ''

    req.on('data', chunk => body += chunk)

    if(req.url == '/todos' && req.method == 'GET') {
        sucessHandle(res, 200, todos, message = '取得所有列表成功', headers)
    } else if (req.url == '/todos' && req.method == 'POST') {
        req.on('end', () => {
            try{
                const title = JSON.parse(body).title
                if (title !== undefined ) {
                    const todo = {
                        title: title,
                        id: uuid4()
                    }
                    todos.push(todo);
                    sucessHandle(res, 200, todos, message = '新增成功', headers)
                } else {
                    errHandle(res, 400, message='欄位未填寫正確, 或無此todo id', headers)
                }
            }catch(err) {
                errHandle(res, 400, message='欄位未填寫正確, 或無此todo id', headers)
            }
        })
        
    } else if(req.url == '/todos' && req.method == 'DELETE') {
        try {
            todos.length = 0;
            sucessHandle(res, 200, todos, message = '刪除成功', headers)
        } catch(err) {
            errHandle(res, 400, message = '刪除失敗', headers)
        }
    } else if(req.url.startsWith('/todos/') && req.method == 'DELETE') {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(a => a.id == id)
        if(index !== -1) {
            todos.splice(index, 1);
            sucessHandle(res, 200, todos, message = '刪除成功', headers)
        } else {
            errHandle(res, 400, message='欄位未填寫正確, 或無此todo id', headers)
        }
    } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
        req.on('end', () => {
            try{
                const title = JOSN.parse(body).title
                const id = req.url.split('/').pop();
                const index = todos.findIndex(a => a.id == id)

                if(title !== undefined && index !== -1) {
                    todos[index].title = title
                    sucessHandle(res, 200, todos, message = '刪除成功', headers)
                } else {
                    errHandle(res, 400, message='欄位未填寫正確, 或無此todo id', headers)
                }
            } catch(err) {
                errHandle(res, 400, message='欄位未填寫正確, 或無此todo id', headers)
            }
        })
    } else if(req.url.startsWith('/todos/') && req.method == 'GET') {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(a => a.id == id)
        if(index !== -1) {
            sucessHandle(res, 200, todos[index], message = '取得成功', headers)
        } else {
            errHandle(res, 400, message='欄位未填寫正確, 或無此todo id', headers)
        }
    } else if (req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            status: 'fail',
            message: '無此頁面'
        }));
        res.end();
    }
}

http.createServer(requestListener).listen(3005);



// takas
// 第一次紀錄: 46min
// 第二次紀錄: 30min