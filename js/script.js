const $userValue = $('#total-value');
const $graphCont = $('.container');
const $textInput = $('#user-input');

let tweetList;
let totalValue;

class tweetObj {
    retweet_count;
    favorite_count;
    date;
    value;

    constructor(tweet) {
        this.retweet_count = tweet.retweet_count;
        this.favorite_count = tweet.favorite_count;
        this.date = new Date(tweet.created_at);
        this.value = this.calcTweetVal();
    }

    calcTweetVal() {
        return (this.retweet_count * 8) + (this.favorite_count * .3);
    }
}

$('form').on('submit', initTwitterCall);

function initTwitterCall(evt) {
    evt.preventDefault();
    let username = $textInput.val();
    clearData();
    $.ajax({
        url: 'https://6oxgoe783h.execute-api.us-west-1.amazonaws.com/default/proxyTest',
        type: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('username', username); }
    }).then(
        (data) => {
            processData(data);
        },
        (error) => {
            console.log('Bad Request ' + error);
        }
    );
    $textInput.val('');
}



function processData(data) {
    totalRetweets = 0;
    totalFavs = 0;
    for (let i = 0; i < 10 && i < data.result.length; i++) {
        tweetList.push(new tweetObj(data.result[i]));
    }
    calcTotalVal(tweetList);
    displayValues(tweetList)
}

function calcTotalVal(array) {
    array.forEach(element => {
        totalValue += element.value;
    });
    totalValue = totalValue.toFixed(2);
}

function displayValues(array) {
    $userValue.append(`<div>Total User Value: $${totalValue}`);
    array.forEach(element => {
        $graphCont.append(`<div>Tweet at ${element.date.toDateString()} is valued at $${element.value.toFixed(2)}</div>`);
    });
}

function clearData() {
    tweetList = [];
    totalValue = 0;
    $userValue.empty();
    $graphCont.empty();
}