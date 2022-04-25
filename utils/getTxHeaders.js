const { request } = require("undici");
const {randomInt} = require('crypto');
module.exports = async ( txId,fastify) => {

    let randomGoodNode = (await fastify.redis.db.zrange("Nodes", 0, 10))[randomInt(10)]
    if (!randomGoodNode) { return null }
    try {
    
 
        let startTime = Date.now()
        let txInfo = (await request("http://" + randomGoodNode + "/tx/" + txId, { maxRedirections: 3 })).body

        let txBody = await txInfo.text()


        txBody= JSON.parse(txBody)
        let finishTime = Date.now() - startTime
        fastify.redis.db.zincrby("Nodes", finishTime - 100, randomGoodNode)
      
        return txBody
    } catch (e) {
        // console.log(e)
        fastify.redis.db.zincrby("Nodes", 2000, randomGoodNode)
    
        return null
    }
}