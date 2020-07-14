let tweetList = [];
let totalValue;
let responseCont;
class tweetObj {
    retweet_count;
    favorite_count;
    date;
    value;

    constructor(tweet) {
        this.retweet_count = tweet.retweet_count;
        this.favorite_count = tweet.favorite_count;
        this.date = tweet.created_at;
        this.value = this.calcTweetVal();
    }

    #calcTweetVal() {
        return (this.retweet_count * 8) + (this.favorite_count * .3);
    }
}

$.ajax({
    url: 'https://6oxgoe783h.execute-api.us-west-1.amazonaws.com/default/proxyTest',
    type: "GET",
    beforeSend: function (xhr) { xhr.setRequestHeader('username', 'fantastic_nick'); }
}).then(
    (data) => {
        processData(data);
    },
    (error) => {
        console.log('Bad Request ' + error);
    }
);

function processData(data) {
    responseCont = data;
    totalRetweets = 0;
    totalFavs = 0;
    for (let i = 0; i < 10 || i < data.result.length; i++) {
        tweetList.push(new tweetObj(data.result[i]));
    }
    calcTotalVal(tweetList);
}

function calcTotalVal(array) {
    array.forEach(element => {
        totalValue += element.value;
    });
    totalValue = totalValue.toFixed(2);
}