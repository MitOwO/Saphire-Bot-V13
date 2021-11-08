const { Message } = require('discord.js')
const { e } = require('../../database/emojis.json')
const { sdb } = require('./database')

/**
 * @param {Message} message 
 */

function Moeda(message) {
    return sdb.get(`Servers.${message.guild.id}.Moeda`) ? sdb.get(`Servers.${message.guild.id}.Moeda`) : `${e.Coin} Moedas`
}

module.exports = Moeda