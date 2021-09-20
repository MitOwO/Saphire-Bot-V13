const { Message } = require('discord.js')
const { e } = require('../emojis.json')

/**
 * @param { Message} message
 */

function ServerBlocked(message) {
    message.channel.send(`${e.Deny} | Este servidor está na blacklist.`).then(msg => {
        setTimeout(() => { msg.delete().catch(err => { }) }, 4000)
    }).catch(err => { })
}

module.exports = ServerBlocked