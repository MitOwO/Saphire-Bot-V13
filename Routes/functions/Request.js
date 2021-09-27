const db = require('quick.db')
const { Message } = require('discord.js')

/** 
* @param {Message} message
*/

function RequestAutoDelete(message) {
    setTimeout(() => {
        let request = db.delete(`Request.${message.author.id}`)
        request ? db.delete(`Request.${message.author.id}`) : ''
    }, 120000)
}

module.exports = RequestAutoDelete