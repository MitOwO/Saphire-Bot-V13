const { Permissions } = require('discord.js')
const Error = require('../../../Routes/functions/errors')
const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')

module.exports = {
    name: 'comprovante',
    category: 'bot',
    ClientPermissions: ['MANAGE_CHANNELS', 'ADD_REACTIONS'],
    emoji: `${e.Pix}`,
    usage: '<comprovante>',
    description: 'Comprove doações e adquira seu VIP mais bônus',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (message.guild.id !== config.guildId)
            return message.reply(`${e.SaphireObs} | Este é um comando privado do meu servidor de suporte para comprovação de doações. Você fez alguma doação? Simples! Entre no meu servidor e usa o comando \`${prefix}comprovante\`.\nhttps://discord.gg/dDX47fEzb9`)

        if (db.get(`${message.author.id}.Cache.ComprovanteOpen`))
            return message.reply(`${e.Deny} | Você já possui um canal de comprovação aberto!`)

        await message.guild.channels.create(message.author.tag, {
            type: 'GUILD_TEXT',
            topic: `${message.author.id}`,
            parent: '893307009246580746',
            reason: `Pedido feito por: ${message.author.tag}`,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL],
                },
                {
                    id: message.author.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.EMBED_LINKS],
                },
            ]
        }).then(channel => {
            db.set(`${message.author.id}.Cache.ComprovanteOpen`, true)
            message.react(`${e.Check}`)
            channel.send(`${message.author}, mande o **COMPROVANTE** do pagamento/pix/transação contendo **DATA, HORA** e **VALOR**.\nCaso você queria VIP, é só dizer.\n \nPara fechar este canal, manda \`fechar\``)
            message.reply(`Aqui está o seu canal: ${channel}`).then(Msg => {

                // const filter = m => m.content?.toLowerCase() === ('close')
                const filter = m => ['cancelar', 'cancel', 'close', 'fechar', 'terminar'].includes(m.content?.toLowerCase())
                const collector = channel.createMessageCollector({ filter, max: 1, time: 300000 });

                collector.on('collect', m => {
                    db.delete(`${message.author.id}.Cache.ComprovanteOpen`)
                    Msg.delete().catch(() => { })
                    channel.delete().catch(() => { })
                });
            }).catch(err => {
                Error(message, err)
                return message.channel.send(`${e.Deny} | Ocorreu um erro ao criar o canal.\n\`${err}\``)
            })
        }).catch(err => {
            Error(message, err)
            return message.channel.send(`${e.Deny} | Ocorreu um erro ao criar o canal.\n\`${err}\``)
        })
    }
}