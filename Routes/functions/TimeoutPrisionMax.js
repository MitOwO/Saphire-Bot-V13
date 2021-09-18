const { e } = require('../emojis.json')
const ms = require("parse-ms")
const { Message } = require('discord.js')
const db = require('quick.db')

/**
 * @param { Message } message
 */

function TimeoutPrisionMax(message) {
    let author1 = db.get(`User.${message.author.id}.Timeouts.Preso`)
    if (author1 !== null && 600000 - (Date.now() - author1) > 0) {
        let time = ms(600000 - (Date.now() - author1))
        return message.reply(`${e.Sirene} | Você está sob detenção máxima por mais \`${time.hours}h ${time.minutes}m e ${time.seconds}s\` `)
    }
}

module.exports = TimeoutPrisionMax