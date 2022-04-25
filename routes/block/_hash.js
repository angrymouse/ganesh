
const waitUntil = require("../../utils/waitUntil")
let getBlockByHash=require("../../utils/getBlockByHash")
module.exports = async function (fastify, opts) {
    fastify.get('/hash/:hash', async function (request, reply) {
  let blockInfo;
await waitUntil(async()=>{
    let block=await getBlockByHash(request.params.hash,fastify)
 
    if(block!=null){
        blockInfo=block
    }
    return block!=null
},100)
return blockInfo
      
    })
  }
  