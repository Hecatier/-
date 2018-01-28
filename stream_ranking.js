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

//ユーザストリーム取得
client.stream('user', function (stream) {
	stream.on('data', function (tweet) {
		//console.log(tweet.user.name, tweet.text);
		var TweetText = tweet.text;
		TweetText = TweetText.replace(/(http|https):\/\/.+\s?/g, '').replace(/@[a-zA-z_]*/g, '').replace(/＠[a-zA-z_]*/g, '');
		mecab.parse(TweetText, function (err, result) {
			if (err) throw err;
			for (var i in result) {
				if (result[i][1] == "名詞") {
					ranking(result[i][0]);
				}
			}
			console.log(T);
		});
	});

	stream.on('error', function (error) {
		throw error;
	});
});

function ranking(word) {
	if (T[word] > 0) {
		T[word]++;
	} else if (Object.keys(T).length < 10) {
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
			if (Object.keys(T).length < 10) {
				return true;
			}
		}, T);
	}
}