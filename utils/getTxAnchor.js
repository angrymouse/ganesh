
const {randomInt} = require('crypto');
const {request}=require("undici")
module.exports = async function getTxAnchor( fastify) {
    let randomGoodNode=(await fastify.redis.db.zrange("Nodes",0,10))[randomInt(10)]
    if(!randomGoodNode){return null}
    try{
    
 
let startTime=Date.now()
let txAnchor=(await request("http://"+randomGoodNode+"/tx_anchor",{maxRedirections:3})).body

let anchor=await txAnchor.text()



let finishTime=Date.now()-startTime
fastify.redis.db.zincrby("Nodes",finishTime-100,randomGoodNode)

return anchor
    }catch(e){

        fastify.redis.db.zincrby("Nodes",2000,randomGoodNode)
        // console.log(e)
        return null
    }
}