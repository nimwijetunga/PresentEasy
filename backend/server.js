const express = require('express');
const app = express();
const img_search = require('./image_search.js');
const bodyParser = require('body-parser');
const auth = require('./user_db.js');
const cors = require('cors');

function logError(err) {
    return { error: err };
}

function posted(post, msg) {
    return {
        posted: post,
        message: msg
    };
}

function set_error(text, fileType, size, slide) {
    if (text == undefined || fileType == undefined || size == undefined || slide == undefined) {
        return (logError('undefined parameters'));
    }
    if (fileType != "jpg" && fileType != "png") {//Currently only valid file types
        return (logError('Invalid File Type'));
    }
    if (size != 'small' && size != 'medium' && size != 'large') {
        return (logError('Invalid File Size'));
    }
    if ((typeof slide != "number") || slide < 0) {
        return (logError("Invalid Slide Number"));
    }
    return false;
}

async function set_error_login(username, password) {
    if (username == undefined || password == undefined) {
        return (posted(false, "Password OR Username not provided"));
    }
    let login = await auth.login(username, password);
    if (!login) {
        return (posted(false, "Invalid Password"));
    }
    return false;
}

async function set_error_save(username, img){
    if(username == undefined || img == undefined){
        return (posted(false, "Username OR Image NOT Provided"));
    }
    let save = await auth.update_user_img(username, img);
    if(!save){
        return(posted(false, "Error Saving Image"));
    }
    return false;
}

async function get_img(text, fileType, size, slide) {
    let urls = await img_search.get_img_url(text, fileType, size);
    let response = {
        slide_num: slide,
        img_urls: urls
    };
    return JSON.stringify(response);
}

async function get_res(req, res) {
    let text = req.param('text');
    let fileType = req.param('fileType');
    let size = req.param('size');
    let slide = parseInt(req.param('slide'));
    let err = set_error(text, fileType, size, slide);
    res.status(200);
    if (err) {
        res.send(err);
    } else {
        res.send(await get_img(text, fileType, size, slide));
    }
}

async function get_res_login(req, res) {
    let username = req.param('username');
    let password = req.param('password');
    let err = await set_error_login(username, password);
    res.status(200);
    if (err) {
        res.send(err);
    } else {
        res.send(posted(true,"Success"));
    }
}

async function get_res_save(req, res){
    let username = req.param('username');
    let img = req.param('img');
    let err = await set_error_save(username, img);
    res.status(200);
    if(err){
        res.send(err);
    }else{
        res.send(posted(true,"Saved Imaged Succesfully"));
    }
}

app.use(cors());

app.options('*', cors());

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.get('/api/img-search', [get_res]);

app.get('/api/login', [get_res_login]);

app.get('/api/save', [get_res_save]);

app.listen(3001, function () {
    console.log('Server has started');
});