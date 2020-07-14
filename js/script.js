const $userValue = $('#total-value');
const $graphCont = $('#chart-container');
const $textCont = $('#text-container');
const $textInput = $('#user-input');

const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

let username;
let tweetList;
let totalValue;
let dates;
let values;
let avgValues;

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
        dates.unshift(this.date.toDateString());
        return this.date;
    }

    calcTweetVal() {
        var value = (this.retweet_count * 8) + (this.favorite_count * .3);
        values.unshift(value);
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

    tweetList = [];
    dates = [];
    values = [];
    avgValues = [];
    totalValue = 0;

    if (chart) {
        chart.destroy();
    }
}




function processData(data) {
    totalRetweets = 0;
    totalFavs = 0;
    for (let i = 0; i < 20 && i < data.result.length; i++) {
        tweetList.push(new tweetObj(data.result[i]));
    }
    tweetList.reverse();
    calcTotalVal(tweetList);
    displayValues(tweetList);
}




function calcTotalVal(array) {
    array.forEach(element => {
        console.log(`Adding ${element.value} to ${totalValue}`);
        totalValue += element.value;
        avgValues.push(totalValue);

    });
    totalValue = totalValue.toFixed(2);
}




function displayValues(array) {
    $userValue.append(`<div>Total User Value: ${usdFormatter.format(totalValue)}`);
    array.forEach(element => {
        $textCont.append(`<div>Tweet at ${element.date.toDateString()} is valued at ${usdFormatter.format(element.value)}</div>`);
    });

    chart = new Chart($graphCont[0].getContext('2d'), {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: dates,
            datasets: [{
                label: username + "'s average value",
                data: avgValues
            },
            {
                label: username + "'s tweet value",
                data: values
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


