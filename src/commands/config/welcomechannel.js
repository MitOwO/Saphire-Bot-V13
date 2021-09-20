const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'welcomechannel',
    aliases: ['setwelcome', 'setwelcomechannel'],
    category: 'config',
    UserPermissions: 'MANAGE_CHANNELS',
    ClientPermissions: 'SEND_MESSAGES',
    emoji: `${e.Loud}`,
    usage: '<welcomechannel> [#channel] | [off]',
    description: 'Selecione um canal para eu avisar todos que chegarem no servidor',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        let channel = message.mentions.channels.first() || message.channel

        let canal = db.get(`Servers.${message.guild.id}.WelcomeChannel`)
        let LeaveChannel = db.get(`Servers.${message.guild.id}.LeaveChannel`)

        if (args[0] === 'off') {
            if (canal === null) {
                return message.reply(`${e.Deny} | O Welcome System já está desativado.`)
            } else if (canal) {

                return message.reply(`${e.QuestionMark} | Você deseja desativar o sistema de boas-vindas?`).then(msg => {
                    db.set(`User.Request.${message.author.id}`, 'ON')
                    msg.react('✅').catch(err => { }) // e.Check
                    msg.react('❌').catch(err => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first()

                            if (reaction.emoji.name === '✅') {
                                msg.edit(`${e.Loading} | Autenticando... | .................`)
                                message.channel.sendTyping().then(() => {
                                    setTimeout(function () {
                                        db.delete(`User.Request.${message.author.id}`)
                                        db.delete(`Servers.${message.guild.id}.WelcomeChannel`)
                                        msg.edit(`${e.Check} | Request autenticada | ${message.channel.id}`).catch(err => { })
                                        message.reply(`${e.Nagatoro} | Prontinho, agora eu não vou dizer mais nada quando alguém entrar no servidor.`)
                                    }, 4000)
                                })
                            } else {
                                db.delete(`User.Request.${message.author.id}`)
                                msg.edit(`${e.Deny} | Request abortada`)
                            }
                        }).catch(() => {
                            db.delete(`User.Request.${message.author.id}`)
                            msg.edit(`${e.Deny} | Request abortada | Tempo excedido`)
                        })
                })
            }

        } else if (channel.id === canal) {
            return message.reply(`${e.Info} | Este canal já foi definido como Welcome Channel!`)
        } else if (channel !== canal) {

            return message.reply(`${e.QuestionMark} | Deseja configurar "${channel}" como canal de boas-vindas?`).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { }) // e.Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.edit(`${e.Loading} | Autenticando... | .................`)
                            message.channel.sendTyping().then(() => {
                                setTimeout(function () {
                                    db.delete(`User.Request.${message.author.id}`)
                                    db.set(`Servers.${message.guild.id}.WelcomeChannel`, channel.id)
                                    msg.edit(`${e.Check} | Request autenticada | ${message.channel.id}`).catch(err => { })

                                    return message.channel.send(`Aeee ${e.NezukoJump}! De agora em diante, vou falar no canal ${channel} sobre todo mundo que chegar aqui.`).then(() => {

                                        if (LeaveChannel) return
                                        message.channel.sendTyping().then(() => {
                                            setTimeout(() => {
                                                message.channel.send(`${e.QuestionMark} | ${message.author}, posso ativar o sistema de saídas no "${channel}" também?`).then(msg => {
                                                    db.set(`User.Request.${message.author.id}`, 'ON')
                                                    msg.react('✅').catch(err => { }) // e.Check
                                                    msg.react('❌').catch(err => { }) // X

                                                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                                                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                                                        .then(collected => {
                                                            const reaction = collected.first()

                                                            if (reaction.emoji.name === '✅') {
                                                                msg.edit(`${e.Loading} |  Autenticando... | ................`)

                                                                message.channel.sendTyping().then(() => {
                                                                    setTimeout(function () {
                                                                        db.delete(`User.Request.${message.author.id}`)
                                                                        db.set(`Servers.${message.guild.id}.LeaveChannel`, channel.id)
                                                                        msg.edit(`${e.Check} | Autenticação aprovada | ${message.channel.id}`).catch(err => { })
                                                                        message.channel.send(`${e.NezukoJump} | Ok, ok! Pode deixar comigo. Vou avisar no canal ${channel} sobre todo mundo que entrar e sair. ${e.Menhera}`)
                                                                    }, 3100)
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
                                        }).catch(err => {
                                            db.delete(`User.Request.${message.author.id}`)
                                            return message.channel.send(`${e.Warn} | Houve um erro na execução deste comando.\n\`${err}\``)
                                        })
                                    })
                                }, 4000)
                            })
                        } else {
                            db.delete(`User.Request.${message.author.id}`)
                            msg.edit(`${e.Deny} | Request abortada`)
                        }
                    }).catch(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request abortada | Tempo excedido`)
                    })
            })
        }
    }
}