const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'leavechannel',
    aliases: ['setleave', 'setleavechannel'],
    category: 'config',
    UserPermissions: 'MANAGE_CHANNELS',
    ClientPermissions: ['SEND_MESSAGES', 'ADD_REACTIONS'],
    emoji: `${e.Loud}`,
    usage: '<leavechannel> [#channel] | [off]',
    description: 'Selecione um canal para eu avisar quem sai do servidor',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        let channel = message.mentions.channels.first() || message.channel

        let canal = db.get(`Servers.${message.guild.id}.LeaveChannel`)
        let WelcomeChannel = db.get(`Servers.${message.guild.id}.WelcomeChannel`)

        if (args[0] === 'off') {
            if (canal) {

                return message.reply(`${e.QuestionMark} | Você deseja desativar o sistema de saídas?`).then(msg => {
                    db.set(`Request.${message.author.id}`, `${msg.url}`)
                    msg.react('✅').catch(() => { }) // e.Check
                    msg.react('❌').catch(() => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first()

                            if (reaction.emoji.name === '✅') {
                                msg.edit(`${e.Loading} | Autenticando...`).catch(() => { })
                             
                                    setTimeout(function () {
                                        db.delete(`Request.${message.author.id}`)
                                        db.delete(`Servers.${message.guild.id}.LeaveChannel`)
                                        msg.edit(`${e.SaphireFeliz} | Prontinho, agora eu não vou dizer mais nada quando alguém sair no servidor.`).catch(() => { })
                                    }, 2000)
                            } else {
                                db.delete(`Request.${message.author.id}`)
                                msg.edit(`${e.Deny} | Request abortada.`).catch(() => { })
                            }
                        }).catch(() => { db.delete(`Request.${message.author.id}`); msg.edit(`${e.Deny} | Tempo expirada.`) })
                }).catch(err => {
                    Error(message, err)
                    message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
                })

            } else {
                return message.reply(`${e.Deny} | O Leave System já está desativado.`)
            }

        } else if (channel.id === canal) {
            return message.reply(`${e.Info} | Este canal já foi definido como Leave Channel!`)
        } else if (channel !== canal) {

            return message.reply(`${e.QuestionMark} | Deseja configurar "${channel}" como canal de saídas?`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(() => { }) // e.Check
                msg.react('❌').catch(() => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.edit(`${e.Loading} | Autenticando...`).catch(() => { })

                                setTimeout(function () {
                                    db.delete(`Request.${message.author.id}`)
                                    db.set(`Servers.${message.guild.id}.LeaveChannel`, channel.id)
                                    
                                    msg.edit(`Aeee ${e.NezukoJump}! De agora em diante, vou falar no canal ${channel} sobre todo mundo que sair do servidor.`).then(() => {

                                        if (WelcomeChannel) return
                                        try {
                                            setTimeout(() => {
                                                message.channel.send(`${e.QuestionMark} | Ei, ei ${message.author}! Posso ativar o sistema de boas-vindas no canal "${channel}" também?`).then(msg => {
                                                    db.set(`Request.${message.author.id}`, `${msg.url}`)
                                                    msg.react('✅').catch(() => { }) // e.Check
                                                    msg.react('❌').catch(() => { }) // X

                                                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                                                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                                                        .then(collected => {
                                                            const reaction = collected.first()

                                                            if (reaction.emoji.name === '✅') {
                                                                msg.reply(`${e.Loading} | Autenticando...`).then(x => {

                                                                        setTimeout(function () {
                                                                            db.delete(`Request.${message.author.id}`)
                                                                            db.set(`Servers.${message.guild.id}.WelcomeChannel`, channel.id)
                                                                            x.edit(`${e.Check} | Autenticação aprovada | ${message.channel.id}`).catch(() => { })
                                                                            message.channel.send(`${e.NezukoJump} | Nice, nice! Daqui pra frente, eu vou avisar no canal "${channel}" sobre todo mundo que entrar e sair do servidor.`)
                                                                        }, 3100)
                                                                })
                                                            } else {
                                                                db.delete(`Request.${message.author.id}`)
                                                                msg.edit(`${e.Deny} | Indicação abortada | ${client.user.id}`).catch(() => { })
                                                            }
                                                        }).catch(() => {
                                                            db.delete(`Request.${message.author.id}`)
                                                            msg.edit(`${e.Deny} | Indicação abortada | Tempo expirado`).catch(() => { })
                                                        })
                                                })
                                            }, 1900)
                                        } catch (err) {
                                            Error(message, err)
                                            return message.channel.send(`${e.Warn} | Houve um erro na execução deste comando.\n\`${err}\``)
                                        }
                                    }).catch(err => {
                                        Error(message, err)
                                        message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo de autenticação. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
                                    })
                                }, 4000)
                        } else {
                            db.delete(`Request.${message.author.id}`)
                            msg.edit(`${e.Deny} | Request abortada.`).catch(() => { })
                        }
                    }).catch(() => {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request abortada.`).catch(() => { })
                    })
            })
        }
    }
}