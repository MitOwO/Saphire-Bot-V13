const { Message, MessageEmbed } = require('discord.js')
const client = require('../../index')
const { config } = require('../config.json')
const { e } = require('../emojis.json')
const db = require('quick.db')
const Moeda = require('../../Routes/functions/moeda')

/**
 * @param { Message } message
 */

function Error(message, err) {

    let prefix = db.get(`Servers.${message.guild.id}.Prefix`) || config.prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()

    Send();
    Block();

    function Send() {
        message.channel.createInvite({ maxAge: 0 }).then(ChannelInvite => {
            const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro | Handler`).setDescription(`Author: ${message.author} | ${message.author.tag} |*\`${message.author.id}\`*\nMensagem: \`${message.content}\`\nServidor: [${message.guild.name}](${ChannelInvite.url})\nMensagem: [Link Mensagem](${message.url})\n\`\`\`js\n${err.stack?.slice(0, 2000)}\`\`\``)
            client.users.cache.get(config.ownerId).send({ embeds: [NewError] }).catch(err => { })
        }).catch(() => {
            const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro | Handler`).setDescription(`Author: ${message.author} | ${message.author.tag} |*\`${message.author.id}\`*\nMensagem: \`${message.content}\`\nServidor: ${message.guild.name} *(Falha ao obter o convite)*\nMensagem: [Link Mensagem](${message.url})\n\`\`\`js\n${err.stack?.slice(0, 2000)}\`\`\``)
            client.users.cache.get(config.ownerId).send({ embeds: [NewError] }).catch(err => { })
        })
    }

    function Block() {
        db.set(`ComandoBloqueado.${cmd}`, `${err.message}`)
        db.add(`Balance_${message.author.id}`, 1000)
        message.channel.send(`${e.Warn} Ocorreu um erro neste comando. Mas não se preocupe! Eu já avisei meu criador e ele vai arrumar isso rapidinho.\n${e.PandaProfit} +1000 ${Moeda(message)}`).catch(err => { })
    }
}

module.exports = Error