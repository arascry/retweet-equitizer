const $userValue = $('#total-value');
const $graphCont = $('#chart-container');
const $textCont = $('#text-container');
const $textInput = $('#user-input');

const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

let username;
let masterTweetList;
let totalValue;
let dates;
let values;
let avgValues;

let dateValues;

let expose;

var chart;

class tweetObj {
    retweet_count;
    favorite_count;
    date;
    value;

    constructor(tweet) {
        this.retweet_count = tweet.retweet_count;
        this.favorite_count = tweet.favorite_count;
        this.date = this.formatDate(tweet.created_at);
        this.value = this.calcTweetVal();
    }

    formatDate(created_at) {
        this.date = new Date(created_at);
        return this.date;
    }

    calcTweetVal() {
        var value = (this.retweet_count * 8) + (this.favorite_count * .3);
        return value;
    }
}




$('form').on('submit', initTwitterCall);

function initTwitterCall(evt) {
    evt.preventDefault();
    username = $textInput.val();
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




function clearData() {
    $userValue.empty();
    $textCont.empty();

    masterTweetList = [];
    dates = [];
    values = [];
    avgValues = [];
    dateValues = new Map();
    totalValue = 0;

    if (chart) {
        chart.destroy();
    }
}




function processData(data) {
    let i = 0;

    if (data.result[0]) {
        totalValue += data.result[0].user.followers_count * 2.5;
        for (let j = Math.min(data.result.length - 1, 19); j >= 0; j--) {
            masterTweetList.push(new tweetObj(data.result[j]));
            if (dateValues.has(masterTweetList[i].date.toDateString())) {
                dateValues.set(masterTweetList[i].date.toDateString(), dateValues.get(masterTweetList[i].date.toDateString()) + masterTweetList[i].value);
            } else {
                dateValues.set(masterTweetList[i].date.toDateString(), masterTweetList[i].value);
            }
            i++;
        }

        calcTotalVals(masterTweetList, dateValues);
        displayValues(masterTweetList);
    } else {
        displayError();
    }

}






function calcTotalVals(array, map) {
    map.forEach((value, key) => {
        dates.push(key);
        values.push(value);

        avgValues.push(totalValue + values.reduce((a, b) => { return a + b }, 0));
    });

    array.forEach(element => {
        totalValue += element.value;
    });
}




function displayValues(array) {
    $userValue.append(`<div>Total User Value: ${usdFormatter.format(totalValue)}`);
    array.forEach(element => {
        $textCont.append(`<div>Tweet at ${element.date} is valued at ${usdFormatter.format(element.value)}</div>`);
    });
    chart = new Chart($graphCont[0].getContext('2d'), {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: dates,
            datasets: [{
                label: username + "'s daily value",
                data: values
            },
            {
                label: username + "'s cumulative value",
                data: avgValues
            }]
        },


        // Configuration options go here
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value) {
                            return usdFormatter.format(value);
                        }
                    }
                }]
            }
        }
    });

}

function displayError() {
    $userValue.append(`No unique tweets for that user!`);
}
