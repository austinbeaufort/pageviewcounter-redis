const express = require('express');
const Influx = require('influx');
const redis = require('redis');

const bodyParser = require('body-parser');
const util = require('util');

let app = express();


// CONNECT REDIS
client = redis.createClient();
client.on('error', error => console.log(`Error: ${error}`));

let exists = util.promisify(client.exists.bind(client));
let hgetall = util.promisify(client.hgetall.bind(client));
let hmset = util.promisify(client.hmset.bind(client));

// CONNECT INFLUX
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'people',
});



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
        weight,
    }

    return userObj;
}

async function createPersonObject(userObj) {
    let { age, lastname, name, user, weight } = userObj;
    let personObj = {
        name,
        lastname,
        age,
        weight,
        user
    }
    await hmset(name, 'lastname', lastname, 'age', age, 'weight', weight, 'user', user);
    return personObj;
}

async function getInfluxData(name) {
    return influx.query(`
        select * from "userinfo"
        where "name" = '${name}'
    `);
}



async function gatherFunctions(body, response) {
    let name = body.name;
    let existsInRedis = await checkRedisForName(name);

    if(existsInRedis) {
        let redisObj = await getRedisData(name);
        let personObj = createUserObject(redisObj, name);
        return personObj;
    } else {
        let influxObj = await getInfluxData(name);
        let userObj = influxObj[0];
        if(userObj === undefined) {
            response.send('Requested Person not found...');
        } else {
            let personObj = await createPersonObject(userObj);
            return personObj;
        }
    }
}


function main(request, response) {
    return gatherFunctions(request.body, response)
                .then(reply => response.send(reply));
}


    
app.get('/countcheck', (request, response) => {
    response.send('checking page counts on this page');
})





// // RUN SERVER
const port = 3000 || process.env.PORT;

app.listen(port, () => console.log(`listening on port ${port}`));