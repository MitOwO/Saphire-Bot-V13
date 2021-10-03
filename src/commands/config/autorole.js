const { Permissions } = require('discord.js')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'autorole',
    aliases: ['autorolestats'],
    category: 'config',
    UserPermissions: 'MANAGE_ROLES',
    ClientPermissions: 'MANAGE_ROLES',
    emoji: `${e.Verify}`,
    usage: '<autorole> <1/2> <role> | <status> | <1/2> <off>',
    description: 'Selecione um cargo para todos que entrem no servidor.',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let role = message.mentions.roles.first()
        let Autorole1 = db.get(`Servers.${message.guild.id}.Autorole1`)
        let Autorole2 = db.get(`Servers.${message.guild.id}.Autorole2`)

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        const AutoroleArgs0 = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`${e.Verify} Autorole System`)
            .setDescription(`O Sistema ${client.user.username} garante 2 autoroles simuntâneas.`)
            .addField(`${e.QuestionMark} **O que é Autorole?**`, `Autorole é um sistema automático em que todo membro que entrar no servidor, receberá um cargo (dado por mim) pré definido pela staff do servidor.`)
            .addField(`${e.Warn} ATENÇÃO`, `\n1. Para perfeito funcionamento, o meu cargo **DEVE** estar **ACIMA** dos cargos definidos.\n \n2. Não é permito cargos com a permissão **ADMINISTRADOR, KICK/BAN, GERENCIAMENTOS** ativada. Caso ative pós configuração, o cargo será deletado da configuração autorole na entrada de um novo membro.\n \n3. Cargos em que eu não tenho poder de manusea-los, também serão ignorados.`)
            .addField('• Comandos do Autorole', `\`${prefix}autorole 1 @cargo\`\n\`${prefix}autorole 2 @cargo\`\n\`${prefix}autorole Status\``, true)
            .addField('• Comando de desativação', `\`${prefix}autorole 1/2 off\`\n\`${prefix}autorole off\``, true)
            .addField(`${e.SaphireObs} Forte recomendação`, `Ative a função \`${prefix}logs\`.\nLá eu mandarei relatórios se qualquer coisa der errado ou algum bobinho(a) fizer besteira com os cargos.`)
            .setFooter(`${prefix}sugest | ${prefix}bug | ${prefix}logs`)

        if (!args[0]) return message.reply({ embeds: [AutoroleArgs0] })

        if (['status', 'stats', 'info'].includes(args[0]?.toLowerCase())) {
            const AutoroleEmbed = new MessageEmbed().setColor('#246FE0').setTitle(':satellite: | Autorole System Status')
            if (!Autorole2 && Autorole1) { AutoroleEmbed.setDescription(`Autorole 1: <@&${Autorole1}>\nAutorole 2: Desativado`) }
            if (!Autorole1 && Autorole2) { AutoroleEmbed.setDescription(`Autorole 1: Desativado\nAutorole 2: <@&${Autorole2}>`) }
            if (!Autorole1 && !Autorole2) { AutoroleEmbed.setDescription(`Autorole 1: Desativado\nAutorole 2: Desativado`) }
            if (Autorole1 && Autorole2) { AutoroleEmbed.setDescription(`Autorole 1: <@&${Autorole1}>\nAutorole 2: <@&${Autorole2}>`) }
            setTimeout(() => { message.reply({ embeds: [AutoroleEmbed] }) }, 1000)
            return
        }

        if (['off', 'desligar', 'desativar'].includes(args[0]?.toLowerCase())) {

            let autorole = db.get(`Servers.${message.guild.id}.Autorole1`) || db.get(`Servers.${message.guild.id}.Autorole2`)
            if (autorole === null || autorole === undefined) { return message.reply(`${e.Info} | O Autorole System já está desativado.`) }

            let AutoroleUm = db.get(`Servers.${message.guild.id}.Autorole1`)
            if (AutoroleUm) AutoroleUm = `<@&${db.get(`Servers.${message.guild.id}.Autorole1`)}>`
            if (!AutoroleUm) AutoroleUm = 'Desativado'

            let AutoroleDois = db.get(`Servers.${message.guild.id}.Autorole2`)
            if (AutoroleDois) AutoroleDois = `<@&${db.get(`Servers.${message.guild.id}.Autorole2`)}>`
            if (!AutoroleDois) AutoroleDois = 'Desativado'

            return message.reply(`${e.QuestionMark} | Você deseja desativar o sistema de autorole?\nAutorole 1: ${AutoroleUm}\nAutorole 2: ${AutoroleDois}`).then(msg => {
                msg.react('✅').catch(err => { }) // e.Check
                msg.react('❌').catch(err => { }) // X
                db.set(`Request.${message.author.id}`, `${msg.url}`)

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {

                        msg.edit(`${e.Loading} | Autenticando...`).catch(err => { })
                        message.channel.sendTyping().then(() => {
                            setTimeout(function () {
                                db.delete(`Servers.${message.guild.id}.Autorole1`)
                                db.delete(`Servers.${message.guild.id}.Autorole2`)
                                db.delete(`Request.${message.author.id}`)
                                msg.edit(`${e.Check} | Request autenticada | ${message.guild.id}`).catch(err => { })
                                return message.reply(`${e.Menhera} | Prontinho! Eu desativei o Autorole System.`)
                            }, 2400)
                        }).catch(err => {
                            Error(message, err)
                            db.delete(`Request.${message.author.id}`)
                            return message.reply(`${e.Warn} | Houve um erro ao executar este comando\n\`${err}\``)
                        })

                    } else {
                        msg.edit(`${e.Deny} | Request Cancelada`).catch(err => { })
                        db.delete(`Request.${message.author.id}`)
                    }
                }).catch(() => {
                    msg.edit(`${e.Deny} | Request Cancelada: Tempo expirado`).catch(err => { })
                    db.delete(`Request.${message.author.id}`)
                })
            }).catch(err => {
                Error(message, err)
                db.delete(`Request.${message.author.id}`)
                return message.reply(`${e.Warn} | Houve um erro ao executar este comando\n\`${err}\``)
            })
        }

        if (args[0] === '1') {

            if (['off', 'desligar', 'desativar'].includes(args[1])) {

                if (!Autorole1) return message.reply(`${e.Deny} O Autorole 1 já está desativado.`)

                if (Autorole1 === Autorole1) {

                    return message.reply(`${e.QuestionMark} | Você deseja desativar o Autorole 1? --> <@&${Autorole1}>`).then(msg => {
                        msg.react('✅').catch(err => { }) // e.Check
                        msg.react('❌').catch(err => { }) // X
                        db.set(`Request.${message.author.id}`, `${msg.url}`)

                        const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                        msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                            const reaction = collected.first()

                            if (reaction.emoji.name === '✅') {
                                msg.edit(`${e.Loading} | Autenticando...`).catch(err => { })
                                message.channel.sendTyping().then(() => {
                                    setTimeout(function () {
                                        db.delete(`Servers.${message.guild.id}.Autorole1`)
                                        db.delete(`Request.${message.author.id}`)
                                        msg.edit(`${e.Check} | Request autenticada | ${message.guild.id}`).catch(err => { })
                                        return message.reply(`${e.SadPanda} | Adeeeus cargo... Foi bom enquanto durou.`)
                                    }, 2400)
                                }).catch(err => {
                                    db.delete(`Request.${message.author.id}`)
                                    message.reply(`${e.Warn} | Houve um erro ao executar este comando\n\`${err}\``)
                                })
                            } else {
                                msg.edit(`${e.Deny} | Request Cancelada`).catch(err => { })
                                db.delete(`Request.${message.author.id}`)
                            }

                        }).catch(err => {
                            msg.edit(`${e.Deny} | Request Cancelada: Tempo expirado`).catch(err => { })
                            db.delete(`Request.${message.author.id}`)
                        })
                    }).catch(err => {
                        Error(message, err)
                        db.delete(`Request.${message.author.id}`)
                        message.reply(`${e.Warn} | Houve um erro ao executar este comando\n\`${err}\``)
                    })
                } else {
                    return message.reply(`${e.Deny} O Autorole 1 já está desativado.`)
                }
            }

            if (args[1] === '@everyone') { return message.reply(`${e.Hmmm}`).then(() => { message.channel.sendTyping().then(() => { setTimeout(() => { message.channel.send(`Eu não vou nem comentar sob tal atrocidade.`).catch(err => { }) }, 1900) }) }).catch(err => { return message.reply(`${e.Warn} | Houve um erro ao executar este comando\n\`${err}\``) }) }
            if (args[1] === '@here') { return message.reply(`${e.Hmmm}`).then(() => { message.channel.sendTyping().then(() => { setTimeout(() => { message.channel.send(`Está de brincation with me?`).catch(err => { }) }, 1900) }) }) }
            if (!role) { return message.reply(`${e.Deny} | Mencione um cargo que deseja como Autorole 1.`) }
            if (role.botRole) { return message.reply(`${e.Deny} | Sério que você quer configurar um cargo de bot como autorole? ${e.SaphireWhat}`) }
            if (!role.editable) { return message.reply(`${e.Deny} | Eu não tenho permissão para gerenciar o cargo selecionado.`) }
            if (role.id === Autorole1) { return message.reply(`${e.Deny} | O cargo mencionado é o mesmo do Autorole 1.`) }
            if (role.id === Autorole2) { return message.reply(`${e.Deny} | O cargo mencionado é o mesmo do Autorole 2.`) }
            if (message.author.id !== message.guild.ownerId) { if (role.comparePositionTo(message.member.roles.highest) > -1) { return message.reply(`${e.Deny} | Você não tem permissão para gerenciar o cargo ${role}.`) } }
            if (role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) { return message.reply(`${e.Deny} | Você não pode configurar um cargo com permissão de "ADMINISTRADOR" ativada como Autorole.`) }

            return message.reply(`${e.QuestionMark} | Você deseja configurar o cargo "${role}" como Autorole 1?`).then(msg => {
                msg.react('✅').catch(err => { }) // e.Check
                msg.react('❌').catch(err => { }) // X
                db.set(`Request.${message.author.id}`, `${msg.url}`)

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {

                        msg.edit(`${e.Loading} | Autenticando...`).catch(err => { })
                        message.channel.sendTyping().then(() => {
                            setTimeout(function () {
                                db.set(`Servers.${message.guild.id}.Autorole1`, role.id)
                                db.delete(`Request.${message.author.id}`)
                                msg.edit(`${e.Check} | Request autenticada | ${message.guild.id}/${role.id}`).catch(err => { })
                                return message.reply(`${e.CatJump} | Deixa comigo! Eu darei o cargo ${role} para todos os novos integrantes daqui pra frente.`)
                            }, 2400)
                        })

                    } else {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request Cancelada`).catch(err => { })
                    }
                }).catch(() => {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Request Cancelada: Tempo expirado`).catch(err => { })
                })
            })
        }

        if (args[0] === '2') {

            if (['off', 'desligar', 'desativar'].includes(args[1])) {

                if (!Autorole2) return message.reply(`${e.Deny} O Autorole 2 já está desativado.`)

                if (Autorole2 === Autorole2) {

                    return message.reply(`${e.QuestionMark} | Você deseja desativar o Autorole 2? --> <@&${Autorole2}>`).then(msg => {
                        msg.react('✅').catch(err => { }) // e.Check
                        msg.react('❌').catch(err => { }) // X
                        db.set(`Request.${message.author.id}`, `${msg.url}`)

                        const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                        msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                            const reaction = collected.first()

                            if (reaction.emoji.name === '✅') {
                                msg.edit(`${e.Loading} | Autenticando...`).catch(err => { })
                                message.channel.sendTyping().then(() => {
                                    setTimeout(function () {
                                        db.delete(`Request.${message.author.id}`)
                                        db.delete(`Servers.${message.guild.id}.Autorole2`)
                                        msg.edit(`${e.Check} | Request autenticada | ${message.guild.id}`)
                                        return message.reply(`${e.SadPanda} | Adeeeus carguinho... Vou sentir saudades.`)
                                    }, 2400)
                                })
                            } else {
                                db.delete(`Request.${message.author.id}`)
                                msg.edit(`${e.Deny} | Request Cancelada`).catch(err => { })
                            }

                        }).catch(err => {
                            db.delete(`Request.${message.author.id}`)
                            msg.edit(`${e.Deny} | Request Cancelada: Tempo expirado`).catch(err => { })
                        })
                    })

                } else {
                    return message.reply(`${e.Deny} O Autorole 2 já está desativado.`)
                }
            }

            if (args[1] === '@everyone') { return message.reply(`${e.Hmmm}`).then(() => { message.channel.sendTyping().then(() => { setTimeout(() => { message.channel.send(`Eu não vou nem comentar sob tal atrocidade.`) }, 1900) }) }).catch(err => { }) }
            if (args[1] === '@here') { return message.reply(`${e.Hmmm}`).then(() => { message.channel.sendTyping().then(() => { setTimeout(() => { message.channel.send(`Está de brincation with me?`) }, 1900) }) }).catch(err => { }) }
            if (!role) { return message.reply(`${e.Deny} | Mencione um cargo que deseja como Autorole 2.`) }
            if (role.botRole) { return message.reply(`${e.Deny} | Sério que você quer configurar um cargo de bot como autorole? ${e.SaphireWhat}`) }
            if (!role.editable) { return message.reply(`${e.Deny} | Eu não tenho permissão para gerenciar o cargo selecionado.`) }
            if (role.id === Autorole1) { return message.reply(`${e.Deny} | O cargo mencionado é o mesmo do Autorole 1.`) }
            if (role.id === Autorole2) { return message.reply(`${e.Deny} | O cargo mencionado já é o Autorole 2.`) }
            if (message.author.id !== message.guild.ownerId) { if (role.comparePositionTo(message.member.roles.highest) > -1) { return message.reply(`${e.Deny} | Você não tem permissão para gerenciar o cargo ${role}.`) } }
            if (role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) { return message.reply(`${e.Deny} | Você não pode configurar um cargo com permissão de "ADMINISTRADOR" ativada como Autorole.`) }

            return message.reply(`${e.QuestionMark} | Você deseja configurar o cargo "${role}" como Autorole 2?`).then(msg => {
                msg.react('✅').catch(err => { }) // e.Check
                msg.react('❌').catch(err => { }) // X
                db.set(`Request.${message.author.id}`, `${msg.url}`)

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {

                        msg.edit(`${e.Loading} | Autenticando...`).catch(err => { })
                        message.channel.sendTyping().then(() => {
                            setTimeout(function () {
                                db.set(`Servers.${message.guild.id}.Autorole2`, role.id)
                                db.delete(`Request.${message.author.id}`)
                                msg.edit(`${e.Check} | Request autenticada | ${message.guild.id}/${role.id}`)
                                return message.reply(`${e.NezukoJump} | Deixa comigo! Eu darei o cargo ${role} para todos os novos integrantes daqui pra frente.`)
                            }, 2400)
                        }).catch(err => {
                            Error(message, err)
                            db.delete(`Request.${message.author.id}`)
                            return message.reply(`${e.Warn} | Houve um erro ao executar este comando\n\`${err}\``)
                        })

                    } else {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request Cancelada`).catch(err => { })
                    }
                }).catch(() => {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Request Cancelada: Tempo expirado`).catch(err => { })
                })
            }).catch(err => {
                Error(message, err)
                db.delete(`Request.${message.author.id}`)
                return message.reply(`${e.Warn} | Houve um erro ao executar este comando\n\`${err}\``)
            })
        } else {
            return message.reply(`${e.Deny} | Você está nas profundezas do código do autorole. Use \`${prefix}help autorole\` ou apenas \`${prefix}autorole\` que eu te mando todos os comandos do sistema.`)
        }
    }
}