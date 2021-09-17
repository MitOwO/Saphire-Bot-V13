const { Message } = require('discord.js')
const { config } = require('../config.json')
const { e } = require('../emojis.json')

/**
 * @param { Message} message
 */

function Blacklisted(message) {
        (message.author.id === config.ownerId) ? '' : Warning()

    function Warning() {
        message.channel.send(`${e.deny} | ${message.author}, você está na blacklist e não tem acesso a nenhum dos meus comandos.`).then(msg => {
            setTimeout(() => { msg.delete().catch(err => { return }) }, 4000)
        })
    }
}

module.exports = Blacklisted