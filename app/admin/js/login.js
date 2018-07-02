$(document).ready(function() {

})

$("#btn-login").click(function() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()
    
    if (username === '') {
        showToast('Username còn trống')
        return
    }
    if (password === '') {
        showToast('Password còn trống')
        return
    }

    let data = {
        username: username,
        password: password
    }

    $.ajax({
        async: 'false',
        type: 'POST',
        crossDomain: 'true',
        url: 'http://localhost:3001/user',
        headers: {
            'Content-Type':'application/json'
        },
        data: JSON.stringify(data),
        dataType: 'JSON',
        success: function(res) {
            console.log(res)
            localStorage.setItem('token', res.token)
            localStorage.setItem('name', res.name)
            localStorage.setItem('role', res.role)
            window.location.replace('http://localhost:3002/admin/index.html')
        },
        error: function(){
            showToast('Sai username hoặc password, vui lòng nhập lại')
        }
    })
})

const showToast = function(text) {
    $.toast({
        text: text, 
        showHideTransition: 'plain',
        hideAfter: 5000,
        icon: 'warning',
        bgColor: '#ffb53e',
        loaderBg : '#5bc0de'
    });
}

