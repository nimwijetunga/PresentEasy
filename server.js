const express = require('express');
const app = express();
const img_search = require('./image_search.js');
const bodyParser = require('body-parser');

function logError(err){
    return {error:err};
}

function set_error(text, fileType, size){
    if(text == undefined || fileType == undefined || size == undefined){
        return (logError('undefined parameters'));
    }else if(fileType != "jpg" && fileType != "png"){//Currently only valid file types
        return (logError('Invalid File Type'));
    }else if(size != 'small' && size !='medium' && size != 'large'){
        return (logError('Invalid File Size'));
    }
    return false;
}


function get_img(text, fileType, size){
    return {success:'success'};
}

function get_res(req, res){
    let text = req.param('text');
    let fileType = req.param('fileType');
    let size = req.param('size');
    let err = set_error(text, fileType, size);
    if(err){
        res.status(500);
        res.send(err);
    }else{
        res.status(200);
        res.send(get_img(text, fileType, size));
    }
}

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.get('/api/img-search', [get_res]);

app.listen(3001, function(){
    console.log('Server has started');
});