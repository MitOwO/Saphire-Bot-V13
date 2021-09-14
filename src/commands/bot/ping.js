const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'ping',
    aliases: ['ws', 'ms', 'latency'],
    category: 'bot',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '🏓',
    description: 'Ping/Latency do bot',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        await message.reply(`${e.Loading} Pinging...`).then(msg => {
        msg.edit(`⏱️ Latency Client: ${client.ws.ping}ms | Latency Server: ${Math.floor(msg.createdAt - message.createdAt)}ms`)
        }).catch(err => { return message.channel.send(`${e.Deny} | Ocorreu um erro no comando ping:\n\`${err}\``)})
    }
}