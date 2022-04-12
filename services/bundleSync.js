

const fp = require('fastify-plugin')
const waitUntil=require("../utils/waitUntil")
const {
    randomInt,
  } = require('crypto');
const {request}=require("undici")
global.nodes=new Set()
global.blacklistedNodes=new Set()
 function wait(ms){
return new Promise(resolve=>{
  setTimeout(resolve, ms)
})
}
module.exports = fp(function (fastify, opts,done) {
  (async()=>{
      let bestNode=(await fastify.redis.db.zrange("Nodes",0,0))[0]
      
      let info=await ((await request("http://"+bestNode+"/info",{maxRedirections:3})).body).json()
      console.log(await scanBlock(info.current,fastify))
  })()
  

return done()
})
async function scanBlock(hash,fastify){

let blockInfo;
await waitUntil(async()=>{
    let block=await getBlock(hash,fastify)
    // console.log(block!=null)
    if(block!=null){
        blockInfo=block
    }
    return block!=null
},10)
console.log(blockInfo.height)
// console.log(randomGoodNode,blockInfo,finishTime)
await scanBlock(blockInfo.previous_block,fastify)
} 
async function getBlock(hash,fastify){
    try{
    let randomGoodNode=(await fastify.redis.db.zrange("Nodes",0,10))[randomInt(10)]
    // console.log((await fastify.redis.db.zrange("Nodes",3,10,)))
let startTime=Date.now()
let blockInfo=(await request("http://"+randomGoodNode+"/block/hash/"+hash,{maxRedirections:3})).body
let blockBody=await blockInfo.json()
let finishTime=Date.now()-startTime
fastify.redis.db.zincrby("Nodes",finishTime-500,randomGoodNode)
console.log(randomGoodNode,finishTime)
return blockBody
    }catch(e){
        return null
    }
}