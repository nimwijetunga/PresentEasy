const http = require('http');
const https = require('https');

const request = require('request-promise');
const appendQuery = require('append-query')



var get_sentiment_response = {

    text: null,

    get_sentiment: function () {


        let uri = 'https://api.meaningcloud.com/sentiment-2.1';

        let params = {
            key: 'bf0de25b9e1dc218deb0dec88bcb3ec0',
            of: 'json',
            txt: get_sentiment_response.text,
            lang: 'en'
        };


        let url = appendQuery(uri, params);

        return request({
            "method": "GET",
            "uri": url,
            "json": true
        });
    },
}

async function get_sentiment(text) {
    get_sentiment_response.text = text;
    return get_sentiment_response.get_sentiment();
}

/**
 * The final score (/100) is a total of the rating plus the confidence
*/
function get_final_score(response) {
    response = JSON.parse(JSON.stringify(response));
    let rating = response.score_tag;
    let confidence = (response.confidence) / 100;
    if (rating == 'P+') {
        return 100 * confidence;
    } else if (rating == 'P') {
        return 80 * confidence;
    } else if (rating == 'NEU') {
        return 60 * confidence;
    } else if (rating == 'N') {
        return 40 * confidence;
    } else if (rating == 'N+') {
        return 30 * confidence;
    }
    return 0;
}

module.exports = {
    get_search_text: async function (text) {
        let response = await get_sentiment(text);
        let score = get_final_score(response);

        let res_text = [];

        //Generate Search Text (Rudimentary For Now, in 25 increments)
        if (score <= 30) {
            res_text = ["sad", "red gradient", "angry", "dark"];
        } else if (score <= 50) {
            res_text = ["neutral", "grey gradient", "monotone"]
        } else if (score <= 75) {
            res_text = ["happy", "blue gradient", "light"];
        } else {
            res_text = ["ecstatic", "yellow gradient", "light"];
        }

        return res_text;
    }
}







