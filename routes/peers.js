
module.exports = async function (fastify, opts) {
    fastify.get('/peers', async function (request, reply) {
      // fastify.redis.dataCache.set("za","lupa")
    return fastify.redis.db.zrange("Nodes",0,100000)
      
    })
  }
  