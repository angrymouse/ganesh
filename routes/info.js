module.exports = async function (fastify, opts) {
    async function handle (request, reply) {
        return {
            "network": "arweave.N.1",
            "version": 5,
            "release": 52,
            "height": newestBlock.height,
            "current": newestBlock,
            "blocks":newestBlock.height,
            "peers": await fastify.redis.db.zcount("Nodes","-inf","+inf"),
            "queue_length": 0,
            "node_state_latency": 0
    }
    }
    fastify.get('/info', handle)
    fastify.get('/',handle )
  }
  