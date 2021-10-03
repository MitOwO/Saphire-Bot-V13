const { Permissions } = require('discord.js')
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'setlogchannel',
    aliases: ['logs', 'setlogs', 'logchannel', 'log', 'gsn', 'notification'],
    category: 'config',
    UserPermissions: 'MANAGE_GUILD',
    ClientPermissions: '',
    emoji: `${e.ModShield}`,
    usage: '<logs> [on/off] <#channel>',
    description: 'Canal de referência para o sistema 🛰️ | **Global System Notification**',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        if (!message.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) { return message.reply('⚖️ | Eu não tenho a permissão: "Ver o registro de auditoria"') }
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) { return message.reply('⚖️ | Eu não tenho a permissão: "Gerenciar canais"') }

        let channel = message.mentions.channels.first() || message.channel
        let atual = db.get(`Servers.${message.guild.id}.LogChannel`)

        const SetLogHelpEmbed = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`🛰️ | Global System Notification`)
            .setDescription('Recentemente implementado, este sistema abrange todos os meus servidores em uma checagem continua, verificando se está tudo bem com todos os servidores. Quaisquer alteração que resulta na quebra de segurança do servidor, eu avisarei no canal pré-definido neste comando.')
            .addField(`${e.QuestionMark} O que é isso?`, `Este sistema é responsável por notificar as atividades do servidor em uma escala geral. Os dados fornecido de cada ação é processado pelo meu sistema e enviado de uma forma clara e objetiva ao canal pré-definido em uma forma de histórico de acontecimentos disponível ou não para todos do servidor perante o desejo da staff.`)
            .addField(`${e.QuestionMark} O que eu envio no Sistema GSN?`, `\`Banimentos/Kicks\` Relatarei os dados do banimento/expulsão. Mesmo que não tenha sido feito através dos meus comandos\n\`${prefix}ban / ${prefix}kick\`\n\`Mute/Warns\` Relatório e informações sob o ato também serão fornecidos\n\`Autorole System\` Qualquer quebra de segurança ou mudança brusca nos cargos e erros serão notificados\n\`Canais de Configurações\` Na exclusão de canais com configurações minhas ativadas, também será notificado.`)
            .addField(`${e.QuestionMark} O que eu não envio no Sistema GSN?`, `\`${prefix}welcomechannel\` - Novos Membros\n\`${prefix}leavechannel\`- Membros que sairem \nMensagens Apagadas/Editadas\nCargos/Canais editados`)
            .addField('Comandos', `\`${prefix}logs on/off <#channel>\` Ative/Desative o Sistema GSN\n\`${prefix}logs create\` Deixa que eu crio um canal pro Sistema GSN`)
            .setFooter('Permissão necessária: "Ver o registro de auditoria | Adicionar reações | Gerenciar Canais"')

        if (!args[0]) return message.reply({ embeds: [SetLogHelpEmbed] })
        if (['on', 'ligar', 'ativar'].includes(args[0]?.toLowerCase())) return LogsON()
        if (['off', 'desligar', 'desativar'].includes(args[0]?.toLowerCase())) return LogsOff()
        if (['create', 'criar', 'novo'].includes(args[0]?.toLowerCase())) return LogsCreate()

        return message.reply(`Comando não reconhecido. Use \`${prefix}help gsn\` ou \`${prefix}gsn\` para obter mais informações.`)

        function LogsOff() {
            if (!atual) return message.reply(`${e.Info} | O Sistema GSN não está ativado.`)

            return message.reply(`${e.QuestionMark} | Você deseja desativar o Sistema GSN?\nCanal atual: <#${atual}> ?`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(err => { }) // e.Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.reactions.removeAll().catch(err => { })
                            msg.edit(`${e.Loading} | Autenticando request...`).catch(err => { })
                            setTimeout(function () {
                                db.delete(`Request.${message.author.id}`)
                                db.delete(`Servers.${message.guild.id}.LogChannel`)
                                msg.edit(`${e.Check} | Sistema GSN Desativado!`).catch(err => { })
                            }, 4000)
                        } else {
                            db.delete(`Request.${message.author.id}`)
                            msg.reactions.removeAll().catch(err => { })
                            msg.edit(`Comando cancelado por: ${message.author}`).catch(err => { })
                        }
                    }).catch(() => {
                        db.delete(`Request.${message.author.id}`)
                        msg.reactions.removeAll().catch(err => { })
                        msg.edit(`${e.Deny} | Comando cancelado por: Tempo Expirado.`).catch(err => { })
                    })
            })
        }

        function LogsON() {

            if (channel.id === atual) return message.reply(`${e.Info} | Este já é o canal do Sistema GSN atual.`)
            atual ? atual = `<#${atual}>` : atual = "Nenhum canal definido"

            return message.reply(`${e.QuestionMark} | Você deseja ativar o Sistema GSN no canal: ${channel} ?\nCanal atual: ${atual}`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(err => { }) // e.Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            msg.reactions.removeAll().catch(err => { })
                            msg.edit(`${e.Loading} | Autenticando "${channel}" como Canal do Sistema GSN...`).catch(err => { })
                            setTimeout(function () {
                                db.delete(`Request.${message.author.id}`)
                                db.set(`Servers.${message.guild.id}.LogChannel`, channel.id)
                                msg.edit(`${e.Check} | Sistema GSN Ativado!\nCanal: ${channel}`).catch(err => { })
                            }, 4000)
                        } else {
                            db.delete(`Request.${message.author.id}`)
                            msg.reactions.removeAll().catch(err => { })
                            msg.edit(`Comando cancelado por: ${message.author}`).catch(err => { })
                        }
                    }).catch(() => {
                        db.delete(`Request.${message.author.id}`)
                        msg.reactions.removeAll().catch(err => { })
                        msg.edit(`${e.Deny} | Comando cancelado por: Tempo Expirado.`).catch(err => { })
                    })
            })
        }

        function LogsCreate() {

            if (atual) return message.reply(`${e.Info} | O canal atual do Sistema GSN é esse aqui: <#${atual}>`)

            return message.reply(`${e.QuestionMark} | Você permite que eu crie um canal novo e ative o Sistema GSN?`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(err => { }) // Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        db.delete(`Request.${message.author.id}`)

                        message.guild.channels.create('log-channel', {
                            type: 'GUILD_TEXT',
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: [Permissions.FLAGS.SEND_MESSAGES],
                                },
                            ],
                        }).then(channel => {
                            db.set(`Servers.${message.guild.id}.LogChannel`, channel.id)
                            channel.send(`🛰️ | **Global System Notification**\n \nO Sistema GSN foi ativado com sucesso.\nRegistro concluído para o servidor: **${message.guild.name}** | *\`${message.guild.id}\`*\nNotificações ativadas: \`General Moderation\` \`Autorole System\` \`Security System\` \`Malicious Users\` \`Anti-Raid\``)
                            channel.send(`${e.Check} | ${message.author}, canal criado com sucesso!\nQuer testar o novo sistema? Vou dar uma dica:\n1. Crie um novo cargo e o configure como autorole \`${prefix}autorole 1 @novo cargo\`\n2. Delete o novo cargo e veja o que acontece.`)
                        }).catch(err => { message.reply(`${e.Deny} | Ocorreu um erro ao criar o novo canal.\n\`${err}\``) })
                    } else {
                        db.delete(`Request.${message.author.id}`)
                        msg.edit(`${e.Deny} | Request cancelada | ${message.author.id}/${messge.guild.id}`).catch(err => { })
                    }
                }).catch(() => {
                    db.delete(`Request.${message.author.id}`)
                    msg.edit(`${e.Deny} | Request cancelada: Tempo expirado`).catch(err => { })
                })

            })
        }
    }
}