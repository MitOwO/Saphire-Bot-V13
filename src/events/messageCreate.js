const { MessageEmbed, Permissions } = require('discord.js')
const client = require('../../index')
const db = require('quick.db')
const { N } = require('../../Routes/nomes.json')
const { config } = require('../../Routes/config.json')
const { e } = require('../../Routes/emojis.json')
const cooldown = new Set()

client.on('messageCreate', async message => {

    if (!message.guild || message.guild.avaliable || message.author.bot || !message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES || Permissions.FLAGS.VIEW_CHANNEL)) return

    if (message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS)) {
        if (message.content.toLowerCase().includes('@everyone')) { message.react(e.PingEveryone).catch(err => { return }) }
        if (message.content.toLowerCase().includes('@here')) { message.react(e.PingEveryone).catch(err => { return }) }
        if (message.content.toLowerCase().includes('pikachu') && !message.author.bot) { message.react(e.Pikachu).catch(err => { return }) }
        if (message.content.toLowerCase().includes('nezuko') && !message.author.bot) { message.react(e.NezukoDance).catch(err => { return }) }
        if (message.content.toLowerCase().includes('itachi') && !message.author.bot) { message.react(e.Itachi).catch(err => { return }) }
        if (message.content.toLowerCase().includes('asuna') && !message.author.bot) { message.react(e.Asuna).catch(err => { return }) }
        if (message.content.toLowerCase().includes('deidara') && !message.author.bot) { message.react(e.Deidara).catch(err => { return }) }
        if (message.content.toLowerCase().includes('boom') && !message.author.bot) { message.react(e.Deidara).catch(err => { return }) }
        if (message.content.toLowerCase().includes('kirito') && !message.author.bot) { message.react(e.Kirito).catch(err => { return }) }
        if (message.content.toLowerCase().includes('loli') && !message.author.bot) { message.react("🚓").catch(err => { return }) }
    }

    xp(message)
    function xp(message) {
        if (message.author.bot) return
        const XpAdd = Math.floor(Math.random() * 3) + 1
        db.add(`Xp_${message.author.id}`, XpAdd)
        let level = db.get(`level_${message.author.id}`) || 1
        let xp = db.get(`Xp_${message.author.id}`) + 1
        let xpNeeded = level * 550;
        if (xpNeeded < xp) {
            let newLevel = db.add(`level_${message.author.id}`, 1)
            let XpChannel = db.get(`Servers.${message.guild.id}.XPChannel`)
            let canal = client.channels.cache.get(XpChannel)
            if (canal) {
                canal.send(`${e.Tada} | ${message.author} alcançou o level ${newLevel} ${e.RedStar}`)
            }
        }
    }

    let prefix = db.get(`Servers.${message.guild.id}.Prefix`) || config.prefix
    if (message.content.startsWith(['-.', '-\'', '- '])) return

    let request = db.get(`User.Request.${message.author.id}`)
    if (request) {
        setTimeout(() => {
            db.delete(`User.Request.${message.author.id}`)
        }, 120000)
    }

    if (message.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY) && message.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {

        if (db.get(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`)) {
            db.delete(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`)
            if (message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS)) {
                message.react(`${e.Planet}`).catch(err => { return })
            } else {
                message.reply(`${e.Check} O modo AFK foi desativado.`).then(msg => setTimeout(() => { msg.delete().catch(err => { return }) }, 3000))
            }
        }

        if (db.get(`Client.AfkSystem.${message.author.id}`)) {
            db.delete(`Client.AfkSystem.${message.author.id}`)
            if (message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS)) {
                message.react(`${e.Planet}`).catch(err => { return })
            } else {
                message.reply(`${e.Check} O modo AFK Global foi desativado.`).then(msg => setTimeout(() => { msg.delete().catch(err => { return }) }, 3000))
            }
        }

        let UserAfk = message.mentions.members.first() || message.mentions.members.repliedUser
        if (UserAfk) {
            let RecadoGlobal = db.get(`Client.AfkSystem.${UserAfk.id}`)
            let RecadoServidor = db.get(`Servers.${message.guild.id}.AfkSystem.${UserAfk.id}`)
            if (db.get(`Client.AfkSystem.${UserAfk.id}`)) { message.channel.sendTyping(), setTimeout(() => { message.reply(`${e.Planet} | ${UserAfk.user.username} está offline. --> ✍️ | ${RecadoGlobal}`) }, 1500) }
            if (db.get(`Servers.${message.guild.id}.AfkSystem.${UserAfk.id}`)) { message.channel.sendTyping(), setTimeout(() => { message.reply(`${e.Afk} | ${UserAfk.user.username} está offline. --> ✍️ | ${RecadoServidor}`) }, 1500) }
        }

        if (message.content.startsWith(`<@`) && message.content.endsWith('>') && message.mentions.has(client.user.id)) { message.channel.sendTyping(), message.channel.send(`${e.Pikachu} | \`${prefix}help\``) }

        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const cmd = args.shift().toLowerCase()

        if (!message.content.startsWith(prefix) || cmd.length == 0) return

        let baka = db.get(`User.${message.author.id}.Baka`)
        if (baka) {
            setTimeout(() => {
                db.delete(`User.${message.author.id}.Baka`)
            }, 20000)
            return message.reply(`Saaai, você me chamou de BAAAKA ${e.MaikaAngry}`)
        }

        if (cooldown.has(message.author.id)) {
            return message.react('⏱️').catch(err => { return })
        } else {

            message.channel.sendTyping().then(() => {

                let blacklist = db.get(`Blacklist_${message.author.id}`)
                if (message.author.id !== config.ownerId) { if (blacklist) { return message.channel.send(`${deny} | ${message.author}, você está na blacklist.`).then(msg => { setTimeout(() => { msg.delete().catch(err => { return }) }, 4000) }) } }

                if (db.get('Rebooting') === "ON") return message.reply(`${e.Loading} Estou relogando no momento...`)

                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                    if (db.get(`Servers.${message.guild.id}.Blockchannels.${message.channel.id}`))
                        return message.reply(`${e.Deny} | Meus comandos foram bloqueados neste canal.`).then(msg => setTimeout(() => { msg.delete().catch(err => { return }) }, 4500))
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
                    command.run(client, message, args, prefix, db, MessageEmbed, request).catch(err => {
                        db.set(`ComandoBloqueado.${cmd}`, 'BUG')
                        message.channel.createInvite({ maxAge: 0 }).then(ChannelInvite => {
                            const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro`).setDescription(`Author: ${message.author} | ${message.author.tag} |*\`${message.author.id}\`*\nMensagem: \`${message.content}\`\nServidor: [${message.guild.name}](${ChannelInvite.url})\nErro: \`${err}\``)
                            client.users.cache.get(config.ownerId).send({ embeds: [NewError] }).catch(err => { return })
                        }).catch(() => {
                            const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro`).setDescription(`Author: ${message.author} | ${message.author.tag} |*\`${message.author.id}\`*\nMensagem: \`${message.content}\`\nServidor: ${message.guild.name} *(Falha ao obter o convite)*\nErro: \`${err}\``)
                            client.users.cache.get(config.ownerId).send({ embeds: [NewError] }).catch(err => { return })
                        })
                        const EmbedError = new MessageEmbed().setColor('RED').setTitle('📌 Ocorreu um erro neste comando.').setDescription('De boa! Já avisei meu criador e ele vai arrumar isso o mais rápido possivel!').setFooter('Por motivos de segura, este comando está bloqueado.')
                        message.reply({ embeds: [EmbedError] })
                    })
                } catch (err) {
                    message.reply(`${e.Deny} | Comando não reconhecido. Verifique a ortografia ou confira o \`${prefix}help\``).then(msg => { setTimeout(function () { msg.delete().catch(err => { return }) }, 5000) })
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