var request = require('request');
var spotify = require('spotify');
var fs = require('fs');
var keysTwitter = require('./keys.js');

var inCommand = process.argv[2];
var value = process.argv[3];
var outError = '';
var outMsg = '';

function checkInput(argument) {
	switch(inCommand) {
  	  case 'my-tweets':
    	  displayTweets();
      	break;
    	case 'spotify-this-song':
    		if (value == undefined) {
    				value = "what's my age again"
    				outError = "LIRI will default to What's my age again" + "\r\n" + "\r\n";
    				console.log(outError);
            logInput(outError);
    				spotifyIt();
    				
    		} else {
		    	  spotifyIt();
	    	}
  	    break;
    	case 'movie-this':
    		if (value == undefined) {
    				value = "Mr. Nobody"
    				outError = "LIRI will default to Mr. Nobody" + "\r\n" + "\r\n";
    				console.log(outError);
            logInput(outError);
		    		req();
		    } else {
		    		req();
		    }
    	  break;
    	case 'do-what-it-says':
      	doWhatItSays();
      	break;
    	default:
      	outError = "Please enter the proper command" +  "\r\n" + "\r\n" +       	
      	"these are the possible entries: " + "\r\n" +  
      	"node liri.js my-tweets" +  "\r\n" +
        "node liri.js spotify-this-song '<song name>' " +  "\r\n" +
        "node liri.js movie-this '<movie name>' " +  "\r\n" +
        "node liri.js do-what-it-says" + "\r\n" + "\r\n" ;       	
      	console.log(outError);
        logInput(outError);
}
}

function displayTweets() {
  var twitKeys = keysTwitter.twitterKeys;
  var Twitter = require('twitter');
  var client = new Twitter({
    consumer_key: twitKeys.consumer_key,
    consumer_secret: twitKeys.consumer_secret,
    access_token_key: twitKeys.access_token_key,
    access_token_secret: twitKeys.access_token_secret
  });
 
  var twitterId = 'mgreer973'
  var params = {screen_name: twitterId};
  client.get('statuses/user_timeline', params, function(error, tweets, response){
    if (!error) {
        var tweetLength = 0;
        if (tweets.length < 20) {
            tweetLength = tweets.length
        } else {
            tweetLength = 20
        }

        for (var i = 0; i < tweetLength; i++) {
           outMsg = 'Tweet: ' + tweets[i].text + "\r\n" +
           'Created: ' + tweets[i].created_at + "\r\n" + "\r\n";
           console.log(outMsg);
           logInput(outMsg);
        }
    }
 });
}

function req() {
	var title = value.replace(/\s+/g, "+"); 
	var reqIn = 'http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json&tomatoes=true';
	request(reqIn, function (error, response, body) {

  jsonBody = JSON.parse(body);
  outMsg = 'Title: ' + jsonBody.Title + "\r\n" +
           'Year: '  +  jsonBody.Year + "\r\n" + 
           'IMDB Rating: ' + jsonBody.imdbRating + "\r\n" +
           'Country: ' + jsonBody.Country + "\r\n" +
           'Language: ' + jsonBody.Language + "\r\n" +
           'Plot: ' + jsonBody.Plot + "\r\n" + 
           'Actors: ' + jsonBody.Actors + "\r\n" +
           'Rotten Tomatoes Rating: ' + jsonBody.tomatoRating + "\r\n" +
           'Rotten Tomatoes URL: ' +  jsonBody.tomatoURL + "\r\n" + "\r\n" ;

    	console.log(outMsg);
      logInput(outMsg);
	});
}

function spotifyIt() {
	spotify.search({ type: 'track', query: value }, function(err, data) {
    if ( err ) {
        var errTxt = 'Error occurred' + err
        console.log(errTxt);
        logInput(errTxt);
        return;
    }
  var spotItem = data.tracks.items[0];
  outMsg = 'artist: ' + spotItem.artists[0].name + "\r\n" +
           'song name: '  +  spotItem.name + "\r\n" + 
           'preview link: ' + spotItem.href + "\r\n" +
           'album: ' + spotItem.album.name + "\r\n" +  "\r\n";
	console.log(outMsg); 
  logInput(outMsg);
  });
}

function doWhatItSays() {
	fs.readFile('./random.txt', "utf8", function(err, data){
		data = data.split(',');
		inCommand = data[0];
		value = data[1];
		checkInput();
	});
}

function logInput(logText) {
  fs.appendFile("./log.txt", logText, (err) => {
     if (err) throw err;
    
  }); 
}

checkInput();