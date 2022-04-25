
const waitUntil = require("../../utils/waitUntil")
let getTxHeaders=require("../../utils/getTxHeaders")
module.exports = async function (fastify, opts) {
    fastify.get('/:id', async function (request, reply) {
  let txHeadersInfo;
await waitUntil(async()=>{
    let txHeaders=await getTxHeaders(request.params.id,fastify)
 
    if(txHeaders!=null){
        txHeadersInfo=txHeaders
    }
    return txHeaders!=null
},100)
return txHeadersInfo
      
    })
  }
  