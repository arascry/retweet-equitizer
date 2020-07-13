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
    array.forEach(element => {
        console.log(element);
    });
}