const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const { Util } = require('discord.js')
const { parse } = require("twemoji-parser")

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

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        let channel = message.mentions.channels.first() || message.channel

        let canal = db.get(`Servers.${message.guild.id}.WelcomeChannel.Canal`) || false
        let WelcomeMsg = db.get(`Servers.${message.guild.id}.WelcomeChannel.Mensagem`) || 'entrou no servidor.'
        let WelcomeEmoji = db.get(`Servers.${message.guild.id}.WelcomeChannel.Emoji`) || `${e.Join}`
        let LeaveChannel = db.get(`Servers.${message.guild.id}.LeaveChannel`) || false

        if (['off', 'desligar'].includes(args[0]?.toLowerCase())) return SetWelcomeOff()
        if (['mensagem', 'edit', 'msg'].includes(args[0]?.toLowerCase())) return MsgEdit()
        if (['reset', 'delete', 'padrão'].includes(args[0]?.toLowerCase())) return ResetWelcome()
        if (['emoji', 'emote'].includes(args[0]?.toLowerCase())) return Emoji()
        if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return Info()
        return Info()

        function Info() {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(`${e.Join} Sistema de Boas-vindas`)
                        .setDescription(`${e.Obs} Com este sistema eu aviso sobre todas as pessoas que entrarem no servidor. Mando uma mensagem simples(customizada) no canal definido.`)
                        .addFields(
                            {
                                name: `${e.On} Ative`,
                                value: `\`${prefix}welcomechannel [#channel]\` Escolhe um canal`
                            },
                            {
                                name: `${e.Off} Desative`,
                                value: `\`${prefix}welcomechannel off\``
                            },
                            {
                                name: `${e.Loli} Personalize a mensagem`,
                                value: `\`${prefix}welcomechannel mensagem <A sua mensagem de boas vindas>\``
                            },
                            {
                                name: `${e.Nagatoro} Escolhe o emoji`,
                                value: `\`${prefix}welcomechannel emoji <EMOJI>\``
                            },
                            {
                                name: `${e.HiNagatoro} Reset para o padrão`,
                                value: `\`${prefix}welcomechannel reset\``
                            },
                            {
                                name: `${e.Info} Informações`,
                                value: `\`${prefix}welcomechannel info\``
                            }
                        )
                ]
            })
        }

        function ResetWelcome() {
            if (!canal) return message.reply(`${e.Deny} | O sistema de boas-vindas deve estar ativado para usar esta função.`)
            let MensagemCustom = `${WelcomeEmoji} ${WelcomeMsg}`
            let MensagemPadrao = `${e.Join} 'entrou no servidor.'`
            if (MensagemCustom === MensagemPadrao) return message.reply(`${e.Info} | A mensagem de boas-vindas já é a padrão.`)

            db.delete(`Servers.${message.guild.id}.WelcomeChannel.Mensagem`)
            db.delete(`Servers.${message.guild.id}.WelcomeChannel.Emoji`)
            return message.reply(`${e.Check} | ${message.author} resetou a minha mensagem de boas-vindas com sucesso!`)
        }

        function MsgEdit() {
            if (!canal) return message.reply(`${e.Deny} | O sistema de boas-vindas deve estar ativado para usar esta função.`)

            let mensagem = args[1]
            if (!mensagem) return message.channel.send(`${e.Info} | Mensagem de boas-vindas padrão: **${WelcomeMsg}**\n${e.Obs} | Caso queira personalizar, use \`${prefix}welcome mensagem A mensagem de boas vindas\``)
            if (mensagem.length > 1400) return message.reply(`${e.Deny} | A mensagem de boas-vindas não pode ultrapassar **1400 caracteres**.`)

            db.set(`Servers.${message.guild.id}.WelcomeChannel.Mensagem`, mensagem)
            return message.channel.send(`${e.Check} | ${message.author} alterou a mensagem de boas-vindas para:\n${WelcomeEmoji} | <@${client.user.id}> ${db.get(`Servers.${message.guild.id}.WelcomeChannel.Mensagem`)}`)
        }

        function Emoji() {
            if (!canal) return message.reply(`${e.Deny} | O sistema de boas-vindas deve estar ativado para usar esta função.`)

            if (!args[1]) return message.reply(`${e.Info} | Tenta assim: \`${prefix}welcome emoji <EMOJI> (customizado pfo)\``)
            let emoji = Util.parseEmoji(args[1])
            if (args[2]) return message.reply(`${e.Deny} | Apenas o emoji, ok?`)

            if (emoji.id) {
                db.set(`Servers.${message.guild.id}.WelcomeChannel.Emoji`, args[1])
                return message.channel.send(`${e.Check} | ${message.author} alterou o emoji da mensagem de boas-vindas para:\n${args[1]} | <@${client.user.id}> ${WelcomeMsg}`)
            } else {
                message.reply(`${e.Deny} | Este emoji não é um emoji customizado.`)
            }
        }


        function SetWelcomeOff() {
            canal ? SetOff() : message.reply(`${e.Deny} | O Welcome System já está desativado.`)

            function SetOff() {
                message.reply(`${e.QuestionMark} | Você deseja desativar o Sistema de Boas-Vindas?`).then(msg => {
                    db.set(`Request.${message.author.id}`, `${msg.url}`)
                    msg.react('✅').catch(err => { }) // e.Check
                    msg.react('❌').catch(err => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first()

                            if (reaction.emoji.name === '✅') {
                                db.delete(`Request.${message.author.id}`)
                                msg.edit(`${e.Loading} | Autenticando...`).catch(err => { })
                                message.channel.sendTyping().then(() => {
                                    setTimeout(function () {
                                        db.delete(`Servers.${message.guild.id}.WelcomeChannel.Canal`)
                                        msg.edit(`${e.Nagatoro} | Prontinho, agora eu não vou dizer mais nada quando alguém entrar no servidor.`).catch(err => { })
                                    }, 4000)
                                })
                            } else {
                                db.delete(`Request.${message.author.id}`)
                                msg.edit(`${e.Deny} | Request abortada`).catch(err => { })
                            }
                        }).catch(() => {
                            db.delete(`Request.${message.author.id}`)
                            msg.edit(`${e.Deny} | Request abortada | Tempo excedido`).catch(err => { })
                        })
                })
            }
        }

        function SetWelcomeChannel() {
            if (channel.id === canal)
                return message.reply(`${e.Info} | Este canal já foi definido como Welcome Channel!`)

            if (channel !== canal) {

                return message.reply(`${e.QuestionMark} | Deseja configurar "${channel}" como canal de boas-vindas?`).then(msg => {
                    db.set(`Request.${message.author.id}`, `${msg.url}`)
                    msg.react('✅').catch(err => { }) // e.Check
                    msg.react('❌').catch(err => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first()

                            if (reaction.emoji.name === '✅') {
                                msg.edit(`${e.Loading} | Autenticando...`).catch(err => { })
                                message.channel.sendTyping().then(() => {
                                    setTimeout(function () {
                                        db.delete(`Request.${message.author.id}`)
                                        db.set(`Servers.${message.guild.id}.WelcomeChannel.Canal`, channel.id)

                                        return msg.edit(`Aeee ${e.NezukoJump}! De agora em diante, vou falar no canal ${channel} sobre todo mundo que chegar aqui.\nTenta usar o \`${prefix}welcomechannel info\``).then(() => {

                                            if (LeaveChannel) return
                                            message.channel.sendTyping().then(() => {
                                                setTimeout(() => {
                                                    message.channel.send(`${e.QuestionMark} | ${message.author}, posso ativar o sistema de saídas no "${channel}" também?`).then(msg => {
                                                        db.set(`Request.${message.author.id}`, `${msg.url}`)
                                                        msg.react('✅').catch(err => { }) // e.Check
                                                        msg.react('❌').catch(err => { }) // X

                                                        const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                                                        msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                                                            .then(collected => {
                                                                const reaction = collected.first()

                                                                if (reaction.emoji.name === '✅') {
                                                                    msg.edit(`${e.Loading} |  Autenticando... `).catch(err => { })

                                                                        setTimeout(function () {
                                                                            db.delete(`Request.${message.author.id}`)
                                                                            db.set(`Servers.${message.guild.id}.LeaveChannel`, channel.id)
                                                                            msg.edit(`${e.NezukoJump} | Ok, ok! Pode deixar comigo. Vou avisar no canal ${channel} sobre todo mundo que entrar e sair. ${e.Menhera}\nTenta usar o \`${prefix}welcomewelcomechannel info\``)
                                                                        }, 3100)
                                                                } else {
                                                                    db.delete(`Request.${message.author.id}`)
                                                                    msg.edit(`${e.Deny} | Indicação abortada | ${client.user.id}`).catch(err => { })
                                                                }
                                                            }).catch(() => {
                                                                db.delete(`Request.${message.author.id}`)
                                                                msg.edit(`${e.Deny} | Indicação abortada | Tempo expirado`).catch(err => { })
                                                            })
                                                    })
                                                }, 1900)
                                            }).catch(err => {
                                                db.delete(`Request.${message.author.id}`)
                                                return message.channel.send(`${e.Warn} | Houve um erro na execução deste comando.\n\`${err}\``)
                                            })
                                        })
                                    }, 4000)
                                })
                            } else {
                                db.delete(`Request.${message.author.id}`)
                                msg.edit(`${e.Deny} | Request abortada`).catch(err => { })
                            }
                        }).catch(() => {
                            db.delete(`Request.${message.author.id}`)
                            msg.edit(`${e.Deny} | Request abortada | Tempo excedido`).catch(err => { })
                        })
                })
            }
        }
    }
}