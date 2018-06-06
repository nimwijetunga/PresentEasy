$(document).ready(function (e) {
    set_profile();
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
    $("#profile > #username").text("Username:" + profile.username);
    let count = 0;
    let urls = profile.img;
    $("#images > #img-title").text("Saved Images");
    $("#images > #img-title").css("font-weight","Bold");
    for (var i in urls) {
        $("#images > #list").append('<li> <img src=' + urls[i] + '>' + '</li>');
        count++;
    }

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