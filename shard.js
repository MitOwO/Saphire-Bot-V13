const { ShardingManager } = require('discord.js')
const client = require('./index.js')
const { config } = require('./Routes/config.json')
const { e } = require('./Routes/emojis.json')
const Data = require('./Routes/functions/data')
require("dotenv").config()

let manager = new ShardingManager('./index.js', {
    token: process.env.DISCORD_CLIENT_BOT_TOKEN,
    shardList: 'auto',
    totalShards: 'auto'
})

manager.on('shardCreate', async (shard) => {
    client.channels.cache.get(config.LogChannelId).send(`${e.Check} | Um novo Shard foi criado.\n${e.Info} | Shard: ${shard.id} \`${Data}\``)
})

manager.on('shardDisconnect', async (shard) => {
    client.channels.cache.get(config.LogChannelId).send(`${e.Deny} | Um Shard foi desconectado.\n${e.Info} | Shard: ${shard.id} \`${Data}\``)
})

manager.on('shardError', async (err, shard) => {
    client.channels.cache.get(config.LogChannelId).send(`${e.Warn} | Ocorreu um erro em um Shard.\n${e.Info} | Shard: ${shard.id} \`${Data}\`\n-> \`${err}\``)
})

manager.on('shardReady', async (shard) => {
    client.channels.cache.get(config.LogChannelId).send(`${e.Check} | Shard pronto.\n${e.Info} | Shard: ${shard.id} \`${Data}\``)
})

manager.on('shardReconnecting', async (shard) => {
    client.channels.cache.get(config.LogChannelId).send(`${e.Loading} | Shard reconectando.\n${e.Info} | Shard: ${shard.id} \`${Data}\``)
})

manager.spawn()
