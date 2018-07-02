const getData = (req) => {
    let promise = new Promise((resolve, reject) => {
        if (req.headers['content-type'] === 'application/json') {
            let data = '';
            req.on('data', (chunk) => {
                data += chunk.toString();
            });
            req.on('end', () => {
                resolve(JSON.parse(data));
            })
        } else {
            reject({
                error: "Nhận data lỗi"
            })
        } 
    }) 

    return promise;
}

module.exports = {
    getData: getData,
}