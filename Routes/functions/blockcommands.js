const Notify = require('./notify')
const { e } = require('../../database/emojis.json')
const { sdb } = require('./database')
const client = require('../../index')

async function BlockCommandsBot(Message) {

    let message = Message

    if (!sdb.get(`Servers.${message.guild.id}.Blockchannels.Bots.${message.channel.id}`))
        return

    if (message.author.id !== client.user.id && message.author.bot) {

        message.delete().catch(() => {
            sdb.delete(`Servers.${message.guild.id}.Blockchannels.Bots`)
            Notify(message.guild.id, 'Recurso Desabilitado', `Aparentemente eu estou **sem permissão** para apagar mensagens de outros bots. Para evitar conflitos e estresse, a configuração **${prefix}lockcommands bots** foi desativada no servidor.`)
            return message.channel.send(`${e.Warn} | Estou sem permissão para executar o bloqueio de comandos de outros bots. Sistema desativado.`)
        })

        const msg = await message.channel.send(`${e.Deny} | Comandos de bots foram bloqueados neste canal.`)
        return setTimeout(() => { msg.delete().catch(() => { }) }, 4500)

    } else { return }
}

module.exports = { BlockCommandsBot }