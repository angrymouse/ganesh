

const fp = require('fastify-plugin')
const waitUntil = require("../utils/waitUntil")
const getBlock = require("../utils/getBlockByHash")
let scannedBlocks=new Set([-1])
const {
    randomInt
  } = require('crypto');
const {request}=require("undici")
global.newestBlock={height:0,hash:"7wIU7KolICAjClMlcZ38LZzshhI7xGkm2tDCJR7Wvhe3ESUo2-Z4-y0x1uaglRJE"}
global.blacklistedNodes=new Set()
 function wait(ms){
return new Promise(resolve=>{
  setTimeout(resolve, ms)
})
}
module.exports = fp(function (fastify, opts,done) {
  async function scanForNewBlocks()  {
     let bestNode=(await fastify.redis.db.zrange("Nodes",0,0))[0]
      let info=await ((await request("http://"+bestNode+"/info",{maxRedirections:3,bodyTimeout:300,headersTimeout:1000})).body).json()
      scanBlock(info.current,fastify)
   
     
  }
  scanForNewBlocks()
  setInterval(scanForNewBlocks,5000)

return done()
})
async function scanBlock(hash,fastify){

let blockInfo;
await waitUntil(async()=>{
    let block=await getBlock(hash,fastify)
    // console.log(block)
    if(block!=null){
        blockInfo=block
    }
    return block!=null
}, 100)
  scannedBlocks.add(blockInfo.height)
  if(scannedBlocks.has(blockInfo.height-1)){return}
  // console.log(blockInfo.height)
  if (newestBlock.height < blockInfo.height) {
    newestBlock=blockInfo.height
  }
  fastify.redis.block.set(blockInfo.height,hash)
// console.log(randomGoodNode,blockInfo,finishTime)
scanBlock(blockInfo.previous_block,fastify)
return null
} 