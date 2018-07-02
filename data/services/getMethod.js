'use strict'

const fs = require('fs')
const dien_thoai_dir = __dirname + '/../db/dien-thoai'
const user_dir = __dirname + '/../db/user'


const get_DS_DienThoai = () => {

    return new Promise((resolve, reject) => {
        fs.readdir(dien_thoai_dir, (err, filenames) => {
            if (err) {
                reject({
                    error: "Đọc folder lưu thông tin điện thoại lỗi"
                })
            }
            let data = []
            filenames.forEach((filename) => {
                let path = dien_thoai_dir + '/' + filename
                let content = fs.readFileSync(path, 'utf-8')
                if (content === undefined || content === null || content == '') {
                    reject({
                        filename: filename,
                        error: "Đọc file lưu thông tin điện thoại lỗi"
                    })
                }  
                data.push(JSON.parse(content))
            })
            resolve(data)
        })
    })
}

const get_DienThoai = (DS_DienThoai, id) => {
    
    for (let DienThoai of DS_DienThoai) {
        if (DienThoai.ma_dien_thoai === id) {
            return DienThoai
        }
    }

    return null
} 

const get_User = (username) => {
    let path = user_dir + '/' + username + '.json'
    // console.log(path)
    let content = fs.readFileSync(path, 'utf-8')
    if (content === undefined || content === null || content == '') {
        return false
    }  
    else {
        return JSON.parse(content)
    }
}

module.exports = {
    get_DS_DienThoai: get_DS_DienThoai,
    get_DienThoai: get_DienThoai,
    get_User: get_User,
}