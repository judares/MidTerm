let DS_DienThoai = [];
let DS_ID_DienThoaiDaChon = [];

$(document).ready(function() {
    if (localStorage.token !== undefined) { 
        if (localStorage.role === 'NHANVIEN') {
            $("#ngay-tao-don").datepicker({
                format: 'dd/mm/yyyy',
            }).datepicker("setDate", Date());
    
            $.ajax({
                async: 'false',
                type: 'GET',
                url: 'http://localhost:3001/danh-sach-dien-thoai',
                crossDomain: 'true',
                header: {
                    'Content-Type': 'application/json',
                }, success: function(res) {
    
                    DS_DienThoai = res;
                }
            });
    
            $('#btn-modal').click(function() {
    
                let TH_Option_DienThoai = '';
                for (let i = 0; i < DS_DienThoai.length; i++) {
            
                    let DienThoai = DS_DienThoai[i];
                    
                    if (DienThoai.so_luong_ton > 0 && !DS_ID_DienThoaiDaChon.includes(DienThoai.ma_dien_thoai)) {
                        let OptionHtml = `<option value="${DienThoai.ma_dien_thoai}">${DienThoai.ma_dien_thoai}, ${DienThoai.ten_dien_thoai}, số lượng tồn: ${DienThoai.so_luong_ton}</option>`;
                        TH_Option_DienThoai += OptionHtml;
                    }      
                }
            
                $("#select-san-pham").empty();
                $("#select-san-pham").append(TH_Option_DienThoai);
            })
            
            $('#btn-them-san-pham').click(function() {
            
                let id_DienThoai = $("#select-san-pham").val();
                if (id_DienThoai == undefined)
                    return;
            
                let DienThoai = search_DienThoai(DS_DienThoai, id_DienThoai);
                let newRow = $(`<tr id=${DienThoai.ma_dien_thoai}>
                                    <td class="td-center td-middle">${DienThoai.ma_dien_thoai}</td>
                                    <td class="td-middle">${DienThoai.ten_dien_thoai}</td>
                                    <td class="td-center td-middle">
                                        <input value=1 class="form-control inputSoLuong" data-dongia=${DienThoai.gia_tien} data-id=${DienThoai.ma_dien_thoai} type="number" min=1 max=${DienThoai.so_luong_ton} style="text-align: right;">
                                    </td>
                                    <td class="td-center td-middle">${DienThoai.gia_tien}</td>
                                    <td class="td-center td-middle">
                                        <span class="span-tong-tien" id="GT_${DienThoai.ma_dien_thoai}">${DienThoai.gia_tien}</span>
                                    </td>
                                    <td class="td-center td-middle">
                                        <a class="btn btn-danger btn-xoa-san-pham-don-hang">
                                            <em class="fa fa-times"></em>
                                        </a>
                                    </td>
                                </tr>`);
                
                $('#table-ds-san-pham-don-hang tbody').append(newRow);
                DS_ID_DienThoaiDaChon.push(id_DienThoai);
                tinhTongTien();
            })
            
            $('#table-ds-san-pham-don-hang tbody').on('click', 'a.btn-xoa-san-pham-don-hang', function() {
            
                let id = $(this).closest('tr').attr('id');
                $(this).closest('tr').remove();
                
                for (let i = 0; i < DS_ID_DienThoaiDaChon.length; i++) {
            
                    if (DS_ID_DienThoaiDaChon[i] == id) {
                        DS_ID_DienThoaiDaChon.splice(i, 1);
                        break;
                    }        
                }
            })
            
            $('#table-ds-san-pham-don-hang tbody').on('change', ".inputSoLuong", function() {
            
                let id = 'GT_' + $(this).data('id');
                let dongia = parseInt($(this).data('dongia'));
                let soluong = parseInt($(this).val());
                let thanhtien = dongia * soluong;
                $('#'+id).html(thanhtien);
            
                tinhTongTien();
            })
    
            $('#btn-tao-don-hang').click(function() {
                
                console.log("Tao don hang: ");
    
                let error = false;
                let hotenkhachhang = $('#ho-ten').val();
                let sodienthoai = $('#so-dien-thoai').val();
                let diachikhachhang = $('#dia-chi').val();
                let nguoitaodon = $('#nguoi-tao-don').val();
                let ngaytaodon = $('#ngay-tao-don').val();
    
                console.log("!: " + nguoitaodon + ' !: ' + ngaytaodon);
    
                let table = $("#table-ds-san-pham-don-hang").find('tr');
                
    
                if (hotenkhachhang === '') {
                    error = true;
                    $.toast({
                        text: 'Vui lòng nhập họ tên khách hàng!   ', 
                        showHideTransition: 'plain',
                        hideAfter: 5000,
                        icon: 'warning',
                        bgColor: '#ffb53e',
                        loaderBg : '#5bc0de'
                    });
                } 
                if (sodienthoai === '') {
                    error = true;
                    $.toast({
                        text: 'Vui lòng nhập số điện thoại khách hàng!   ', 
                        showHideTransition: 'plain',
                        hideAfter: 5000,
                        icon : 'warning',
                        bgColor : '#ffb53e',
                        loaderBg : '#5bc0de'
                    });
                } 
                if (diachikhachhang === '') {
                    error = true;
                    $.toast({
                        text: 'Vui lòng nhập địa chỉ khách hàng!   ', 
                        showHideTransition: 'plain',
                        hideAfter: 5000,
                        icon: 'warning',
                        bgColor: '#ffb53e',
                        loaderBg : '#5bc0de'
                    });
                }
                if (table.length == 1) {
                    error = true;
                    $.toast({
                        text: 'Vui lòng thêm sản phẩm vào đơn hàng!   ', 
                        showHideTransition: 'plain',
                        hideAfter: 5000,
                        icon: 'warning',
                        bgColor: '#ffb53e',
                        loaderBg : '#5bc0de'
                    });
                }
    
                if (error == true) return;
    
                let danhsachsanpham = [];        
                $("#table-ds-san-pham-don-hang").find('tr').each(function(i, el) {
    
                    if (i === 0) {
                        return true; 
                    }
    
                    let $tds = $(this).find('td'),
                        id = $tds.eq(0).text(),
                        soluong = $tds.eq(2).find('input').val(),
                        dongia = parseInt($tds.eq(3).text()),
                        tongtien = parseInt($tds.eq(4).find('span').text());
    
                    let dienthoai = {
                        id: id,
                        soluong: soluong,
                        dongia: dongia,
                        tongtien: tongtien
                    }
                    danhsachsanpham.push(dienthoai);
                })
    
                let tongtien = $('#tong-tien-don-hang').val();
    
                let data = {
                    hotenkhachhang: hotenkhachhang,
                    sodienthoai: sodienthoai,
                    diachikhachhang: diachikhachhang,
                    danhsachsanpham: danhsachsanpham,
                    nguoitaodon: nguoitaodon,
                    ngaytaodon: ngaytaodon,
                    tongtiendonhang: tongtien
                }
    
                $.ajax({
                    async: 'false',
                    type: 'POST',
                    crossDomain: 'true',
                    url: 'http://localhost:3001/tao-don-hang',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    data: JSON.stringify(data),
                    dataType: 'JSON',
                    success: function(res) {
                        console.log(res);
    
                        $.toast({
                            text: 'Tạo đơn hàng thành công!   ', 
                            showHideTransition: 'plain',
                            hideAfter: 5000,
                            icon: 'success',
                            bgColor: '#8ad919',
                            loaderBg : '#5bc0de'
                        });
                    }
                })
            })
    
            const search_DienThoai = function(DS, id) {
    
                for (let DienThoai of DS) {
                    if (DienThoai.ma_dien_thoai === id) {
                        return DienThoai;
                    }
                }
                return null;
            }
            
            const tinhTongTien = function() {
            
                let spanTT = $('.span-tong-tien');    
                let tongtien = 0;
                for (let i = 0; i < spanTT.length; i++) {
                    tongtien += parseInt(spanTT[i].innerText);
                }
                $('#tong-tien-don-hang').val(tongtien);
            }

            $(document).on('click', '#btn-logout', function() {
                localStorage.clear()
                window.location.replace("http://localhost:3002/admin/login.html")
            }) 
        } else {
            window.location.replace('http://localhost:3002/admin/index.html')
        }
    } else {
		window.location.replace('http://localhost:3002/admin/login.html')
	}
})

