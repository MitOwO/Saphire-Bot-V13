const { MessageEmbed, Permissions } = require('discord.js')
const client = require('../../index')
const db = require('quick.db')
const { N } = require('../../Routes/nomes.json')
const { config } = require('../../Routes/config.json')
const { e } = require('../../Routes/emojis.json')
const cooldown = new Set()
const React = require('../../Routes/functions/reacts')
const xp = require('../../Routes/functions/experience')
const AfkSystem = require('../../Routes/functions/AfkSystem')
const RequestAutoDelete = require('../../Routes/functions/Request')
const BakaBlocked = require('../../Routes/functions/BakaBlocked')
const Blacklisted = require('../../Routes/functions/blacklist')

client.on('messageCreate', async message => {

    if (!message.guild || message.guild.avaliable || message.author.bot || !message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES || Permissions.FLAGS.VIEW_CHANNEL)) return

    let prefix = db.get(`Servers.${message.guild.id}.Prefix`) || config.prefix
    let request = db.get(`User.Request.${message.author.id}`)
    let baka = db.get(`User.${message.author.id}.Baka`)
    let blacklist = db.get(`Blacklist_${message.author.id}`)

    React(message) // Interação de reações
    xp(message) // XP System
    request ? RequestAutoDelete(message) : '' // Auto delete requests

    if (message.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY) && message.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {

        AfkSystem(message)

        if (message.content.startsWith(`<@`) && message.content.endsWith('>') && message.mentions.has(client.user.id)) message.channel.send(`${e.Pikachu} | \`${prefix}help\``)

        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const cmd = args.shift().toLowerCase()

        if (!message.content.startsWith(prefix) || cmd.length == 0) return
        if (blacklist) return Blacklisted(message)
        if (baka) return BakaBlocked(message)

        if (cooldown.has(message.author.id)) {
            return message.react('⏱️').catch(err => { })
        } else {

            message.channel.sendTyping().then(() => {

                if (db.get('Rebooting') === "ON") return message.reply(`${e.Loading} Estou relogando no momento...`)

                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                    if (db.get(`Servers.${message.guild.id}.Blockchannels.${message.channel.id}`))
                        return message.reply(`${e.Deny} | Meus comandos foram bloqueados neste canal.`).then(msg => setTimeout(() => { msg.delete().catch(err => { }) }, 4500))
                }

                let command = client.commands.get(cmd)
                if (!command) command = client.commands.get(client.aliases.get(cmd))
                if (command) {
                    db.add('ComandosUsados', 1)
                    if (!message.member.permissions.has(command.UserPermissions || [])) return message.reply(`${e.Hmmm} | Você não tem permissão para usar este comando.\nPermissão necessária: \`${command.UserPermissions || []}\``)
                    if (!message.guild.me.permissions.has(command.ClientPermissions || [])) return message.reply(`${e.SadPanda} | Eu preciso da permissão \`${command.ClientPermissions || []}\` para continuar com este comando.`)
                    if (command.category === 'owner' && message.author.id !== config.ownerId) return message.reply(`${e.OwnerCrow} | Este é um comando restrito da classe: Owner/Desenvolvedor`)
                }

                let blocked = db.get(`ComandoBloqueado.${cmd}`) || "OPEN"
                if (blocked !== "OPEN") { return message.reply(`🔒 | **Comando bloqueado > Razão: "BUG"** > *(Sob Análise)*\n~~ Faça seu reporte: \`${prefix}bug\` --`) }

                try {
                    command.run(client, message, args, prefix, db, MessageEmbed, request).then(() => { db.add('ComandosUsados', 1) }).catch(err => { ReportErros(err) })
                } catch (err) { return message.reply(`${e.Deny} | Eu não tenho esse comando não... Que tal usar o \`${prefix}help\` ?`) }

                function ReportErros(err) {
                    db.set(`ComandoBloqueado.${cmd}`, 'BUG')
                    message.channel.createInvite({ maxAge: 0 }).then(ChannelInvite => {
                        const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro`).setDescription(`Author: ${message.author} | ${message.author.tag} |*\`${message.author.id}\`*\nMensagem: \`${message.content}\`\nServidor: [${message.guild.name}](${ChannelInvite.url})\nErro: \`${err}\``)
                        client.users.cache.get(config.ownerId).send({ embeds: [NewError] }).catch(err => { })
                    }).catch(err => {
                        const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro`).setDescription(`Author: ${message.author} | ${message.author.tag} |*\`${message.author.id}\`*\nMensagem: \`${message.content}\`\nServidor: ${message.guild.name} *(Falha ao obter o convite)*\nErro: \`${err}\``)
                        client.users.cache.get(config.ownerId).send({ embeds: [NewError] }).catch(err => { })
                    })
                    const EmbedError = new MessageEmbed().setColor('RED').setTitle('📌 Ocorreu um erro neste comando.').setDescription('De boa! Já avisei meu criador e ele vai arrumar isso o mais rápido possivel!').setFooter('Por motivos de segura, este comando está bloqueado.')
                    message.reply({ embeds: [EmbedError] })
                }

                cooldown.add(message.author.id)
                setTimeout(() => { cooldown.delete(message.author.id) }, 1500)
            }).catch(err => { return message.channel.send(`${e.Attention} | Houve um erro crítico em um sistema prioritário do meu sistema. Por favor, fale com meu criador >-- **${N.Rody}** <-- e reporte este erro.\n\`${err}\``) })
        }
    } else {
        if (!message.content.startsWith(prefix)) return
        return message.channel.send(`Hey, ${message.author}! Eu preciso das permissões "\`Ver histórico de mensagens\` e \`Usar emojis externos\`" para que eu possa usar meu sistema de interação, respostas, emojis e informações.`)
    }
})
