
const waitUntil = require("../../utils/waitUntil")
let getBlockByHash=require("../../utils/getBlockByHash")
module.exports = async function (fastify, opts) {
    fastify.get('/height/:height', async function (request, reply) {
        let hash = await fastify.redis.block.get(request.params.height)
        if (!hash) {
            return {error:"Height not found, not mined yet or ganesha isn't fully synced."}
        }
  let blockInfo;
await waitUntil(async()=>{
    let block=await getBlockByHash(hash,fastify)
    if(block!=null){
        blockInfo=block
    }
    return block!=null
},100)
return blockInfo
      
    })
  }
  