const http = require('http');
const https = require('https');

const request = require('request-promise');
const appendQuery = require('append-query')

require('dotenv').config();



var get_sentiment_response = {

    text: null,

    get_sentiment: function () {


        let uri = 'https://api.meaningcloud.com/sentiment-2.1';

        let params = {
            key: process.env.meaning_cloud_key,
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
            res_text = ["sad background", "red gradient background", "angry background", "dark background"];
        } else if (score <= 50) {
            res_text = ["neutra backgroundl", "grey gradient background", "monotone background"]
        } else if (score <= 75) {
            res_text = ["happ backgroundy", "blue gradient background", "light background"];
        } else {
            res_text = ["ecstatic background", "yellow gradient background", "light background"];
        }

        return res_text;
    }
}







