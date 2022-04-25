
const waitUntil = require("../utils/waitUntil")
let getTxAnchor=require("../utils/getTxAnchor")
module.exports = async function (fastify, opts) {
    fastify.get('/tx_anchor', async function (request, reply) {
  let txAnchor;
await waitUntil(async()=>{
    let anchor=await getTxAnchor(fastify)
    console.log(anchor)
    if(anchor!=null){
       txAnchor =anchor
    }
    return anchor!=null
},100)
return txAnchor
      
    })
  }
  