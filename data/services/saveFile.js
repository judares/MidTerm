const fs = require('fs')
const don_hang_dir = __dirname + '/../db/don-hang'
const dien_thoai_dir = __dirname + '/../db/dien-thoai'

const saveOrder = (data) => {

    return new Promise((resolve, reject) => {
        fs.readdir(don_hang_dir, (error, files) => {
            if (error) {
                console.log()
                reject(err)
            }
            
            let path = createFileName(files)
            data = JSON.stringify(data)
            fs.writeFile(path, data, (error2) => {
                if(error2) {
                    reject(error2)
                }
            }) 
        })

        let listPhone = data.danhsachsanpham
        changeQuantitybyOrder(listPhone).catch((error) => {
            reject(error)
        })

        resolve() 
    })   
}

const changeQuantitybyOrder = (listPhone) => {

    return new Promise((resolve, reject) => {
        listPhone.forEach(phone => {
            let path = dien_thoai_dir + '/' + phone.id + '.json' 
            fs.readFile(path, (error, content) => {
                if (error) {
                    console.log("saveFile: Đọc thông tin điện thoại bị lỗi")
                    reject(error)
                }
                content = JSON.parse(content)
                content.so_luong_ton -= phone.soluong
                content.so_luong_ban += parseInt(phone.soluong)
    
                fs.writeFile(path, JSON.stringify(content), (error2) => {
                    if(error2) {
                        reject(error2)
                        console.log("saveFile: Lưu thông tin điện thoại bị lỗi")
                    }
                }) 
            })
        })

        resolve()
    })
}

const changePhoneInfo = (data) => {

    return new Promise((resolve, reject) => {
        let id = data.ma_dien_thoai
        let path = dien_thoai_dir + '/' + id + '.json' 
        fs.readFile(path, (error, content) => {
            if (error) {
                console.log("saveFile: Đọc thông tin điện thoại bị lỗi")
                reject(error)
            }

            content = JSON.parse(content)
            content.so_luong_ton = parseInt(data.so_luong_ton)
            content.gia_tien = parseInt(data.gia_tien)

            fs.writeFile(path, JSON.stringify(content), (error2) => {
                if(error2) {
                    console.log("saveFile: Lưu thông tin điện thoại bị lỗi")
                    reject(error2)
                } 
            }) 
        })

        resolve()
    })
}

const changeStatusOfPhone = (id) => {

    return new Promise((resolve, reject) => {
        let path = dien_thoai_dir + '/' + id + '.json'
        fs.readFile(path, (error, content) => {
            if (error) {
                console.log("saveFile: Đọc thông tin điện thoại bị lỗi")
                reject(error)
            }

            content = JSON.parse(content)
            content.tinh_trang = !content.tinh_trang

            fs.writeFile(path, JSON.stringify(content), (error2) => {
                if(error2) {
                    console.log("saveFile: Lưu thông tin điện thoại bị lỗi")
                    reject(error2)
                } 
            }) 
        })

        resolve()
    })
}

const createFileName = (files) => {

    let filesLength = pad(files.length, 4)
    let check = true
    let fileName = ''
    let path = ''

    while (check) {
        filesLength++
        fileName = 'DH_' + pad(filesLength,4) + '.json'
        path = don_hang_dir + '/' + fileName
    
        if (!fs.existsSync(path)) {
            check = false
        }
    }
    return path
}

const pad = (n, width, z) => {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

module.exports = {
    saveOrder: saveOrder,
    changePhoneInfo: changePhoneInfo,
    changeStatusOfPhone: changeStatusOfPhone,
}