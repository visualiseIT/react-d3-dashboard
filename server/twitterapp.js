var cors = require('cors')
const express = require('express')
const twit = require("twit")

let Twitter = new twit({
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: '',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
});


const app = express();
app.use(cors());

// Start serv & listen on port 8080.
let port = 7070;
app.listen(port, function() {
    console.log('Node listening on port ' + port);
})

//Listen for get request on root url. eg. http://localhost:3000
app.get('/', function(req, res) {

    let response = 'Woohoo, our homepage works!';
    let q = req.query.q || '#100DaysOfCode';

    Twitter.get('search/tweets', {
        q: q,
        // q: '#100DaysOfCode',
        count: 150,
        result_type: "mixed"
    }).catch(function(err) {
        console.log('caught error', err.stack)
        res.send(response);
    }).then(function(result) {
        console.log('data', result.data);
        response = result.data;
        res.send(response);
    });



})
