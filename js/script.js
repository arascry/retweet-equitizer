const $userValue = $('#total-value');
const $graphCont = $('#chart-container');
const $textCont = $('#text-container');
const $textInput = $('#user-input');

//Used to format numbers to currency format
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/*---Create local variables---*/
let username;
let totalValue;
//Arrays
let masterTweetList;
let dates;
let values;
let avgValues;
let dateValues;

let chart;

/*---tweetObj, used to track of all unique tweets---*/
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
    //For each retweet, multiply by $8; for each favorite, multiplay by 0.30 cents
    calcTweetVal() {
        var value = (this.retweet_count * 8) + (this.favorite_count * .3);
        return value;
    }
}

/*---Handles the info overlay---*/
$(document).ready(displayOverlay);
$('#nav-button').on('click', displayOverlay);

function displayOverlay() {
    $('#overlay').fadeIn(1000);
}
function removeOverlay() {
    $('#overlay').fadeOut(1000);
}

/*---Handles the form input and button click---*/
$('form').on('submit', initTwitterCall);
function initTwitterCall(evt) {
    evt.preventDefault();
    username = $textInput.val();
    clearData();
    //Create and sends a custome header with the username to AWS Lambda
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

/*---Clears out the variables and destroys the chart---*/
function clearData() {
    $userValue.empty();
    $textCont.empty();
    totalValue = 0;

    masterTweetList = [];
    dates = [];
    values = [];
    avgValues = [];
    dateValues = new Map();

    if (chart) {
        chart.destroy();
    }
}

/*---Iterates through data, saves to appropriate arrays---*/
function processData(data) {
    //Uses i to reverse walk masterTweetList
    let i = 0;

    //Checks to see if there's at least one unique tweet
    if (data.result[0]) {
        //For each follower, multiple by $2.50 and add it to totalValue
        totalValue += data.result[0].user.followers_count * 2.5;

        //For either data length, or ceiling 20, iterate for data
        for (let j = Math.min(data.result.length - 1, 19); j >= 0; j--) {
            masterTweetList.push(new tweetObj(data.result[j]));
            let tmpDate = masterTweetList[i].date.toDateString();
            let tmpVal = masterTweetList[i].value;

            //If the date already exists, add rather than make a new entry
            if (dateValues.has(tmpDate)) {
                dateValues.set(tmpDate, dateValues.get(tmpDate) + tmpVal);
            } else {
                dateValues.set(tmpDate, tmpVal);
            }
            i++;
        }
        calcTotalVals(masterTweetList, dateValues);
        displayValues(masterTweetList);
    } else {
        displayError();
    }

}

/*---Calculates value and dates Tweet objects---*/
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

/*---Simple render function that formats and inserts divs as well as create the chart---*/
function displayValues(array) {
    $userValue.append(`<div>Total User Value: ${usdFormatter.format(totalValue)}`);
    array.forEach(element => {
        $textCont.append(`<div>Tweet at ${element.date} is valued at ${usdFormatter.format(element.value)}</div>`);
    });
    chart = new Chart($graphCont[0].getContext('2d'), {
        type: 'line',

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

        options: {
            maintainAspectRatio: false,
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

/*---Dispaly error when no unique tweet found---*/
function displayError() {
    $userValue.append(`No unique tweets for that user!`);
}
