const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const util = require('util');
let app = express();


// CONNECT REDIS
client = redis.createClient();
client.on('error', error => console.log(`Error: ${error}`));

let exists = util.promisify(client.exists.bind(client));
let hgetall = util.promisify(client.hgetall.bind(client));

// MIDDLEWARE FUNCTIONS


// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// ROUTES
app.get('/', (request, response) => {
    response.send('testing');
});

app.post('/', main);


async function checkRedisForName(name) {
    return await exists(name);
};

async function getRedisData(name) {
    const redisData = await hgetall(name);
    return redisData;
    
}

function createUserObject(obj, name) {
    let { lastname, age, weight } = obj;
    let userObj = {
        name,
        lastname,
        age,
        weight
    }

    return userObj;
}

async function gatherFunctions(body) {
    let name = body.name;
    let existsInRedis = await checkRedisForName(name);
    console.log(existsInRedis);
    if(existsInRedis) {
        let redisObj = await getRedisData(name);
        let userObj = createUserObject(redisObj, name);
        return userObj;
    } else {
        console.log('no name found');
    }
}


function main(request, response) {
    return gatherFunctions(request.body)
                .then(reply => response.send(reply));
}


    
app.get('/countcheck', (request, response) => {
    response.send('checking page counts on this page');
})





// // RUN SERVER
const port = 3000 || process.env.PORT;

app.listen(port, () => console.log(`listening on port ${port}`));