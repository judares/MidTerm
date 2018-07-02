const app = require('http')
const url = require('url')
const jwt = require('jsonwebtoken')
const querystring = require('querystring')
const getMethod = require('./services/getMethod')
const postMethod = require('./services/postMethod')
const putMethod = require('./services/putMethod')
const deleteMethod = require('./services/deleteMethod')

const utils = require('./services/utils')
const port = 3001
const busAccount = {
    name: "BUS",
    pwd : "BUS"
}
let tokenBUS

app.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')

    console.log(req.method, req.url)
    let pathname = url.parse(req.url).pathname

    switch (req.method) {
        case 'GET':
            switch (pathname) {
                case '/danh-sach-dien-thoai':
                    console.log("BUS:   Lấy danh sách điện thoại ")
                    getMethod.getPhoneList(tokenBUS).then((rtn) => {
                        res.writeHeader(rtn.statusCode, {
                            'content-type': 'application/json'
                        })
                        res.end(JSON.stringify(rtn.data))
                    }).catch(() => {
                        res.writeHeader(400, {
                            'Content-Type': 'application/json',
                        })
                        res.end({error: "BUS:    Không lấy được danh sách điện thoại "})
                    })
                    break

                case '/dien-thoai':
                    console.log("BUS:   Lấy thông tin điện thoại ")
                    let query = url.parse(req.url).query
                    let convertQuery = querystring.parse(query)
                    getMethod.getPhoneByID(tokenBUS, convertQuery.id).then((rtn) => {
                        res.writeHeader(rtn.statusCode, {
                            'Content-Type': 'application/json'
                        })
                        res.end(JSON.stringify(rtn.data))
                    }).catch(() => {
                        res.writeHeader(400, {
                            'Content-Type': 'application/json'
                        })
                        res.end({error: "BUS:   Không lấy được thông tin điện thoại"})
                    })
                    break

                default:
                    res.writeHeader(404, {
                        'Content-type': 'application/json'
                    })
                    res.end({
                        error: "Request was not support!!!"
                    })
                    break
            }
            break

        case 'POST':
            switch (pathname) {
                case '/tao-don-hang':
                    console.log("BUS:   Tạo đơn hàng ")
                    utils.getData(req).then((data) => {
                        console.log(JSON.stringify(data))
                        let errorList = utils.validateDataTaoDonHang(data)
                        if (errorList.length !== 0) {
                            res.writeHeader(400, {
                                'Content-Type': 'application/json'
                            })
                            res.end(JSON.stringify(errorList))
                        } else {
                            postMethod.postCreateOrder(tokenBUS, data).then(rtn => {
                                res.writeHeader(rtn.statusCode, {
                                    'Content-Type': 'application/json'
                                })
                                res.end(JSON.stringify(rtn.data))
                            }).catch(() => {
                                res.writeHeader(400, {
                                    'Content-Type': 'application/json'
                                })
                                res.end({error: "BUS:   Bad request"})
                            })
                        }
                    }).catch(() => {
                        res.writeHeader(400, {
                            'Content-Type': 'application/json'
                        })
                        res.end({error: "BUS:   Bad request"})
                    })
                    break

                case '/user':
                    console.log("BUS:   Kiểm tra thông tin tài khoản người dùng ")
                    utils.getData(req).then(data => {
                        console.log(data)
                        let errorList = utils.validateDataUser(data) 
                        if (errorList.length !== 0) {
                            res.writeHeader(400, {
                                'Content-Type': 'application/json'
                            })
                            res.end(JSON.stringify(errorList))
                        } else {
                            postMethod.postGetUser(tokenBUS, data).then(rtn => {
                                if (rtn.statusCode === 200) {
                                    jwt.sign({data}, 'userBusAuthenticate', (err, token) => {
                                        if (err) {
                                            console.log(err)
                                            console.log("   Tạo token không thành công ")
                                            res.end(400)
                                        } else {
                                            res.writeHeader(200, {
                                                'content-type': 'application/json'
                                            })
                                            res.end(JSON.stringify({
                                                token: token,
                                                name: rtn.data.name,
                                                role: rtn.data.role,
                                            }))
                                        }
                                    }) 
                                }
                                else {
                                    res.writeHeader(rtn.statusCode, {
                                        'Content-Type': 'application/json'
                                    })
                                    res.end(JSON.stringify(rtn.data))
                                }

                            }).catch(() => {
                                res.writeHeader(400, {
                                    'Content-Type': 'application/json'
                                })
                                res.end({error: "BUS:   Bad request"})
                            })
                        }
                    }) 
                    break

                default:
                    res.writeHeader(404, {
                        'Content-type': 'application/json'
                    })
                    res.end({
                        error: "Request was not support!!!"
                    })
                    break
            }
            break

        case 'PUT':
            switch (pathname) {
                case '/dien-thoai':
                    console.log("BUS:   Sửa thông tin điện thoại ")
                    utils.getData(req).then(data => {
                        console.log(data)
                        putMethod.putPhoneQuantity(tokenBUS, data).then((rtn) => {
                            console.log(rtn)
                            res.writeHeader(rtn.statusCode, {
                                'Content-Type': 'application/json'
                            })
                            res.end(JSON.stringify(rtn.data))
                        }).catch(() => {
                            res.writeHeader(400, {
                                'Content-Type': 'application/json'
                            })
                            res.end(JSON.stringify({
                                error: "BUS:   Bad request"
                            }))
                        })
                    }).catch(() => {
                        res.writeHeader(400, {
                            'Content-Type': 'application/json'
                        })
                        res.end(JSON.stringify({error: "BUS:   Bad request"}))
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
                    console.log("BUS:   Thay đổi tình trạng điện thoại ")
                    let query = url.parse(req.url).query
                    let convertQuery = querystring.parse(query)

                    deleteMethod.deleteChangePhoneStatus(tokenBUS, convertQuery.id).then((rtn) => {
                        res.writeHeader(rtn.statusCode, {
                            'Content-Type': 'application/json'
                        })
                        res.end(JSON.stringify(rtn.data))
                    }).catch(() => {
                        res.writeHeader(400, {
                            'Content-Type': 'application/json'
                        })
                        res.end(JSON.stringify({
                            error: "BUS:   Không thay đổi được tình trạng điện thoại "
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

        case 'OPTIONS': 
            res.statusCode = 200
            res.end()
            break
    }

}).listen(port, (err) => {
    if (err != null)
        console.log('==> Error: ' + err)
    else {
        console.log('Server is starting at port ' + port)

        postMethod.postAuthenticate(busAccount).then(rtn => {
            tokenBUS = rtn.data.token
            console.log(tokenBUS)
        }).catch(error => {
            console.log(error)
        })
    }
})