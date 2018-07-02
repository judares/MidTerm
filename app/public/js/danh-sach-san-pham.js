let DS_DienThoai = [];

$(document).ready(function() {

    $.ajax({
        async: 'false',
        type: 'GET',
        url: 'http://localhost:3001/danh-sach-dien-thoai',
        crossDomain: 'true',
        header: {
            'Content-Type': 'application/json',
        },
        success: function(res) {   

            for (let DT of res) {
                if (DT.tinh_trang === true) {
                    DS_DienThoai.push(DT);
                }
            }

            let TH_DS_DienThoai = tao_TH_DS_DienThoai(DS_DienThoai);
            //console.log(TH_DS_DienThoai);
            $("#TH_DS_DienThoai").prepend(TH_DS_DienThoai);
        }
    })
})

const tao_TH_DS_DienThoai = function(DS) {

    let TH_DS_DienThoai = '';
    let row_DS_DienThoai = '';
    for (let i = 0; i < DS.length && i < 10; i++) {

        let DienThoai = DS[i];
        let DienThoaiHtml = `
            <div class="col-md-3 col-sm-6">
                <div class="single-shop-product">
                    <div class="product-upper">
                        <img src="img/${DienThoai.hinh_anh}.jpg" alt="">
                    </div>
                    <h2>
                        <a href="chi-tiet-san-pham.html?id=${DienThoai.ma_dien_thoai}">${DienThoai.ten_dien_thoai}</a>
                    </h2>
                    <div class="product-carousel-price">
                        Giá bán:
                        <ins>${DienThoai.gia_tien}</ins>
                    </div>

                    <div class="product-option-shop">
                        <a class="add_to_cart_button" data-quantity="1" data-product_sku="" data-product_id="70" rel="nofollow" href="chi-tiet-san-pham.html?id=${DienThoai.ma_dien_thoai}">Xem chi tiết</a>
                    </div>
                </div>
            </div>`

        row_DS_DienThoai += DienThoaiHtml;
        if ((i+1) % 4 == 0 || (i+1) == DS.length) {
            row_DS_DienThoai = `<row>` + row_DS_DienThoai + `</row>`;
            TH_DS_DienThoai += row_DS_DienThoai;
            row_DS_DienThoai = '';
        }
    }
    
    return TH_DS_DienThoai;
}