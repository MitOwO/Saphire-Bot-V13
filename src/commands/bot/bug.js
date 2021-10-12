const { config } = require('../../../Routes/config.json')
const { e } = require('../../../Routes/emojis.json')
const { N } = require('../../../Routes/nomes.json')
const ms = require('parse-ms')
const Error = require('../../../Routes/functions/errors')

module.exports = {
    name: 'bug',
    aliases: ['sendbug', 'reportbug'],
    category: 'bot',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '📨',
    usage: '<bug> <Report um bug>',
    description: 'Report bugs/erros diretamente pro meu criador',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let block = db.get(`Client.BlockUsers.${message.author.id}`)
        if (block) return message.reply(`${e.Deny} | Você está bloqueado e perdeu acesso aos seguintes comandos: \`${prefix}bug\` \`${prefix}sendcantada\` \`${prefix}ideiasaphire\` \`${prefix}gif\``)

        const ChannelId = config.BugsChannelId

        const noargs = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`${e.Gear} Reporte bugs/erros`)
            .setDescription('Com este comando, você reporta bugs/erros direto pro meu criador. Assim tudo é resolvido de maneira rápida! *(Links são permitidos)*')
            .addField('Comando exemplo', `\`${prefix}bug Quando eu uso "comando x" tal bug acontece\``)
            .setFooter('Quaisquer abuso deste comando não será tolerado.')

        if (!args[0]) { return message.reply({ embeds: [noargs] }) }

        let timeout = 900000
        let author = db.get(`${message.author.id}.Timeouts.Bug`)

        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author))

            return message.reply(`⏱️ | Global Cooldown | \`${time.hours}h ${time.minutes}m e ${time.seconds}s\``).catch(() => { })
        } else {

            let mensagem = args.join(" ")
            if (mensagem === 'Quando eu uso "comando x" tal bug acontece') return message.reply(`${e.Nagatoro} | Está mensagem claramente não é permitida, né?`)
            if (mensagem.length < 10 || mensagem.length > 1000) { return message.reply(`${e.Deny} | Por favor, relate o bug dentro de **10~1000 caracteres.**`) }

            let CanalDeConvite = await message.channel

            function WithChannel() {
                db.set(`${message.author.id}.Timeouts.Bug`, Date.now())
                CanalDeConvite.createInvite({ maxAge: 0 }).then(ChannelInvite => {
                    const ReportBugEmbed = new MessageEmbed().setColor('RED').setTitle('📢 Report de Bug/Erro Recebido').addField('Enviado por', `${message.author.tag} (*\`${message.author.id}\`*)`, true).addField('Servidor', `[${message.guild.name}](${ChannelInvite.url}) (*${message.guild.id}*)`).addField('Relatório', mensagem)
                    if (!ChannelId) { return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`) } else {
                        const channel = client.channels.cache.get(ChannelId); if (!channel) { return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`) } else {
                            channel.send({ embeds: [ReportBugEmbed] }).then(() => {
                                    setTimeout(() => { message.reply(`${e.Check} | Seu reporte foi enviado com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)
                            }).catch(err => {
                                Error(message, err)
                                return message.reply(`${e.Deny} | Ocorreu um erro no envio da mensagem... Contacte meu criador, por favor. --> ${N.Rody} <--\n\`${err}\``)
                            })
                        }
                    }
                }).catch(() => {
                    Error(message, err)
                    db.set(`${message.author.id}.Timeouts.Bug`, Date.now())
                    const ReportBugEmbed = new MessageEmbed().setColor('RED').setTitle('📢 Report de Bug/Erro Recebido').addField('Enviado por', `${message.author.tag} (*\`${message.author.id}\`*)`, true).addField('Servidor', `${message.guild.name} (*${message.guild.id}*)`).addField('Relatório', mensagem)
                    if (!ChannelId) { return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`) } else {
                        const channel = client.channels.cache.get(ChannelId); if (!channel) { return } else {
                            channel.send({ embeds: [ReportBugEmbed] }).then(() => {
                                    setTimeout(() => { message.reply(`${e.Check} | Seu reporte foi enviado com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)
                            }).catch(err => {
                                Error(message, err)
                                return message.reply(`${e.Deny} | Ocorreu um erro no envio da mensagem... Contacte meu criador, por favor. --> ${N.Rody} <--\n\`${err}\``)
                            })
                        }
                    }
                })
            }

            function WithoutChannel() {
                db.set(`${message.author.id}.Timeouts.Bug`, Date.now())
                const ReportBugEmbed = new MessageEmbed().setColor('RED').setTitle('📢 Report de Bug/Erro Recebido').addField('Enviado por', `${message.author.tag} (*\`${message.author.id}\`*)`, true).addField('Servidor', `${message.guild.name} (*${message.guild.id}*)`).addField('Relatório', mensagem)
                if (!ChannelId) { return message.reply(`${e.Deny} | Eu não encontrei o canal de envio no meu servidor central.\nPor favor, contacte meu criador --> ${N.Rody} <---`) } else {
                    const channel = client.channels.cache.get(ChannelId); if (!channel) { return } else {
                        channel.send({ embeds: [ReportBugEmbed] }).then(() => {
                            setTimeout(() => { message.reply(`${e.Check} | Seu reporte foi enviado com sucesso!\nVocê vai receber uma recompensa no banco em breve.`) }, 2000)
                        }).catch(err => {
                            Error(message, err)
                            return message.reply(`${e.Deny} | Ocorreu um erro no envio da mensagem... Contacte meu criador, por favor. --> ${N.Rody} <--\n\`${err}\``)
                        })
                    }
                }
            }

            CanalDeConvite ? WithChannel() : WithoutChannel()
        }
    }
}