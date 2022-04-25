const { request } = require("undici");
const { Readable } = require('stream');
const { randomInt } = require('crypto');
const getTxHeaders = require("./getTxHeaders")
const getChunkByOffset=require("./getChunkByOffest")
const stream = require('stream');
const waitUntil = require("./waitUntil");
module.exports = ( txId,whereToPipe,fastify) => {
    return new Promise(async (resolve, reject) => {
          let randomGoodNode = (await fastify.redis.db.zrange("Nodes", 0, 100))[randomInt(100)]
    if (!randomGoodNode) { return null }
        try{
            let stat;
            await waitUntil(async () => {
                try { 
                stat= await (await request("http://" + randomGoodNode + "/tx/" + txId + "/offset")).body.json()

                } catch (e) {
                     fastify.redis.db.zincrby("Nodes", 10000, randomGoodNode)
                    return false
                }
})
            
            let {offset,size}=stat
            offset=parseInt(offset),size=parseInt(size)
            let final=offset+size
            let done = offset
            async function* downloadChunks() {
                while (done < final) {
                    let required = final - done
                    
                    let chunk = await getChunkByOffset(done.toString(), fastify)
                    console.log(chunk)
                    if (parseInt(chunk.length) > required) {
                        chunk=chunk.slice(0,parseInt(required.toString()))
                    }
                    yield chunk
                    done+=chunk.length
                }
            }
            resolve(Readable.from(downloadChunks()))
        
    } catch (e) {
        console.log(e)
        fastify.redis.db.zincrby("Nodes", 2000, randomGoodNode)
    
      resolve(null)
    }
})
    
}