const http = require('http') 
const host = 'localhost'
const utils = require('./utils')
const port = 3000

const postCreateOrder = (token, data) => {
    let post_data = JSON.stringify(data)
    let option = {
        host: host,
        port: port,
        path: '/tao-don-hang',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data),
            'token': token
        }
    }

    return new Promise((resolve, reject) => {
        utils.createRequest(option, post_data).then(rtn => {
            resolve(rtn)
        })
    })
}

const postGetUser = (token, data) => {
    let post_data = JSON.stringify(data)
    let option = {
        host: host,
        port: port,
        path: '/user',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data),
            'token': token
        }
    }

    return new Promise((resolve, reject) => {
        utils.createRequest(option, post_data).then(rtn => {
            resolve(rtn)
        })
    })
}

const postAuthenticate = (data) => {
    let post_data = JSON.stringify(data)
    let option = {
        host: host,
        port: port,
        path: '/authenticate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data)
        }
    }
    
    return new Promise((resolve, reject) => {
        utils.createRequest(option, post_data).then(rtn => {
            resolve(rtn)
        })
    })
}

module.exports = {
    postCreateOrder: postCreateOrder,
    postGetUser: postGetUser,
    postAuthenticate: postAuthenticate
}
