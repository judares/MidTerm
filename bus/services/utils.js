const http = require('http')

const validateDataTaoDonHang = (data) => {

    let errorList = []
    if (data.hotenkhachhang === undefined || data.hotenkhachhang === '') {
        let error = {
            hotenkhachhang: 'Họ tên khách hàng còn trống'
        }
        errorList.push(error)
    } 
    if (data.sodienthoai === undefined || data.sodienthoai === '') {
        let error = {
            sodienthoai: 'Số điện thoại khách hàng còn trống'
        }
        errorList.push(error)
    } 
    if (data.diachikhachhang === undefined || data.diachikhachhang === '') {
        let error = {
            diachikhachhang: 'Địa chỉ tên khách hàng còn trống'
        }
        errorList.push(error)
    }
    if (data.danhsachsanpham === undefined || data.danhsachsanpham.length === 0) {
        let error = {
            danhsachsanpham: 'Danh sách sản phẩm còn trống'
        }
        errorList.push(error)
    }
    if (data.nguoitaodon === undefined || data.nguoitaodon === '') {
        let error = {
            nguoitaodon: 'Thông tin người tạo còn trống'
        }
        errorList.push(error)
    }
    if (data.ngaytaodon === undefined || data.ngaytaodon === '') {
        let error = {
            ngaytaodon: 'Thông tin ngày tạo còn trống'
        }
        errorList.push(error)
    }
    if (data.tongtiendonhang === undefined || data.tongtiendonhang === '') {
        let error = {
            tongtiendonhang: 'Tổng tiền đơn hàng còn trống'
        }
        errorList.push(error)
    }

    return errorList
}

const validateDataUser = (data) => {
    let errorList = []
    if (data.username === undefined || data.username === '') {
        let error = {
            hotenkhachhang: 'Username còn trống'
        }
        errorList.push(error)
    } 
    if (data.password === undefined || data.password === '') {
        let error = {
            hotenkhachhang: 'Password còn trống'
        }
        errorList.push(error)
    } 

    return errorList
}

const getData = (req) => {

    return new Promise((resolve, reject) => {

        if (req.headers['content-type'] === 'application/json') {
            let data = ''
            req.on('data', (chunk) => {
                data += chunk.toString()
            })
            req.on('end', () => {
                resolve(JSON.parse(data))
            })
        } else {
            reject({
                error: "Nhận data lỗi"
            })
        }
    })
}

const createRequest = (option, rq_data) => {

    return new Promise((resolve, reject) => {
        request = http.request(option, (res) => {
            let dataRtn = ''
            res.on('data', (chunk) => {
                dataRtn += chunk
            })
            res.on('end', () => {
                let rtn = {
                    statusCode: res.statusCode,
                    data: JSON.parse(dataRtn)
                }    
                resolve(rtn)
            })
        })
        if (rq_data !== undefined) {
            request.write(rq_data)
        }
        request.end()
    })
}

module.exports = {
    validateDataTaoDonHang: validateDataTaoDonHang,
    validateDataUser: validateDataUser,
    getData: getData,
    createRequest: createRequest,
}