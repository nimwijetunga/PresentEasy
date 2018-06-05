$(document).ready(function (e) {
    find_img_urls();
    save_img();
    logout();
});

function find_img_urls() {
    $("#find-img").submit(function (e) {
        e.preventDefault();
        let text = $("#text").val();
        let fileType = $("#fileType").val();
        let size = $("#size").val();
        let slide = $("#slide").val();
        find_img_req(text, fileType, size, slide);
        save_img();
    });
}

function logout(){
    $('#logout').click(function(e){
        $.cookie("username", null);
    });
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
    let uri = 'http://localhost:3001/api/save';
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
    let uri = 'http://localhost:3001/api/img-search';

    let params = {
        text: text,
        fileType: fileType,
        size: size,
        slide: slide
    };
    let param_serial = $.param(params);
    let url = uri + "?" + param_serial;
    $.get(url, function (res) {
        console.log(res);
        if (res.error) {
            $('#img-urls > #list').html('');
            $("#error > #error-p").text(res.error);
        } else {
            res = JSON.parse(res);
            let urls = res.img_urls;
            $("#error > #error-p").text('');
            $('#img-urls > #list').html('');
            let count = 0;
            for (var i in urls) {
                $("#img-urls > #list").append('<li> <a target="_blank" href=' + urls[i] + '>' + "Image " + count + '</a>' + '</li>');
                count++;
            }
        }
    });
}