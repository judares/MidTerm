const http = require('http') 
const host = 'localhost'
const utils = require('./utils')
const port = 3000

const deleteChangePhoneStatus = (token, id) => {
    let path = '/dien-thoai?id=' + id
    let option = {
        host: host,
        port: port,
        path: path,
        method: 'DELETE',
        headers: {
            'token': token
        }
    }
    //console.log(path)
    return new Promise((resolve, reject) => {
        utils.createRequest(option).then(rtn => {
            resolve(rtn)
        })
    })    
}

module.exports = {
    deleteChangePhoneStatus: deleteChangePhoneStatus,
}