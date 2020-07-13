let tweetList;

$.ajax({
    url: 'https://6oxgoe783h.execute-api.us-west-1.amazonaws.com/default/proxyTest',
    type: "GET",
    beforeSend: function (xhr) { xhr.setRequestHeader('username', 'lazesummerstone'); }
}).then(
    (data) => {
        processData(data);
    },
    (error) => {
        console.log('Bad Request ' + error);
    }
);

function processData(array) {
    tweetList = array.result;
    totalRetweets = 0;
    totalFavs = 0;
    for (let i = 0; i < 10; i++) {
        totalRetweets += tweetList[i].retweet_count;
        totalFavs += tweetList[i].favorite_count;
    }

}

function calcVal(totalRetweets, totalFavs) {
    let totalValue = (totalRetweets * 8) + (totalFavs * .3);
    console.log(totalValue);
}