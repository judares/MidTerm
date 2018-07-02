var app = require('http')
var fs = require('fs')
var url = require('url');

var port = 3002

app.createServer((req, res) => {

    let pathname = url.parse(req.url).pathname;
    let req_url;

    switch (pathname) {
        case '/':
            req_url = '/index.html';
            break;
        case '/admin/':
            req_url = '/admin/index.html';
            break;
        default:
            req_url = pathname;
            break;
    }

    var file_extension = pathname.lastIndexOf('.');
    var header_type = (file_extension == -1 
                        && pathname != '/' && pathname != '/admin/')
                    ? 'text/plain'
                    : {
                        '/' : 'text/html',
                        '/admin/' : 'text/html',
                        '.html' : 'text/html',
                        '.ico' : 'image/x-icon',
                        '.jpg' : 'image/jpeg',
                        '.png' : 'image/png',
                        '.gif' : 'image/gif',
                        '.css' : 'text/css',
                        '.js' : 'text/javascript',
                        '.woff' : 'font/woff', 
                        '.woff2' : 'font/woff'
                        }[ pathname.substr(file_extension) ];

    // Đọc file theo req gửi từ Client lên (lưu ý, phần này sẽ được call nhiều lần để đọc các file Resource)
    fs.readFile( __dirname + req_url, (err, data)=>{
        if (err) {
            // Xử lý phần tìm không thấy resource ở Server
            console.log('==> Error: ' + err)
            console.log('==> Error 404: file not found ' + pathname)
            
            // Set Header của res thành 404 - Not found (thông báo lỗi hiển thị cho Client --> coi trong phần console của Browser nếu có lỗi)
            res.writeHead(404, 'Not found')
            res.end()
        } else {
            // Set Header cho res (phần header_type đã được xử lý tính toán ở dòng code thứ 16 và 17)
            res.setHeader('Content-type' , header_type);

            res.end(data);

            if (header_type == 'text/html') {
                console.log(`${req.method} ${pathname}`);
            }
        }
    })
}).listen(port, (err) => {
    if(err != null)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})