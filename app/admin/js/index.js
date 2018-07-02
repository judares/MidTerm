let DS_DienThoai = []

$(document).ready(function() {

	if (localStorage.token !== undefined) {
		$.ajax({
			async: 'false',
			type: 'GET',
			url: 'http://localhost:3001/danh-sach-dien-thoai',
			crossDomain: 'true',
			header: {
				'Content-Type': 'application/json',
			}, success: function(res) {
				DS_DienThoai = res
				tao_LeftMenu()
				tao_TH_Table_DS_DienThoai()
				initDataTable()
			}
		})

		let tao_LeftMenu = function() {

			let li_role = ``
			if (localStorage.role === 'NHANVIEN') {
				li_role =  `<li>
								<a href="tao-don-hang.html">
									<em class="fa fa-address-card">&nbsp;</em> Tạo đơn hàng </a>
							</li>`
			}

			let li =   `<li class="active">
								<a href="index.html">
									<em class="fa fa-list-ul">&nbsp;</em> Danh sách sản phẩm </a>
							</li>
							${li_role}
							<li>
								<a id="btn-logout">
									<em class="fa fa-power-off">&nbsp;</em> Đăng xuất </a>
							</li>`

			$('#left-menu-nav').append(li)
		}
	
		let tao_TH_Table_DS_DienThoai = function() {

			let tHead = tao_tHead_Table_DS_DienThoai()
			let tBody = tao_tBody_Table_DS_DienThoai()
			
			$("#table-ds-san-pham").append(tHead)
			$("#table-ds-san-pham").append(tBody)
		}

		let tao_tHead_Table_DS_DienThoai = function() {
			let tHeadQuanLy = ``
			if (localStorage.role === 'QUANLY') {
				tHeadQuanLy = `<th width="20%" class="th-center"></th>`
			}
			let table_tHead =  `<thead>
									<tr>
										<th width="10%" class="th-center">Mã số</th>
										<th width="20%" >Tên</th>
										<th width="10%" class="th-center">Hình ảnh</th>
										<th width="15%" class="th-center">Số lượng tồn</th>
										<th width="15%" class="th-center">Số lượng bán</th>
										<th width="10%" class="th-center">Đơn giá</th>
										${tHeadQuanLy}
									</tr>
								</thead>`
			return table_tHead;
		}
		
		let tao_tBody_Table_DS_DienThoai = function() {
			
			let table_data = ``

			for (let i = 0; i < DS_DienThoai.length; i++) {
		
				let DienThoai = DS_DienThoai[i]
				
				let td_button = ``
				let buttonRemove = ``

				if (localStorage.role === 'QUANLY') {
					if (DienThoai.tinh_trang === true) {
						buttonRemove = `<button class="btn btn-warning btn-tam-dung-san-pham" data-status=${DienThoai.tinh_trang}>
											<em class="fa fa-times"></em>
										</button>`
					} else {
						buttonRemove = `<button class="btn btn-success btn-tam-dung-san-pham" data-status=${DienThoai.tinh_trang}>
											<em class="fa fa-plus"></em>
										</button>`
					}
	
					td_button = `<td class="td-center td-middle">
									<button type="button" class="btn btn-info btn-sua-thong-tin" data-toggle="modal" data-target="#modal-xem-thong-tin-san-pham">
										<em class="fa fa-edit"></em>
									</button>
									${buttonRemove}
								</td>`
				}
				

				let DienThoaiHtml = 
								`<tr id=${DienThoai.ma_dien_thoai}>
									<td class="td-center td-middle"><b>${DienThoai.ma_dien_thoai}</b></td>
									<td class="td-middle">${DienThoai.ten_dien_thoai}</td>
									<td>
										<img src="../img/${DienThoai.hinh_anh}.jpg" class="img-responsive" width="100px" height="100px">
									</td>
									<td class="td-center td-middle">${DienThoai.so_luong_ton}</td>
									<td class="td-center td-middle">${DienThoai.so_luong_ban}</td>
									<td class="td-center td-middle">${DienThoai.gia_tien}</td>
									${td_button}
								</tr>`
								
				table_data += DienThoaiHtml       
			}

			let table_tBody =  `<tbody id="body-table-danh-sach-dien-thoai">
									${table_data}
								</tbody>`

			return table_tBody
		}

		let initDataTable = function () {
			$('#table-ds-san-pham').DataTable({
				"language": {
					"search": 			"Tìm kiếm: ",
					"emptyTable":     	"Không có dữ liệu",
					"info":           	"Hiển thị _START_ tới _END_ của _TOTAL_ sản phẩm",
					"infoEmpty":      	"Hiển thị 0 sản phẩm",
					"infoFiltered":   	"",
					"lengthMenu":    	"Hiển thị _MENU_ sản phẩm	",
					"paginate": {
						"first":      	"Đầu tiên",
						"last":      	"Cuối cùng",
						"next":      	">",
						"previous":  	"<"
					}
				}
			})
		}
		
		$('#table-ds-san-pham').on('click', '.btn-sua-thong-tin', function() {
		
			let id = $(this).closest('tr').attr('id')
		
			DS_DienThoai.forEach(DT => {
				
				if (DT.ma_dien_thoai === id) {
					$('#ma-dien-thoai').val(DT.ma_dien_thoai)
					$('#ten-dien-thoai').val(DT.ten_dien_thoai)
					$('#mo-ta-dien-thoai').val(DT.mo_ta)
					$('#don-gia-dien-thoai').val(DT.gia_tien)
					$('#so-luong-ton').val(DT.so_luong_ton)
					$('#so-luong-ban').val(DT.so_luong_ban)
					let src = `../img/${DT.hinh_anh}.jpg`
					$('#hinh-anh-dien-thoai').attr('src', src)
				}
			})
		})
		
		$('#table-ds-san-pham').on('click', '.btn-tam-dung-san-pham', function() {
		
			let id = $(this).closest('tr').attr('id')
			let url = 'http://localhost:3001/dien-thoai?id=' + id
			let status = $(this).data("status")
		
			if (status === false)
			{
				console.log("Thanh cong")
				$(this).removeClass("btn-success")
				$(this).addClass("btn-warning")
				$(this).html("<em class='fa fa-times'></em>")
				$(this).data("status", true)
			} else {
				console.log("Thanh cong")
				$(this).removeClass("btn-warning")
				$(this).addClass("btn-success")
				$(this).html("<em class='fa fa-plus'></em>")	
				$(this).data("status", false)
			}
		
			$.ajax({
				async: 'false',
				type: 'DELETE',
				url: url,
				crossDomain: 'true',
				success: function(res) {
				}
			})
		})
		
		$('#btn-sua-thong-tin-san-pham').click(function() {
			
			let ma_DienThoai = $('#ma-dien-thoai').val()
			let dongia_DienThoai = parseInt($('#don-gia-dien-thoai').val())
			let soluongton_DienThoai = parseInt($('#so-luong-ton').val())
		
			DS_DienThoai.forEach(function(DT) {
				if (DT.ma_dien_thoai === ma_DienThoai) {
					if (dongia_DienThoai !== DT.gia_tien || soluongton_DienThoai !== DT.so_luong_ton) {
		
						let data = {
							ma_dien_thoai: ma_DienThoai,
							gia_tien: dongia_DienThoai,
							so_luong_ton: soluongton_DienThoai
						}
		
						console.log(data)
		
						$.ajax({
							async: 'false',
							type: 'PUT',
							crossDomain: 'true',
							data: JSON.stringify(data),
							contentType: 'application/json',
							url: 'http://localhost:3001/dien-thoai',
							success: function(res) {
								let $tr = $(`#body-table-danh-sach-dien-thoai>tr[id=${ma_DienThoai}]`)
								let $tds = $($tr).find('td')  
								$tds.eq(3).text(soluongton_DienThoai)
								$tds.eq(5).text(dongia_DienThoai)
				
								$.ajax({
									async: 'false',
									type: 'GET',
									url: 'http://localhost:3001/danh-sach-dien-thoai',
									crossDomain: 'true',
									header: {
										'Content-Type': 'application/json',
									}, success: function(res) {
										DS_DienThoai = res
									}
								})
		
								$.toast({
									text: 'Sửa thông tin điện thoại thành công!   ', 
									showHideTransition: 'plain',
									hideAfter: 5000,
									icon: 'success',
									bgColor: '#8ad919',
									loaderBg : '#5bc0de'
								})
							}
						})
					}
				}
			})
		})

		$(document).on('click', '#btn-logout', function() {
			localStorage.clear()
			window.location.replace("http://localhost:3002/admin/login.html")
		}) 
	} else {
		window.location.replace('http://localhost:3002/admin/login.html')
	}
})

