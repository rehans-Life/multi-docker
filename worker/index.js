const redis = require("redis");
const keys = require("./keys");

const redisClient = redis.createClient({
    socket:{
        host: keys.redistHost,
        port: keys.redisPort,
        reconnectStrategy: () => 1000
    },
});
const sub = redisClient.duplicate();

function fibonacci(index) {
    const cache = {};

    function helper(index) {
        if(index < 2) return index;
        cache[index] = helper(index - 1) + helper(index - 2);
        return cache[index];
    }

    return helper(index);
}

(async () => {
    try {
        await redisClient.connect();
        
        sub.subscribe('insert', async (message) => {
            await redisClient.hSet('values', message, fibonacci(parseInt(message)));
        });

        await sub.connect();    
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();

