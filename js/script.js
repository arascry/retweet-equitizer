let tweet;

$.ajax({ url: 'https://xbt1ufjtw9.execute-api.us-west-1.amazonaws.com/default/twitterInfo' }).then(
    (data) => {
        processData(data);
    },
    (error) => {
        console.log('Bad Request ' + error);
    }
);




function processData(array) {
    totalFavs = 0;
    array.forEach(element => {
        totalFavs += element.favorite_count;

    });
    console.log(totalFavs);
}