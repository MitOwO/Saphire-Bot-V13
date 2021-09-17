const db =  require('quick.db')
const { Message } = require('discord.js')
const { e } = require('../emojis.json')

/** 
* @param {Message} message
*/

function BakaBlocked(message) {
    setTimeout(() => { db.delete(`User.${message.author.id}.Baka`) }, 20000)
    return message.reply(`Saaai, você me chamou de BAAAKA ${e.MaikaAngry}`)
}

module.exports = BakaBlocked