$(document).ready(function(e) {   
    find_img_urls();
 });

 function find_img_urls(){
    $("#find-img").submit(function (e) {
        e.preventDefault();
        let text = $("#text").val();
        let fileType = $("#fileType").val();
        let size = $("#size").val();
        let slide = $("#slide").val();
        find_img_req(text,fileType, size, slide);
    });
 }

 function find_img_req(text, fileType, size, slide){
    let uri = 'http://localhost:3001/api/img-search';
    
    let params = {
        text:text,
        fileType:fileType,
        size:size,
        slide:slide        
    };
    let param_serial = $.param(params);
     let url = uri + "?" + param_serial;
     $.get(url, function(res) {
         console.log(res);
        if(res.error){
            $('#img-urls > #list').html('');
            $("#error > #error-p").text(res.error);
        }else{
            res = JSON.parse(res);
            let urls = res.img_urls;
            let count = 1;
            $("#error > #error-p").text('');
            $('#img-urls > #list').html('');
            for(var i in urls){
                $("#img-urls > #list").append('<li> <a target="_blank" href=' + urls[i] + '>' + "Image " + count + '</a>' + '</li>');
                count++;
            }
        }
    });
 }