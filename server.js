const express = require('express');
const app = express();
const img_search = require('./image_search.js');
const bodyParser = require('body-parser');

function logError(err){
    return {error:err};
}

function set_error(text, fileType, size, slide){
    if(text == undefined || fileType == undefined || size == undefined || slide == undefined){
        return (logError('undefined parameters'));
    }
    if(fileType != "jpg" && fileType != "png"){//Currently only valid file types
        return (logError('Invalid File Type'));
    }
    if(size != 'small' && size !='medium' && size != 'large'){
        return (logError('Invalid File Size'));
    }
    if((typeof slide != "number") || slide < 0){
        console.log(typeof slide);
        return (logError("Invalid Slide Number"));
    }
    return false;
}


async function get_img(text, fileType, size, slide){
    let urls = await img_search.get_img_url(text, fileType, size);
    let response = {
        slide_num:slide,
        img_urls:urls
    };
    return JSON.stringify(response);
}

async function get_res(req, res){
    let text = req.param('text');
    let fileType = req.param('fileType');
    let size = req.param('size');
    let slide = parseInt(req.param('slide'));
    let err = set_error(text, fileType, size, slide);
    if(err){
        res.status(500);
        res.send(err);
    }else{
        res.status(200);
        res.send(await get_img(text, fileType, size, slide));
    }
}

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.get('/api/img-search', [get_res]);

app.listen(3001, function(){
    console.log('Server has started');
});