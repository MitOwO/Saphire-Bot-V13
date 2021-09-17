const db = require('quick.db')
const { Message } = require('discord.js')

/** 
* @param {Message} message
*/

function RequestAutoDelete(message) {
    setTimeout(() => { db.delete(`User.Request.${message.author.id}`) }, 120000)
}

module.exports = RequestAutoDelete