const { e } = require("../../../Routes/emojis.json")
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'ideiachannel',
    aliases: ['setideiachannel', 'canaldeideias'],
    category: 'config',
    UserPermissions: 'MANAGE_GUILD',
    ClientPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'],
    emoji: `${e.ModShield}`,
    usage: '<ideichannel> [#channel]',
    description: 'Selecione um canal para envio de ideias',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        if (['desligar', 'off'].includes(args[0])) {

            let canal = db.get(`Servers.${message.guild.id}.IdeiaChannel`)
            if (!canal) return message.reply(`${e.Deny} | O sistema de ideias já está desativado`)
            
            await message.guild.channels.fetch(canal).then(channel => {

                return message.channel.send(`${e.QuestionMark} | Deseja desativar o sistema de ideias? Canal atual: ${channel}`).then(msg => {
                    db.set(`User.Request.${message.author.id}`, 'ON')
                    msg.react('✅').catch(err => { }) // e.Check
                    msg.react('❌').catch(err => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.edit(`${e.Loading} | Espera só um pouquinho...`)

                            message.channel.sendTyping().then(() => {
                                setTimeout(function () {
                                    db.delete(`User.Request.${message.author.id}`)
                                    db.delete(`Servers.${message.guild.id}.IdeiaChannel`)
                                    msg.edit(`${e.Check} | Request autenticada | ${channel.id}|${message.guild.id}`).catch(err => { })
                                    return message.channel.send(`${e.Nagatoro} | Prontinho, sistema de ideias desativado.`)
                                }, 5000)
                            }).catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro na execução do comando. Caso não saiba resolver, use o comando \`${prefix}bug\` e reporte o seu problema.`) })
                        } else {
                            db.delete(`User.Request.${message.author.id}`)
                            return message.channel.send(`${e.Deny} | Request cancelada.`)
                        }
                    }).catch(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request cancelada: Tempo expirado.`)
                    })
                })
            }).catch(() => {
                db.delete(`User.Request.${message.author.id}`)
                return message.reply(`${e.Deny} | O sistema de ideias já está desativado`)
            })

        } else {

            let channel = message.mentions.channels.first() || message.channel
            let atual = db.get(`Servers.${message.guild.id}.IdeiaChannel`)

            if (channel.id === atual) {
                return message.reply(`${e.Info} | Este já é o canal de ideias atual`)
            } else {

                return message.reply(`${e.QuestionMark} | Deseja autenticar o canal ${channel} como canal de ideias?`).then(msg => {
                    db.set(`User.Request.${message.author.id}`, 'ON')
                    msg.react('✅').catch(err => { }) // e.Check
                    msg.react('❌').catch(err => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.edit(`${e.Loading} | Espera aí, ok? Estou arrumando umas caixas no meu banco de dados...`)

                            message.channel.sendTyping().then(() => {
                                setTimeout(function () {
                                    db.delete(`User.Request.${message.author.id}`)
                                    db.set(`Servers.${message.guild.id}.IdeiaChannel`, channel.id)
                                    msg.edit(`${e.Check} | Request autenticada | ${channel.id}|${message.guild.id}`).catch(err => { })
                                    return message.channel.send(`${e.NezukoJump} | Prontinho, sistema de ideias ativado.\nO comando é simples --> \`${prefix}ideia a sua ideia em diante\``)
                                }, 6000)
                            }).catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro na execução do comando. Caso não saiba resolver, use o comando \`${prefix}bug\` e reporte o seu problema.`) })
                        } else {
                            db.delete(`User.Request.${message.author.id}`)
                            return message.channel.send(`${e.Deny} | Request cancelada.`)
                        }
                    }).catch(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request cancelada: Tempo expirado.`)
                    })
                })
            }
        }
    }
}