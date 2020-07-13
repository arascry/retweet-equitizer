let tweet;

$.ajax({
    url: 'https://jalfbcxbce.execute-api.us-west-1.amazonaws.com/default/twitterInfo',
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
    tweet = array;
    totalFavs = 0;
    array.forEach(element => {
        totalFavs += element.favorite_count;

    });
    console.log(totalFavs);
}