const { Message } = require('discord.js')
const { e } = require('../emojis.json')
const db = require('quick.db')

/**
 * @param {Message} message 
 */

function Moeda(message) {

    let Moeda = `${e.Coin} Moedas`
    let Edit = db.get(`Servers.${message.guild.id}.Moeda`)
    return Edit ? `${Edit}` : `${Moeda}`
}

module.exports = Moeda