const { MessageEmbed, Permissions } = require('discord.js')
const client = require('../../index')
const db = require('quick.db')
const { N } = require('../../Routes/nomes.json')
const { config } = require('../../Routes/config.json')
const { e } = require('../../Routes/emojis.json')
const { f } = require('../../Routes/frases.json')
const cooldown = new Set()
const ms = require('parse-ms')
const React = require('../../Routes/functions/reacts')
const xp = require('../../Routes/functions/experience')
const AfkSystem = require('../../Routes/functions/AfkSystem')
const RequestAutoDelete = require('../../Routes/functions/Request')
const BakaBlocked = require('../../Routes/functions/BakaBlocked')
const Blacklisted = require('../../Routes/functions/blacklist')
const ServerBlocked = require('../../Routes/functions/blacklistserver')
const Error = require('../../Routes/functions/errors')

client.on('messageCreate', async message => {

    if (!message.guild || message.guild.avaliable || !message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES || Permissions.FLAGS.VIEW_CHANNEL)) return

    let prefix = db.get(`Servers.${message.guild.id}.Prefix`) || config.prefix
    let request = db.get(`Request.${message.author.id}`)
    let baka = db.get(`${message.author.id}.Baka`)
    let blacklist = db.get(`Blacklist_${message.author.id}`)
    let blacklistServers = db.get(`BlacklistServers_${message.guild.id}`)

    if (message.content?.toLowerCase() === 'saphire') {
        message.channel.send(`${e.SaphireHi} | \`${prefix}help\``).catch(() => { })
    }

    if (message.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY) && message.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) && message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {

        if (!message.author.bot) {
            React(message) // Interação de reações
            xp(message) // XP System
            request ? RequestAutoDelete(message) : '' // Auto delete requests
            AfkSystem(message)
        }

        if (message.content.startsWith(`<@`) && message.content.endsWith('>') && message.mentions.has(client.user.id)) message.channel.send(`${e.SaphireHi} | \`${prefix}help\``)

        if (cooldown.has(message.author.id)) {
            return message.react('⏱️').catch(err => {
                message.reply(`⏱️ | Calminha \`1s\``)
            })
        } else {

            if (db.get(`Servers.${message.guild.id}.Blockchannels.Bots.${message.channel.id}`)) {
                if (message.author.bot) {
                    if (message.author.id === client.user.id)
                        return
                    message.delete().then(() => {
                        return message.channel.send(`${e.Deny} | Comandos de bots foram bloqueados neste canal.`).then(msg => setTimeout(() => { msg.delete().catch(err => { }) }, 4500))
                    }).catch(err => {
                        db.delete(`Servers.${message.guild.id}.Blockchannels.Bots`)
                        Notify(`🛰️ | **Global System Notification** | Configuration System\n \nAparentemente eu estou **sem permissão** para apagar mensagens de outros bots. Para evitar conflitos e estresse, a configuração **${prefix}lockcommands bots** foi desativada no servidor.`)
                        message.channel.send(`${e.Warn} | Estou sem permissão para executar o bloqueio de comandos de outros bots. Sistema desativado.`)
                    })
                }
            }

            function Notify(Msg) {
                const canal = client.channels.cache.get(db.get(`Servers.${message.guild.id}.LogChannel`))
                canal ? canal.send(Msg).catch(() => { }) : ''
            }

            const args = message.content.slice(prefix.length).trim().split(/ +/g)
            const cmd = args.shift().toLowerCase()

            if (!message.content.startsWith(prefix) || cmd.length == 0) return
            if (message.author.bot) return

            message.channel.sendTyping().then(() => {

                if (db.get('Rebooting.ON')) return message.reply(`${e.Loading} Relogando...\nFeatures: ${db.get('Rebooting.Features')} `)

                try {
                    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                        if (db.get(`Servers.${message.guild.id}.Blockchannels.${message.channel.id}`)) {
                            return message.reply(`${e.Deny} | Meus comandos foram bloqueados neste canal.`).then(msg => setTimeout(() => { msg.delete().catch(err => { }) }, 4500)).catch(err => { })
                        }
                    }
                } catch (err) { }

                if (message.author.id !== config.ownerId) {
                    if (blacklist) return Blacklisted(message)
                    if (blacklistServers) return ServerBlocked(message)
                }
                if (baka) return BakaBlocked(message)

                let command = client.commands.get(cmd)
                if (!command) command = client.commands.get(client.aliases.get(cmd))
                if (command) {
                    db.add('ComandosUsados', 1)
                    let time = ms(1500000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Preso`)))
                    if (!message.member.permissions.has(command.UserPermissions || [])) return message.reply(`${e.Hmmm} | Você não tem permissão para usar este comando.\nPermissão necessária: \`${command.UserPermissions || []}\``)
                    if (!message.guild.me.permissions.has(command.ClientPermissions || [])) return message.reply(`${e.SadPanda} | Eu preciso da permissão \`${command.ClientPermissions || []}\` para continuar com este comando.`)
                    if (command.category === 'owner' && message.author.id !== config.ownerId) return message.reply(`${e.OwnerCrow} | Este é um comando restrito da classe: Owner/Desenvolvedor`)
                    if (command.category === 'economy') { if (db.get(`${message.author.id}.Timeouts.Preso`) !== null && 1500000 - (Date.now() - db.get(`${message.author.id}.Timeouts.Preso`)) > 0) return message.reply(`${e.Cadeia} Você está preso! Liberdade em: \`${time.minutes}m e ${time.seconds}s\``) }
                }

                if (db.get(`ComandoBloqueado.${cmd}`)) return message.reply(`${e.BongoScript} Este comando foi bloqueado porque houve algum Bug/Erro.\nQuer fazer algúm reporte? Use \`${prefix}bug\``)

                try {
                    if (db.get(`Server.${message.guild.id}.Tsundere`)) {
                        let frases = f.Tsundere[Math.floor(Math.random() * f.Tsundere.length)]
                        let Result = Math.floor(Math.random() * 12)
                        if (Result === 1) {
                            return message.reply(frases)
                        } else {
                            command.run(client, message, args, prefix, db, MessageEmbed, request).catch(err => { Error(message, err) })
                        }
                    } else {
                        command.run(client, message, args, prefix, db, MessageEmbed, request).catch(err => { Error(message, err) })
                    }
                } catch (err) {
                    let frases = [`Eu não tenho esse comando não... Que tal usar o \`${prefix}help\` ?`, `Olha... Eu não tenho esse comando não, sabe? Tenta usar o \`${prefix}help\`, lá tem todos os meus comandos.`, `Viiiish, comando desconhecido, foi mal.`, `Conheço esse comando aí não... Verifica a ortografia e tenta novamente`, `Huuum, quer usar o \`${prefix}help\` não?`]
                    let resposta = frases[Math.floor(Math.random() * frases.length)]
                    return message.reply(`${e.Deny} | ${resposta}`)
                }

                cooldown.add(message.author.id)
                setTimeout(() => { cooldown.delete(message.author.id) }, 1500)
            }).catch(err => {
                Error(message, err)
                return message.channel.send(`${e.Warn} | Houve um erro crítico em um sistema prioritário do meu sistema. Por favor, fale com meu criador >-- **${N.Rody}** <-- e reporte este erro.\n\`${err}\``)
            })
        }
    } else {
        if (!message.content.startsWith(prefix)) return
        return message.channel.send(`Hey, ${message.author}! Eu preciso das permissões "\`Ver histórico de mensagens\`, \`Usar emojis externos\` e \`Enviar links\`" para que eu possa usar meu sistema de interação, respostas, emojis e informações.`)
    }
})
