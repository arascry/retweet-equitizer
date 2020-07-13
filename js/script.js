let tweet;

$.ajax({ url: 'https://xbt1ufjtw9.execute-api.us-west-1.amazonaws.com/default/twitterInfo' }).then(
    (data) => {
        tweet = data;
    },
    (error) => {
        console.log('Bad Request ' + error);
    }
);

console.log(tweet);
