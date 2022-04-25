
const {randomInt} = require('crypto');
const {request}=require("undici")
module.exports = async function getBlock(hash, fastify) {
    let randomGoodNode=(await fastify.redis.db.zrange("Nodes",0,10))[randomInt(10)]
    if(!randomGoodNode){return null}
    try{
    
 
let startTime=Date.now()
let blockInfo=(await request("http://"+randomGoodNode+"/block/hash/"+hash,{maxRedirections:3})).body
// console.log(blockInfo)
let blockBody=await blockInfo.text()


blockBody=JSON.parse(blockBody)
let finishTime=Date.now()-startTime
fastify.redis.db.zincrby("Nodes",finishTime-100,randomGoodNode)

return blockBody
    }catch(e){

        fastify.redis.db.zincrby("Nodes",2000,randomGoodNode)
        // console.log(e,)
        return null
    }
}