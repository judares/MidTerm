$(document).ready(function () {

    let id_DienThoai = getParam('id');
    let url = 'http://localhost:3001/dien-thoai?id=' + id_DienThoai;

    console.log(url);

    $.ajax({
        async: 'false',
        type: 'GET',
        url: url,
        crossDomain: 'true',
        header: {
            'Content-Type': 'application/json',
        },
        success: function(res) {     
       
            var TH_DienThoai = tao_TH_ChiTiet_DienThoai(res);
            $(".product-content-right").append(TH_DienThoai);
        }
    })

    $.ajax({
        async: 'false',
        type: 'GET',
        url: 'http://localhost:3001/danh-sach-dien-thoai',
        crossDomain: 'true',
        header: {
            'Content-Type': 'application/json',
        },
        success: function(res) {     
       
            console.log(res);

            var TH_DS_DienThoai = tao_TH_DS_SanPhamKhac(res);
            $(".single-sidebar").append(TH_DS_DienThoai);
        }
    })
})

var tao_TH_ChiTiet_DienThoai = function(DT) {

    console.log(DT);

    let DienThoaiHtml = `<nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="index.html">Trang chủ</a></li>
                                <li class="breadcrumb-item"><a href="danh-sach-san-pham.html">Danh sách sản phẩm</a></li>
                                <li class="breadcrumb-item active">${DT.ten_dien_thoai}</a></li>
                            </ol>
                         </nav>
                        <div class="row">
                            <div class="col-sm-4 col-sm-offset-1">
                                <div class="product-images">
                                    <div class="product-main-img">
                                        <img src="img/${DT.hinh_anh}.jpg" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="product-inner">
                                    <h2 class="product-name">${DT.ten_dien_thoai}</h2>
                                    <div class="product-inner-price">
                                        <ins>Giá sản phẩm: ${DT.gia_tien} VNĐ</ins>
                                    </div>
                                    <form action="" class="cart">
                                        <div class="quantity">
                                            <input type="number" size="4" class="input-text qty text" title="Qty" value="1" name="quantity" min="1" step="1">
                                        </div>
                                        <button class="add_to_cart_button" type="submit">Mua sản phẩm</button>
                                    </form>
                                    <div role="tabpanel">
                                        <ul class="product-tab" role="tablist">
                                            <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Mô tả</a></li>
                                            <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Đánh giá</a></li>
                                        </ul>
                                        <div class="tab-content">
                                            <div role="tabpanel" class="tab-pane fade in active" id="home">
                                                <p>${DT.mo_ta}</p>
                                            </div>
                                            <div role="tabpanel" class="tab-pane fade" id="profile">
                                                <div class="submit-review">
                                                    <p>
                                                        <label for="name">Tên của bạn</label>
                                                        <input name="name" type="text">
                                                    </p>
                                                    <p>
                                                        <label for="email">Email của bạn</label>
                                                        <input name="email" type="email">
                                                    </p>
                                                    <div class="rating-chooser">
                                                        <p>Mức đánh giá</p>
                                                        <div class="rating-wrap-post">
                                                            <i class="fa fa-star"></i>
                                                            <i class="fa fa-star"></i>
                                                            <i class="fa fa-star"></i>
                                                            <i class="fa fa-star"></i>
                                                            <i class="fa fa-star"></i>
                                                        </div>
                                                    </div>
                                                    <p>
                                                        <label for="review">Nhận xét của bạn về sản phẩm</label>
                                                        <textarea name="review" id="" cols="30" rows="10"></textarea>
                                                    </p>
                                                    <p>
                                                        <input type="submit" value="Submit">
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

    return DienThoaiHtml;                       
}

var tao_TH_DS_SanPhamKhac = function(DS) {

    let TH_DS_SanPhamKhac = '';

    for (let i = 0; i < 4; i++) {

        let DienThoai = DS[i];

        let DienThoaiHtml = `
            <div class="thubmnail-recent">
                <img src="img/${DienThoai.hinh_anh}.jpg" class="recent-thumb" alt="">
                <h2><a href="chi-tiet-san-pham.html?id=${DienThoai.ma_dien_thoai}">${DienThoai.ten_dien_thoai}</a></h2>
                <div class="product-sidebar-price">
                    Giá bán:
                    <ins>${DienThoai.gia_tien} VNĐ </ins>
                </div>
            </div>`

        TH_DS_SanPhamKhac += DienThoaiHtml;
    }
    
    return TH_DS_SanPhamKhac;
}

var getParam = function(_param) {

    var queryString = window.location.search.substring(1);
    var listParam = queryString.split('&');

    for (let item of listParam) {
        const param = item.split('=');
        if (param[0] = _param) 
            return param[1];
    }
}