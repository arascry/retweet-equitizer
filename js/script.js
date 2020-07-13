let tweet;

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
    tweet = array.result;
    totalFavs = 0;
    for (let i = 0; i < 10; i++) {
        console.log(totalFavs);
    }
}