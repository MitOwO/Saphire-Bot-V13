const { Message, MessageEmbed } = require('discord.js')
const { sdb, db, DatabaseObj } = require('./database')
const { e, config } = DatabaseObj
const client = require('../../index')
const Moeda = require('./moeda')

/**
 * @param { Message } message
 */

function Error(message, err) {

    if (err.code === 10008) // Unknown message
        return

    if (err.code === 50035) // Invalid Form Body
        return

    let prefix = sdb.get(`Servers.${message.guild.id}.Prefix`) || config.prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()

    Send();
    Block();

    async function Send() {
        message.channel?.createInvite({ maxAge: 0 }).then(async ChannelInvite => {
            const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro | Handler`).setDescription(`Author: ${message.author} | ${message.author.tag} |*\`${message.author.id}\`*\nMensagem: \`${message.content}\`\nServidor: [${message.guild.name}](${ChannelInvite.url})\nMensagem: [Link Mensagem](${message.url})\n\`\`\`js\n${err.stack?.slice(0, 2000)}\`\`\``).setFooter(`Error Code: ${err.code || 0}`)
            await client.users.cache.get(config.ownerId).send({ embeds: [NewError] }).catch(() => { })
        }).catch(async () => {
            const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro | Handler`).setDescription(`Author: ${message.author} | ${message.author.tag} |*\`${message.author.id}\`*\nMensagem: \`${message.content}\`\nServidor: ${message.guild.name} *(Falha ao obter o convite)*\nMensagem: [Link Mensagem](${message.url})\n\`\`\`js\n${err.stack?.slice(0, 2000)}\`\`\``).setFooter(`Error Code: ${err.code || 0}`)
            await client.users.cache.get(config.ownerId).send({ embeds: [NewError] }).catch(() => { })
        })
    }

    function Block() {
        sdb.set(`ComandoBloqueado.${cmd}`, `> ${err?.message}`)
        db.add(`Balance_${message.author.id}`, 1000)
        message.channel.send(`${e.Warn} Ocorreu um erro neste comando. Mas não se preocupe! Eu já avisei meu criador e ele vai arrumar isso rapidinho.\n${e.PandaProfit} +1000 ${Moeda(message)}`).catch(() => { })
    }
}

module.exports = Error