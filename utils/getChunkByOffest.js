const { request } = require("undici");
const {randomInt} = require('crypto');
const wait = require("./wait");
module.exports = async ( offset,fastify) => {

    let randomGoodNode = (await fastify.redis.db.zrange("Nodes", 0, 100))[randomInt(100)]
    if (!randomGoodNode) { return null }
    try {
    
 
        let startTime = Date.now()

        let chunk = await (await request("http://" + randomGoodNode + "/chunk/"+offset, { maxRedirections: 3 })).body.json()
console.log("Node replied! "+randomGoodNode)
        let finishTime = Date.now() - startTime
        fastify.redis.db.zincrby("Nodes", finishTime - 2000, randomGoodNode)
 
        return Buffer.from(chunk.chunk,"base64")
    } catch (e) {
        
        fastify.redis.db.zincrby("Nodes", 20000, randomGoodNode)
    // await wait(1000)
        return await module.exports(offset,fastify)
    }
}