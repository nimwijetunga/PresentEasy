let sent = require('./sentiment_analysis.js');
let appendQuery = require('append-query')
let request = require('request-promise');

async function img_search(text, fileType, size) {

    let uri = 'https://www.googleapis.com/customsearch/v1';

    let params = {
        q: text,
        num: 2,
        start: 1,
        imgSize: size,
        filetype: fileType,
        key: 'AIzaSyCu7tar_9fwTvOVaM0pRBOJRG9woDyFgDY',
        cx: '012557195855676627064:dmyd5ewwv8i'
    };

    let url = appendQuery(uri, params);

    return request({
        "method": "GET",
        "uri": url,
        "json": true
    });
}

module.exports = {
    get_img_url: async function (text, fileType, size) {
        let res_text = await sent.get_search_text(text);
        let urls = [];
        for (var i in res_text) {
            let response = await img_search(res_text[i], fileType, size);
            if (response.items == undefined) continue;
            for (var j in response.items) {
                let url = response.items[j].htmlFormattedUrl;
                if (url == undefined) continue;
                urls.push(url);
            }
        }
    }
}
