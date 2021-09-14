const { Permissions } = require('discord.js')
const { f } = require('../../../Routes/frases.json')
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'prefix',
    aliases: ['setprefix'],
    category: 'moderation',
    UserPermissions: 'MANAGE_GUILD',
    ClientPermissions: ['ADD_REACTIONS, MANAGE_MESSAGES'],
    emoji: `${e.ModShield}`,
    usage: '<NovoPrefix> | <reset>',
    description: 'Altere o prefixo ou reset para o padrão.',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        const cancel = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${e.Check} | Comando cancelado por: ${message.author}`)

        const prefixembed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`${e.Info} Informações sobre Prefixo`)
            .setDescription('Prefixo é o simbolo que você utiliza para executar comandos em bots no Discord.\nExemplo: `' + prefix + 'prefix` ou `' + prefix + 'help`')
            .addFields(
                {
                    name: '💡 Meus comandos de Prefix',
                    value: '`' + prefix + 'prefix [NovoPrefixo]` Escolha meu novo prefixo\n`' + prefix + 'prefix reset` Resete meu prefixo para `-`'
                }
            )

        if (!args[0]) { return message.reply({ embeds: [prefixembed] }) }
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) { return message.reply(`${e.Info} | Permissão necessária: "Administrador"`) }

        if (['reset', 'resetar', 'delete', 'deletar'].includes(args[0].toLowerCase())) {


            if (prefix === "-") { return message.reply(`${e.Info} | O prefixo atual é o meu padrão: \`-\``) }

            return message.reply(`${e.QuestionMark} | Você deseja resetar meu prefix para \`-\`?`).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { return }) // e.Check
                msg.react('❌').catch(err => { return }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.delete().catch(err => { return })
                            message.channel.sendTyping().then(() => {
                                setTimeout(function () {
                                    db.delete(`User.Request.${message.author.id}`)
                                    db.delete(`Servers.${message.guild.id}.Prefix`)
                                    message.reply(`${e.Check} | ${message.author.username} resetou meu prefixo para \`-\``)
                                }, 4000)
                            })
                        } else {
                            db.delete(`User.Request.${message.author.id}`)
                            msg.edit(`${e.NezukoDance} | Comando cancelado.`)
                            msg.reactions.removeAll().catch(err => { return })
                        }
                    }).catch(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit('⏱️ | Comando cancelado por: Tempo Expirado.')
                        msg.reactions.removeAll().catch(err => { return })
                    })
            })
        }

        if (args[0].length > 2) { return message.reply(`${e.Itachi} | O prefixo não pode ter mais de 2 caracteres.`) }
        if (!isNaN(args[0])) { return message.reply(`${e.Hmmm} | O prefixo não pode ser um número.`) }
        if (args[1]) { return message.reply(`${e.Info} |O prefixo não pode ter espaços.`) }

        if (args[0]) {

            const alterado = new MessageEmbed().setColor('GREEN').setDescription(`${e.Check} | O prefixo foi alterado com sucesso!`)
            const newprefix = new MessageEmbed().setColor('BLUE').setTitle(`${e.QuestionMark} | Deseja alterar meu prefixo para: \`${args[0]}\` ?`)

            return message.reply({ embeds: [newprefix] }).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { return }) // e.Check
                msg.react('❌').catch(err => { return }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        msg.reactions.removeAll().catch(err => { return })

                        if (args[0] === "-") {
                            const PrefixPadrao = new MessageEmbed().setColor('BLUE').setDescription(`${e.Loading} | Este é o meu prefixo padrão... Resetando prefixo deste servidor...`)
                            const Done = new MessageEmbed().setColor('GREEN').setDescription(`${e.Check} | ${message.author}, o prefixo foi resetado. Prefixo atual: \`-\``)

                            msg.edit({ embeds: [PrefixPadrao] })
                            message.channel.sendTyping().then(() => {
                                setTimeout(function () {
                                    db.delete(`User.Request.${message.author.id}`)
                                    db.delete(`Servers.${message.guild.id}.Prefix`)
                                    msg.delete().catch(err => { return })
                                    message.reply({ embeds: [Done] }).catch(err => { return })
                                }, 3000)
                            }).catch(err => {
                                db.delete(`User.Request.${message.author.id}`)
                                return message.reply(`${e.Attention} | Houve algúm erro na execução teste comando. Caso não saiba resolver, use o comando \`${prefix}bug\` e reporte o problema. Ou, entre no meu servidor atráves do link em meu perfil.\n\`${err}\``)
                            })
                        } else {
                            newprefix.setColor('GREEN').setTitle(`${e.Check} | Alteração aprovada`).setDescription(`${e.Loading} | Autenticando prefixo no banco de dados...`)
                            msg.edit({ embeds: [newprefix] })
                            message.channel.sendTyping().then(() => {
                                setTimeout(function () {
                                    db.delete(`User.Request.${message.author.id}`)
                                    msg.edit({ embeds: [alterado] }).catch(err => { return })
                                    db.set(`Servers.${message.guild.id}.Prefix`, args[0])
                                }, 3000)
                            }).catch(err => {
                                db.delete(`User.Request.${message.author.id}`)
                                return message.reply(`${e.Attention} | Houve algúm erro na execução teste comando. Caso não saiba resolver, use o comando \`${prefix}bug\` e reporte o problema. Ou, entre no meu servidor atráves do link em meu perfil.\n\`${err}\``)
                            })
                            setTimeout(() => {
                                db.delete(`User.Request.${message.author.id}`)
                                message.reply(`Prefixo \`${args[0]}\` novinho em folha! Só não esquece, ok? ${e.Nagatoro}`)
                            }, 3100)
                        }
                    } else {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.reactions.removeAll().catch(err => { return })
                        msg.edit({ embeds: [cancel] }).catch(err => { return })
                    }
                }).catch(() => {
                    db.delete(`User.Request.${message.author.id}`)
                    msg.edit({ embeds: [cancel.setDescription('⏱️ | Comando cancelado por: Tempo Expirado.')] }).catch(err => { return })
                })
            })
        }
    }
}