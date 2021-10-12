const { MessageEmbed } = require('discord.js')
const client = require('../../index')
const { config } = require('../../Routes/config.json')
const { e } = require('../../Routes/emojis.json')

client.on('warn', (warn) => {
    const NewWarn = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de WARN - CLIENT WARN`).addField('Aviso', `${warn}`)
    client.users.cache.get(config.ownerId).send({ embeds: [NewWarn] }).catch(() => { })
})