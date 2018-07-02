const http = require('http')
const host = 'localhost'
const utils = require('./utils')
const port = 3000

const getPhoneList = (token) => {
    let path = '/danh-sach-dien-thoai'
    let option = {
        host: host,
        port: port,
        path: path,
        method: 'GET',
        headers: {
            'token': token
        }
    }

    return new Promise((resolve, reject) => {
        utils.createRequest(option).then(rtn => {
            resolve(rtn) 
        })
    })  
}

const getPhoneByID = (token, id) => {
    let path = '/dien-thoai?id=' + id
    let option = {
        host: host,
        port: port,
        path: path,
        method: 'GET',
        headers: {
            'token': token
        }
    }

    return new Promise((resolve, reject) => {
        utils.createRequest(option).then(rtn => {
            resolve(rtn) 
        })
    })  
}

module.exports = {
    getPhoneList: getPhoneList,
    getPhoneByID: getPhoneByID,
}
