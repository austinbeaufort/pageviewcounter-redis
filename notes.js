/*

// MIDDLEWARE FUNCTIONS
const pageViewCounter = function(request, response, next) {

    // FIRST WAY
    multi = client.multi()
    multi.incr('count1', redis.print);
    multi.incr('count2', redis.print);
    console.log('hi');
    multi.exec((error, replies) => {
        if (error) throw error;
        console.log(replies);
    })
    next();

    // SECOND WAY
    client.multi()
        .incr('count1', redis.print)
        .incr('count2', redis.print)
        .exec((error, replies) => {
            if(error) throw error;
            console.log(replies);
        });

    next();
}

*/












