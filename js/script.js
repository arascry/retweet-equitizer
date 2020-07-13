$.ajax({ url: 'https://xbt1ufjtw9.execute-api.us-west-1.amazonaws.com/default/twitterInfo' }).then(
    (data) => {
        console.log(data);
    },
    (error) => {
        console.log('Bad Request ' + error);
    }
);
