const client = require('../../index')
const { db } = require('../../Routes/functions/database')

client.on('messageReactionRemove', async (reaction, user) => {

    return

    if (reaction.message.partial) await reaction.message.fetch()
    if (reaction.partial) await reaction.fetch()
    if (user.bot) return
    if (!reaction.message.guild) return

    const message = reaction.message,
        channel = message.channel

    if (message.id === db.get('MessageId')) {
        channel.send(`React Message Removed! ${reaction.emoji}`)
    }

    return

})