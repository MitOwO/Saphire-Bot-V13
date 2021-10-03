const { f } = require('../../../Routes/frases.json')
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'lockcommands',
    aliases: ['nocommands', 'blockcommands'],
    category: 'moderation',
    UserPermissions: 'MANAGE_CHANNELS',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: '🔒',
    usage: '<lockcommands> <channel>',
    description: 'Tranque meus comandos em canais específicos para que não seja usados. (ADM\'s são imunes)',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        let channel = message.mentions.channels.first() || message.channel

        const InfoEmbed = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`${e.Deny} Bloqueio de Comandos`)
            .setDescription('Com este comando, torna-se possível o bloqueio dos meus comandos ou comandos de outros bots em canais específicos.')
            .addField(`${e.On} Bloqueie meus comandos`, `\`${prefix}lockcommands\``)
            .addField(`${e.On} Bloqueie todos os bots`, `\`${prefix}lockcommands bots\``)
            .addField(`${e.Off} Desative`, `\`${prefix}unlockcommands\``)

        if (['info', 'informações', 'informação', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return message.reply({ embeds: [InfoEmbed] })
        if (['bots', 'bot'].includes(args[0]?.toLowerCase())) return BloquearBots()

        if (db.get(`Servers.${message.guild.id}.Blockchannels.${channel.id}`)) { return message.reply(`${e.Check} | ${channel} já está bloqueado. \`${prefix}lockcommands info\``) }

        return message.reply(`${e.QuestionMark} | Você deseja bloquear todos os meus comandos no canal ${channel}?`).then(msg => {
            db.set(`Request.${message.author.id}`, `${msg.url}`)
            msg.react('✅').catch(err => { }) // e.Check
            msg.react('❌').catch(err => { }) // X

            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    db.delete(`Request.${message.author.id}`)
                    db.set(`Servers.${message.guild.id}.Blockchannels.${message.channel.id}`, true)
                    return msg.edit(`✅ | ${message.author} bloqueou todos os meus comandos no canal ${channel}.`).then(msg => {
                        db.get(`Servers.${message.guild.id}.Blockchannels.Bots.${channel.id}`) ? '' : BloquearBots()
                    }).catch(err => { })
                } else {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Request cancelada por: ${message.author}`).then(msg => {
                        db.get(`Servers.${message.guild.id}.Blockchannels.Bots.${channel.id}`) ? '' : BloquearBots()
                    }).catch(err => { })
                }
            }).catch(err => {
                db.delete(`Request.${message.author.id}`)
                msg.edit(`${e.Deny} | Request cancelada por: Tempo expirado.`)
            })
        })

        function BloquearBots() {
            if (db.get(`Servers.${message.guild.id}.Blockchannels.Bots.${channel.id}`)) { return message.reply(`${e.Check} | ${channel} já está bloqueado. \`${prefix}lockcommands info\``) }
            message.channel.sendTyping()
            setTimeout(() => {
                message.channel.send(`${e.QuestionMark} | ${message.author}, você quer bloquear todos os comandos de todos os bots neste canal?\n${e.SaphireObs} | Vale lembrar que Administradores **NÃO** são imunes a esse bloqueio.`).then(msg => {
                    db.set(`Request.${message.author.id}`, `${msg.url}`)
                    msg.react('✅').catch(err => { }) // e.Check
                    msg.react('❌').catch(err => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            db.delete(`Request.${message.author.id}`)
                            db.set(`Servers.${message.guild.id}.Blockchannels.Bots.${message.channel.id}`, true)
                            return msg.edit(`✅ | ${message.author} bloqueou todos comandos de todos os bots canal ${channel}.`).catch(() => { })
                        } else {
                            db.delete(`Request.${message.author.id}`)
                            msg.edit(`${e.Deny} | Request cancelada por: ${message.author}`)
                        }
                    }).catch(err => {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request cancelada por: Tempo expirado.`)
                    })
                })
            }, 2500)
        }

    }
}