var Twitter = require('twitter');
var Key = require('./twitterKey.js');

var client = new Twitter({
	consumer_key: Key.consumerKey,
	consumer_secret: Key.consumerSecret,
	access_token_key: Key.accessTokenKey,
	access_token_secret: Key.accessTokenSecret
});

var MeCab = new require('mecab-async')
	, mecab = new MeCab();

var T = {};
const rankRange = 100;

//var params = { count: 100 };
//client.get('statuses/home_timeline', params, function (error, tweets, response) {
var params = { q: 'java' };
client.get('search/tweets', params, function (error, tweets, response) {
	if (error) throw error;
	for (i in tweets.statuses) {
		//console.log(Object.keys(tweets.statuses));
		//console.log(tweets[i].user.name, tweets[i].text);
		var TweetText = tweets.statuses[i].text;
		TweetText = TweetText.replace(/(http|https):\/\/.+\s?/g, '').replace(/@[a-zA-z_]*/g, '').replace(/＠[a-zA-z_]*/g, '');
		mecab.parse(TweetText, function (err, result) {
			if (err) throw err;
			for (var j in result) {
				if (result[j][1] == "名詞") {
					ranking(result[j][0]);
				}
			}
			console.log(T);
		});
	}
});

function ranking(word) {
	if (T[word] > 0) {
		T[word]++;
	} else if (Object.keys(T).length < rankRange) {
		T[word] = 1;
		//T.word = 1;
	} else {
		Object.keys(T).some(function (key) {
			//var val = this[key];
			//console.log(key, val);
			this[key]--;
			if (this[key] == 0) {
				delete T[key];
			}
			if (Object.keys(T).length < rankRange) {
				return true;
			}
		}, T);
	}
}