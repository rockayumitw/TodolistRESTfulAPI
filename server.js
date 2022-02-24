const http = require('http'); // 載入http
const {v4: uuid4} = require('uuid'); // 產生唯一值
const errHandle = require('./errorHandle'); // 錯誤處裡

// 儲存陣列 -練習用
const todos = []; 

// params: req => 使用者請求資料, res => 回應資料
const requestListener = (req, res) => {
    console.log(req.url, req.method)

    // 表頭設定
    const headers = {
        // 跨網域設定, 讓其他伺服器可以去造訪
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',

        // 支援方法
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        "Content-Type": "text/json"
    }

    // 當使用者從瀏覽器傳送資訊, 要取得body(後端接收資料)
    let body = '';
    // 接收到的資料做累加
    // chunk: 切割資料(封包)
    req.on('data', chunk => {
        body += chunk;
    });

    if(req.url == '/todos' && req.method == "GET") {
        // params: 表頭類型, 格式
        res.writeHead(200, headers);
        res.write(JSON.stringify({ // 網路不知道物件是甚麼東西, 所以要改成字串
            status: 'success',
            data: todos,
        }));
        res.end(); // 送出
        // https://localhost:559/
    } else if (req.url == '/todos' && req.method == 'POST') {
        // body累加完最後要輸出的結果
        req.on('end', () => {
            // 異常判斷
            try{
                // 要取得物件的參數
                const title = JSON.parse(body).title

                // 判斷是否有title屬性
                if (title !== undefined) {
                    const todo = {
                        title: title,
                        id: uuid4(),
                    }
                    todos.push(todo);
                    console.log(todos)
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        status: 'success',
                        data: todos
                    }));
                    res.end(); // 送出結果 -必寫
                } else {
                    errHandle(res, headers);
                }
            } catch(error) {
                console.log(error + ':程式碼錯誤')
                errHandle(res, headers);
            }
        });
    } else if (req.url == '/todos' && req.method == "DELETE") {
        console.log('全部')
        try{
            todos.length = 0;
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                status: 'success',
                data: todos,
                message: '刪除成功'
            }));
            res.end(); // 送出結果 -必寫
        } catch(err) {
            console.log(error + ':程式碼錯誤')
            errHandle(res, headers);
        }
    } else if(req.url.startsWith("/todos/") && req.method =="DELETE") {
        console.log('單筆')
        const id =  req.url.split('/').pop();
        const index = todos.findIndex(el => el.id == id);
        console.log(index)
        if(index != -1) {
            todos.splice(index, 1); //
            // 猜出資料並擷取資訊
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": todos,
            }));
            res.end();
        } else {
            errHandle(res, headers);
        }

        
    } else if(req.url.startsWith("/todos/") && req.method =="PATCH") {
        req.on('end', () => {
            try {
                const todo = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(el => el.id == id);
                if (todo !== undefined && index !== -1) {
                    todos[index].title = todo
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos,
                    }));
                    res.end();
                } else {
                    errHandle(res, headers);
                }
            } catch {
                errHandle(res, headers);
            }
        })
        
    }
    else if(req.method == "OPTIONS") { // prelight請求
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            status: 'fail',
            message: '無此頁面',
        }));
        res.end(); // 送出
    }
}

// 帶函式監聽進去: requestListener
const server = http.createServer(requestListener); // run server
server.listen(process.env.PORT || 3005);