const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
let app = express();


// CONNECT REDIS
client = redis.createClient();
client.on('error', error => console.log(`Error: ${error}`));


// SET PAGEVIEW COUNTER
client.set('pageviews', 0, redis.print);


// MIDDLEWARE FUNCTIONS
const pageViewCounter = function(request, response, next) {
    client.incr('pageviews', redis.print);
    console.log('pageviews increased by 1..');
    next();
}

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pageViewCounter);







// ROUTES
app.get('/', (request, response) => {
    response.send('testing for page views increment in redis');
})

app.get('/countcheck', (request, response) => {
    response.send('checking page counts on this page');
})





// // RUN SERVER
const port = 3000 || process.env.PORT;

app.listen(port, () => console.log(`listening on port ${port}`));