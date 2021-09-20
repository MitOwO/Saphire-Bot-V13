const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'leavechannel',
    aliases: ['setleave', 'setleavechannel'],
    category: 'config',
    UserPermissions: 'MANAGE_CHANNELS',
    ClientPermissions: 'SEND_MESSAGES',
    emoji: `${e.Loud}`,
    usage: '<leavechannel> [#channel] | [off]',
    description: 'Selecione um canal para eu avisar quem sai do servidor',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        let channel = message.mentions.channels.first() || message.channel

        let canal = db.get(`Servers.${message.guild.id}.LeaveChannel`)
        let WelcomeChannel = db.get(`Servers.${message.guild.id}.WelcomeChannel`)

        const Autenticando = new MessageEmbed().setColor('BLUE').setDescription(`${e.Loading} | Autenticando...`)
        const Autenticado = new MessageEmbed().setColor('GREEN').setDescription(`${e.Check} | Request autenticada`).setFooter(`${message.author.id}`)
        const Abortada = new MessageEmbed().setColor('RED').setDescription(`${e.Deny} | Request abortada`).setFooter(`${message.author.id}`)
        const Expired = new MessageEmbed().setColor('RED').setDescription(`${e.Deny} | Request abortada | Tempo excedido`).setFooter(`${message.author.id}`)

        if (args[0] === 'off') {
            if (canal === null || canal === undefined) {
                return message.reply(`${e.Deny} | O Leave System já está desativado.`)
            } else if (canal) {

                const QuestionEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`${e.QuestionMark} | Você deseja desativar o sistema de saídas?`)

                return message.reply({ embeds: [QuestionEmbed] }).then(msg => {
                    db.set(`User.Request.${message.author.id}`, 'ON')
                    msg.react('✅').catch(err => { }) // e.Check
                    msg.react('❌').catch(err => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first()

                            if (reaction.emoji.name === '✅') {
                                msg.edit({ embeds: [Autenticando] })
                                message.channel.sendTyping().then(() => {
                                    setTimeout(function () {
                                        db.delete(`User.Request.${message.author.id}`)
                                        db.delete(`Servers.${message.guild.id}.LeaveChannel`)
                                        msg.edit({ embeds: [Autenticado] }).catch(err => { })
                                        message.reply(`${e.Nagatoro} | Prontinho, agora eu não vou dizer mais nada quando alguém sair no servidor.`)
                                    }, 4000)
                                })
                            } else {
                                db.delete(`User.Request.${message.author.id}`)
                                msg.edit({ embeds: [Abortada] })
                            }
                        }).catch(() => { db.delete(`User.Request.${message.author.id}`); msg.edit({ embeds: [Expired] }) })
                })
            }

        } else if (channel.id === canal) {
            return message.reply(`${e.Info} | Este canal já foi definido como Leave Channel!`)
        } else if (channel !== canal) {

            const QuestionsEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setDescription(`${e.QuestionMark} | Deseja configurar "${channel}" como canal de saídas?`)
                .setFooter(`Request: ${message.author.id}`)

            return message.reply({ embeds: [QuestionsEmbed] }).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { }) // e.Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.edit({ embeds: [Autenticando] })
                            message.channel.sendTyping().then(() => {
                                setTimeout(function () {
                                    db.delete(`User.Request.${message.author.id}`)
                                    db.set(`Servers.${message.guild.id}.LeaveChannel`, channel.id)
                                    msg.edit({ embeds: [Autenticado] })
                                    message.channel.send(`Aeee ${e.NezukoJump}! De agora em diante, vou falar no canal ${channel} sobre todo mundo que sair do servidor.`).then(() => {

                                        if (WelcomeChannel) return
                                        message.channel.sendTyping().then(() => {
                                            setTimeout(() => {
                                                message.channel.send(`${e.QuestionMark} | Ei, ei ${message.author}! Posso ativar o sistema de boas-vindas no canal "${channel}" também?`).then(msg => {
                                                    db.set(`User.Request.${message.author.id}`, 'ON')
                                                    msg.react('✅').catch(err => { }) // e.Check
                                                    msg.react('❌').catch(err => { }) // X

                                                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                                                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                                                        .then(collected => {
                                                            const reaction = collected.first()

                                                            if (reaction.emoji.name === '✅') {
                                                                msg.reply({ embeds: [Autenticando] }).then(x => {

                                                                    message.channel.sendTyping().then(() => {
                                                                        setTimeout(function () {
                                                                            db.delete(`User.Request.${message.author.id}`)
                                                                            db.set(`Servers.${message.guild.id}.WelcomeChannel`, channel.id)
                                                                            x.edit({ content: `${e.Check} | Autenticação aprovada | ${message.channel.id}`, embeds: [Autenticado] }).catch(err => { })
                                                                            message.channel.send(`${e.NezukoJump} | Nice, nice! Daqui pra frente, eu vou avisar no canal "${channel}" sobre todo mundo que entrar e sair do servidor.`)
                                                                        }, 3100)
                                                                    })
                                                                })
                                                            } else {
                                                                db.delete(`User.Request.${message.author.id}`)
                                                                msg.edit(`${e.Deny} | Indicação abortada | ${client.user.id}`)
                                                            }
                                                        }).catch(() => {
                                                            db.delete(`User.Request.${message.author.id}`)
                                                            msg.edit(`${e.Deny} | Indicação abortada | Tempo expirado`)
                                                        })
                                                })
                                            }, 1900)
                                        }).catch(err => { return message.channel.send(`${e.Warn} | Houve um erro na execução deste comando.\n\`${err}\``) })
                                    })
                                }, 4000)
                            })
                        } else {
                            db.delete(`User.Request.${message.author.id}`)
                            msg.edit({ embeds: [Abortada] })
                        }
                    }).catch(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit({ embeds: [Expired] })
                    })
            })
        }
    }
}