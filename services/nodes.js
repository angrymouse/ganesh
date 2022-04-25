

const fp = require('fastify-plugin')
const { default: redis } = require('ioredis/built/redis')
const {request}=require("undici")
// global.nodes=new Set()
global.blacklistedNodes=new Set()
 function wait(ms){
return new Promise(resolve=>{
  setTimeout(resolve, ms)
})
}
module.exports = fp(function (fastify, opts,done) {
  (async()=>{
    blacklistedNodes=new Set(await fastify.redis.db.smembers("BlacklistedNodes"))
    async function addNode(node){
      if(await fastify.redis.db.zscore("Nodes",node)||blacklistedNodes.has(node)){return}
      // await wait(nodes.size*1000)
      return await forceAddNode(node)
    }
async function forceAddNode(node){
  
  
  try{
  
  let nodePeers=await ((await request("http://"+node+"/peers",{maxRedirections:3,headersTimeout:1000,bodyTimeout:1000})).body).json()
  
  if(!await fastify.redis.db.zscore("Nodes",node)){
  await fastify.redis.db.zadd("Nodes",50000,node)
  }
  for (nodePeer of nodePeers){
    try{
      
    await addNode(nodePeer)
    // console.log(nodePeer+" added to nodes")
    }catch(e){
      console.log(e)
    }
  }
  
  }catch(e){ 
    // console.log(e)
    // console.log(node+" refused to connect")
    blacklistedNodes.add(node)
    fastify.redis.db.sadd("BlacklistedNodes",node)
    fastify.redis.db.zrem("Nodes",node)
  }
}
  let dbnodes=new Set(await fastify.redis.db.zrange("Nodes",0,1000))
  setInterval(()=>{
    // console.log("Currently "+nodes.size+" peers")
  },10000)
  for (node of dbnodes){
    
    await forceAddNode(node)
  }
  
  

 
  })()
  

return done()
})
