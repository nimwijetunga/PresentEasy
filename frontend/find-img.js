$(document).ready(function (e) {
    find_img_urls();
    save_img();
    logout();
    _redirect();
});

function find_img_urls() {
    $("#find-img").submit(function (e) {
        e.preventDefault();
        $("#loader").append('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>');
        let text = $("#text").val();
        let fileType = $("#fileType").val();
        let size = $("#size").val();
        let slide = $("#slide").val();
        find_img_req(text, fileType, size, slide);
    });
}

function logout(){
    $('#logout').click(function(e){
        $.cookie("username", null);
        _redirect();
    });
}

function _redirect(){
    let global = new Global();
    global._redirect();
}

function save_img() {
    $("#save-img").submit(function (e) {
        e.preventDefault();
        let img = $("#img").val();
        let username = $.cookie("username");
        save_img_req(img,username);
    });
}

function save_img_req(img, username) {
    let uri = 'http://localhost:80/api/save';
    let params = {
        username: username,
        img: img
    };
    let param_serial = $.param(params);
    let url = uri + "?" + param_serial;

    $.get(url, function(res){
        console.log(res);
        if(!res.posted){
            $("#msg-save > #save-p").css('color', 'red');
        } else {
            $("#msg-save > #save-p").css('color', 'green');
        }
        $("#msg-save > #save-p").text(res.message);
    })
}

function find_img_req(text, fileType, size, slide) {
    let uri = 'http://localhost:80/api/img-search';

    let params = {
        text: text,
        fileType: fileType,
        size: size,
        slide: slide
    };
    let param_serial = $.param(params);
    let url = uri + "?" + param_serial;
    $.get(url, function (res) {
        $("#loader").html('');  
        console.log(res);
        if (res.error) {
            $('#img-urls > #list').html('');
            $("#error > #error-p").text(res.error);
        } else {
            res = JSON.parse(res);
            let urls = res.img_urls;
            $("#error > #error-p").text('');
            $('#img-urls > #list').html('');
            $("#img-urls .carousel-inner").eq(0).append('<div class="carousel-item active"><img class="d-block w-100" src="'+ urls[0] +'" alt="First slide"> </div>');
            for (var i = 1; i < urls.length; i++) {
                let html = '<div class="carousel-item"><img class="d-block w-100" src="'+ urls[i] +'" alt="First slide"> </div>';
                $("#img-urls .carousel-inner").eq(0).append(html);
            }
        }
    });
}