const { Permissions } = require('discord.js')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'setlogchannel',
    aliases: ['logs', 'setlogs', 'logchannel'],
    category: 'config',
    UserPermissions: 'MANAGE_GUILD',
    ClientPermissions: '',
    emoji: `${e.ModShield}`,
    usage: '[on] <#channel> | [off] <#channel>',
    description: 'Canal de Logs e histórico, como banimentos, kicks, etc..',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        if (!message.member.permissions.has(Permissions.FLAGS.ADD_REACTIONS)) { return message.reply('⚖️ | Permissão necessária: "Adicionar reações"') }
        if (!message.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) { return message.reply('⚖️ | Eu não tenho a permissão: "Ver o registro de auditoria"') }

        let channel = message.mentions.channels.first() || message.channel

        const SetLogHelpEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`${e.Info} Set Log Channel Info`)
            .setDescription('Você pode escolher um canal para eu enviar tudo o que acontece no servidor.')
            .addField('O que eu posso enviar no Sistema Log?', '`Banimentos` | `Kicks` | `Cargos Criados/Apagados/Atualizados` | `Mute/Warns/Etc`')
            .addField('O que eu não envio no Sistema Log?', `Novos Membros: \`${prefix}setwelcomechannel\`\nMembros que sairem: \`${prefix}setleavechannel\`\nMensagens Apagadas/Editadas > (Privacidade)`)
            .addField('Comandos', `\`${prefix}logs on/off <#channel>\``)
            .setFooter('Permissão necessária: "Ver o registro de auditoria | Adicionar reações"')

        if (!args[0]) { return message.reply({ embeds: [SetLogHelpEmbed] }) }

        const loading = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`${e.Loading} Autenticando "${channel}" como Canal do Sistema Logs...`)

        const cancel = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Comando cancelado por: ${message.author}`)

        const SucessEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${e.Check} Sistema de Logs Ativado!\nCanal: ${channel}`)

        if (['on', 'ligar', 'ativar'].includes(args[0].toLowerCase())) {

            const QuestionEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setDescription(`Você deseja ativar o Sistema Logs no canal: ${channel} ?`)

            return message.reply({ embeds: [QuestionEmbed] }).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { return }) // e.Check
                msg.react('❌').catch(err => { return }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.reactions.removeAll().catch(err => { return })
                            msg.edit({ embeds: [loading] })
                            setTimeout(function () {
                                db.delete(`User.Request.${message.author.id}`)
                                db.set(`Servers.${message.guild.id}.LogChannel`, channel.id)
                                msg.edit({ embeds: [SucessEmbed] })
                            }, 4000)
                        } else {
                            db.delete(`User.Request.${message.author.id}`)
                            msg.reactions.removeAll().catch(err => { return })
                            msg.edit({ embeds: [cancel] })
                        }
                    }).catch(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.reactions.removeAll().catch(err => { return })
                        msg.edit({ embeds: [cancel.setDescription('Comando cancelado por: Tempo Expirado.')] }).catch(err => { return })
                    })

            })

        } else if (['off', 'desligar', 'desativar'].includes(args[0].toLowerCase())) {

            const QuestionEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setDescription(`Você deseja desativar o Sistema Logs?`)

            return message.reply({ embeds: [QuestionEmbed] }).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { return }) // e.Check
                msg.react('❌').catch(err => { return }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.reactions.removeAll().catch(err => { return })
                            msg.edit({ embeds: [loading] })
                            setTimeout(function () {
                                db.delete(`User.Request.${message.author.id}`)
                                db.delete(`Servers.${message.guild.id}.LogChannel`)
                                SucessEmbed.setDescription(`${e.Check} Sistema de Logs Desativado!`)
                                msg.edit({ embeds: [SucessEmbed] })
                            }, 4000)
                        } else {
                            db.delete(`User.Request.${message.author.id}`)
                            msg.reactions.removeAll().catch(err => { return })
                            msg.edit({ embeds: [cancel] })
                        }
                    }).catch(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.reactions.removeAll().catch(err => { return })
                        msg.edit({ embeds: [cancel.setDescription('Comando cancelado por: Tempo Expirado.')] }).catch(err => { return })
                    })

            })
        } else {
            db.delete(`User.Request.${message.author.id}`)
            return message.reply(`Comando não reconhecido. Use \`${prefix}help setlogchannel\` ou \`${prefix}logs\`para obter mais informações.`)
        }
    }
}