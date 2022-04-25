
const waitUntil = require("../utils/waitUntil")

let getTxStream=require("../utils/getTxStream")
module.exports = async function (fastify, opts) {
  fastify.get('/:id', function (request, reply) {
    (async () => {
         let txData;
    let txStream = await getTxStream(request.params.id,reply.raw, fastify)
    // console.log(txStream)
      txStream.pipe(reply.raw)
      
    })()
    })
      // console.log(request)
   
  }
  