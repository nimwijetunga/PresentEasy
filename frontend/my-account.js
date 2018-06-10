$(document).ready(function (e) {
    set_profile();
    delete_img();
});

async function set_profile() {
    let username = $.cookie("username");
    let data = await (get_profile(username));
    let profile = data;

    try {
        profile = JSON.parse(data)
    } catch (e) {
        console.log(e);
    }

    if (!profile.posted) {
        $("#profile > #error").text(profile.message);
        return;
    }
    let urls = profile.img;
    $('#img-urls > #list').html('');
    if (urls[0]) {
        $("#img-urls .carousel-inner").eq(0).append('<div class="carousel-item active"><img class="d-block w-100" src="' + urls[0] + '" alt="First slide"> </div>');
    }
    for (var i = 1; i < urls.length; i++) {
        let html = '<div class="carousel-item"><img class="d-block w-100" src="' + urls[i] + '" alt="First slide"> </div>';
        $("#img-urls .carousel-inner").eq(0).append(html);
    }
}

function delete_img() {
    $("#delete-img").submit(function (e) {
        e.preventDefault();
        let img = $("#img-del").val();
        console.log(img);
        let username = $.cookie("username");
        delete_img_req(img, username);
    });
}

function delete_img_req(img, username) {
    let uri = 'http://localhost:3001/api/delete-img';
    let params = {
        username: username,
        img: img
    };
    let param_serial = $.param(params);
    let url = uri + "?" + param_serial;
    console.log(url);

    $.get(url, function (res) {
        if (!res.posted) {
            $("#msg-del > #del-p").css('color', 'red');
        } else {
            $("#msg-del > #del-p").css('color', 'green');
            set_profile();
        }
        $("#msg-del > #del-p").text(res.message);
    })
}

function get_profile(username) {
    let uri = 'http://localhost:3001/api/profile';
    let params = {
        username: username
    };
    let param_serial = $.param(params);
    let url = uri + "?" + param_serial;

    return new Promise(function (resolve, reject) {
        $.get(url, function (res) {
            resolve(res);
        })
    });
}