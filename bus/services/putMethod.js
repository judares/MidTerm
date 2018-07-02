const http = require('http') 
const host = 'localhost'
const utils = require('./utils')
const port = 3000

const putPhoneQuantity = (token, data) => {
    let put_data = JSON.stringify(data)
    let path = '/dien-thoai'
    let option = {
        host: host,
        port: port,
        path: path,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(put_data),
            'token': token
        }
    }

    return new Promise((resolve, reject) => {
        utils.createRequest(option, put_data).then(rtn => {
            resolve(rtn)
        })
    })    
}

module.exports = {
    putPhoneQuantity: putPhoneQuantity,
}