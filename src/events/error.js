const { MessageEmbed } = require('discord.js')
const client = require('../../index')
const { config } = require('../../Routes/config.json')
const { e } = require('../../Routes/emojis.json')

client.on('error', (error) => {
    const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro - CLIENT ERROR`).addField('Aviso', `${error}`)
    client.users.cache.get(config.ownerId).send({ embeds: [NewError] }).catch(err => { return })
})