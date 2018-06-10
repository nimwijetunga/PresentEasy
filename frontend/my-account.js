$(document).ready(function (e) {
    set_profile();
    delete_img();
});

async function set_profile() {
    let username = $.cookie("username");
    let data = await (get_profile(username));
    let profile = data;

    try{
        profile = JSON.parse(data)
    }catch(e){
        console.log(e);
    }

    if (!profile.posted) {
        $("#profile > #error").text(profile.message);
        return;
    }
    let count = 0;
    let urls = profile.img;
    $("#images > #img-title").text("Saved Images");
    $("#images > #img-title").css("font-weight","Bold");
    for (var i in urls) {
        $("#images > #list").append('<li> <img src=' + urls[i] + '>' + '</li>');
        count++;
    }

}

function delete_img(){
    $("#delete-img").submit(function (e) {
        e.preventDefault();
        let img = $("#delete-img > #img").val();
        let username = $.cookie("username");
        delete_img_req(img,username);
    });
}

function delete_img_req(img, username){
    let uri = 'http://localhost:3001/api/delete-img';
    let params = {
        username: username,
        img: img
    };
    let param_serial = $.param(params);
    let url = uri + "?" + param_serial;

    $.get(url, function(res){
        if(!res.posted){
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