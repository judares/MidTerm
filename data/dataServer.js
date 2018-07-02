const app = require('http')
const url = require('url')
const querystring = require('querystring')
const getMethod = require('./services/getMethod')
const saveFile = require('./services/saveFile')
const dataListener = require('./services/dataListener')
const jwt = require('jsonwebtoken')
const port = 3000

let session = []
let DS_DienThoai = []
let busAccount = {
    name: 'BUS',
    pwd: 'BUS'
}

const checkAuth = (token) => {
    if (token === undefined) 
        return false 
    else {
        jwt.verify(token, 'busServerAuthenticate', (error, tokenData) => {
            if (error) {
                return false
            }
            else {
                console.log(tokenData)
                if (tokenData.user.name == busAccount.name && tokenData.user.pwd == busAccount.pwd)
                    return true
            }
        })
    }
}

app.createServer((req, res) => {

    // if (DS_DienThoai === null)

    console.log(`${req.method} ${req.url}`)
    let pathname = url.parse(req.url).pathname

    //  Xác thực busServer và trả về token cho các hành động tiếp theo
    if (req.method === 'POST' && pathname === '/authenticate') {
        console.log("SERVER:    Xác thực bus ")
        dataListener.getData(req).then(user => {
            if (user.name == busAccount.name && user.pwd == busAccount.pwd) {
                console.log("   Tài khoản hợp lệ ")
                jwt.sign({user}, 'busServerAuthenticate', (err, token) => {
                    if (err) {
                        console.log(err)
                        console.log("   Tạo token không thành công ")
                        res.end(400)
                    } else {
                        res.writeHeader(200, {
                            'content-type': 'application/json'
                        })
                        res.end(JSON.stringify({
                            token: token
                        }))
                    }
                })                            
            } else {
                console.log("   Tài khoản không hợp lệ ")
                res.writeHeader(400, {
                    'content-type': 'application/json'
                })
                res.end(JSON.stringify({
                    error: '   Đăng nhập không thành công'
                }))
            }
        }).catch(error => {
            console.log(error)
            res.writeHeader(400, {
                'content-type': 'application/json'
            })
            res.end(JSON.stringify({
                error: '   Lỗi đọc dữ liệu post không thành công'
            }))
        })
    } 
    //  Các phương thức khác
    else {
        let token = req.headers['token']
        if (checkAuth(token)) {
            res.writeHeader(403, {
                'Content-type': 'application/json'
            })
            res.end(JSON.stringify({
                error: "    Non permission"
            }))
        } else {
            switch (req.method) {
                case 'GET':
                    switch (pathname) {
                        case '/danh-sach-dien-thoai':
                            console.log("SERVER:    Lấy danh sách điện thoại ")
                            getMethod.get_DS_DienThoai().then(data => {
                                DS_DienThoai = data
                                res.writeHeader(200, {
                                    'content-type': 'application/json'
                                })
                                res.end(JSON.stringify(DS_DienThoai))
                            }).catch(error => {
                                console.log("   Lấy danh sách đt lỗi! ")
                                res.writeHeader(400, {
                                    'content-type': 'application/json'
                                })
                                res.end(JSON.stringify({
                                    error: error
                                }))
                            })
                            break
    
                        case '/dien-thoai':
                            console.log("SERVER:    Lấy thông tin điện thoại ")
                            let query = url.parse(req.url).query
                            let convertQuery = querystring.parse(query)
                            let id = convertQuery.id
                            let DienThoai = getMethod.get_DienThoai(DS_DienThoai, id)
    
                            if (DienThoai === null) {
                                console.log("   CSDL không tồn tại điện thoại này! ")
                                res.writeHeader(400, {
                                    'content-type': 'application/json'
                                })
                                res.end(JSON.stringify({
                                    error: 'CSDL không tồn tại điện thoại này'
                                }))
                            } else {
                                res.writeHeader(200, {
                                    'content-type': 'application/json'
                                })
                                res.end(JSON.stringify(DienThoai))
                            }
                            break
    
                        default:
                            res.writeHeader(404, {
                                'Content-type': 'application/json'
                            })
                            res.end(JSON.stringify({
                                error: "Request was not support!!!"
                            }))
                            break
                    }
                    break
    
                case 'POST':
                    switch (pathname) {
                        case '/tao-don-hang':
                            console.log("SERVER:    Tạo đơn hàng ")
                            dataListener.getData(req).then(data => {
                                saveFile.saveOrder(data).then(() => {
                                    console.log("   Tạo đơn hàng thành công! ")
                                    res.writeHeader(201, {
                                        'content-type': 'application/json'
                                    })
                                    res.end(JSON.stringify({
                                        status: "Tạo đơn hàng thành công"
                                    }))
                                }).catch((error) => {
                                    console.log("   Tạo đơn hàng thất bại! ")
                                    res.writeHeader(400, {
                                        'content-type': 'application/json'
                                    })
                                    res.end(JSON.stringify({
                                        error: error
                                    }))
                                })
                            }).catch((error) => {
                                res.writeHeader(400, {
                                    'content-type': 'application/json'
                                })
                                res.end(JSON.stringify({
                                    error: error
                                }))
                            })
                            break

                        case '/user':
                            console.log("SERVER:    Lấy thông tin nhân viên ")
                            dataListener.getData(req).then(data => {
                                user = getMethod.get_User(data.username)
                                console.log(data)
                                console.log(user)
                                if (user === false) {
                                    console.log(1)
                                    res.writeHeader(404, {
                                        'content-type': 'application/json'
                                    })
                                    res.end(JSON.stringify({
                                        error: "Sai tên người dùng hoặc mật khẩu"
                                    }))
                                } else if (user.username === data.username && user.password === data.password) {
                                    res.writeHeader(200, {
                                        'content-type': 'application/json'
                                    })
                                    res.end(JSON.stringify({
                                        name: user.name,
                                        role: user.role
                                    }))
                                } else {
                                    res.writeHeader(404, {
                                        'content-type': 'application/json'
                                    })
                                    res.end(JSON.stringify({
                                        error: "Sai tên người dùng hoặc mật khẩu"
                                    }))
                                }
                            }).catch(() => {
                                res.writeHeader(400, {
                                    'content-type': 'application/json'
                                })
                                res.end(JSON.stringify({
                                    error: "Bad request"
                                }))
                            })
                            break
    
                        default:
                            res.writeHeader(404, {
                                'Content-type': 'application/json'
                            })
                            res.end(JSON.stringify({
                                error: "Request was not support!!!"
                            }))
                            break
                    }
                    break
    
                case 'PUT':
                    switch (pathname) {
                        case '/dien-thoai':
                            console.log("SERVER:    Thay đổi thông tin điện thọai ")
                            dataListener.getData(req).then(data => {
                                console.log(data)
                                saveFile.changePhoneInfo(data).then(() => {
                                    res.writeHeader(201, {
                                        'content-type': 'application/json'
                                    })
                                    res.end(JSON.stringify({
                                        status: "Thay đổi thông tin điện thoại thành công"
                                    }))
                                }).catch((error) => {
                                    res.writeHeader(400, {
                                        'Content-type': 'application/json'
                                    })
                                    res.end(JSON.stringify({
                                        error: error
                                    }))
                                })
                            }).catch(() => {
                                res.writeHeader(400, {
                                    'Content-type': 'application/json'
                                })
                                res.end(JSON.stringify({
                                    error: "Bad request"
                                }))
                            })
                            break
    
                        default:
                            res.writeHeader(404, {
                                'Content-type': 'application/json'
                            })
                            res.end(JSON.stringify({
                                error: "Request was not support!!!"
                            }))
                            break
                    }
                    break
    
                case 'DELETE':
                    switch (pathname) {
                        case '/dien-thoai':
                            console.log("SERVER:    Thay đổi tình trạng điện thoại ")
                            let query = url.parse(req.url).query
                            let convertQuery = querystring.parse(query)
                            let id = convertQuery.id
    
                            saveFile.changeStatusOfPhone(id).then(() => {
                                console.log("   Thay đổi tình trạng điện thoại " + id + " thành công ")
                                res.writeHeader(200, {
                                    'Content-type': 'application/json'
                                })
                                res.end(JSON.stringify({
                                    status: "Thay đổi tình trạng điện thoại " + id + " thành công "
                                }))
                            }).catch(() => {
                                console.log("   Thay đổi tình trạng điện thoại " + id + " thất bại ")
                                res.writeHeader(400, {
                                    'Content-type': 'application/json'
                                })
                                res.end(JSON.stringify({
                                    error: "Thay đổi tình trạng điện thoại " + id + " thất bại "
                                }))
                            })
                            break
    
                        default:
                            res.writeHeader(404, {
                                'Content-type': 'application/json'
                            })
                            res.end(JSON.stringify({
                                error: "Request was not support!!!"
                            }))
                            break
                    }
                    break
            }
        }        
    }
}).listen(port, (err) => {
    if (err != null)
        console.log('==> Error: ' + err)
    else
        console.log('Server is starting at port ' + port)
})