// const Super = require('../../Routes/classes/SupremacyClass')
// const client = require('../../index')
const data = require('../../Routes/functions/data')

// -----------------------------------------------------------------

const { MessageEmbed, Permissions } = require('discord.js')
const client = require('../../index')
const { N } = require('../../database/nomes.json')
const { config } = require('../../database/config.json')
const { e } = require('../../database/emojis.json')
const { f } = require('../../database/frases.json')
const { RateLimiter } = require('discord.js-rate-limiter')
const rateLimiter = new RateLimiter(1, 1500)
const { sdb, db, CommandsLog } = require('../../Routes/functions/database')
const BlockCommandsBot = require('../../Routes/functions/blockcommands')
const { RegisterUser, RegisterServer, UpdateUserName } = require("../../Routes/functions/register")
const React = require('../../Routes/functions/reacts')
const xp = require('../../Routes/functions/experience')
const AfkSystem = require('../../Routes/functions/AfkSystem')
const RequestAutoDelete = require('../../Routes/functions/Request')
const Blacklisted = require('../../Routes/functions/blacklist')
const ServerBlocked = require('../../Routes/functions/blacklistserver')
const Error = require('../../Routes/functions/errors')
const ServerManager = require('../../Routes/classes/ServerManager')
const UserManager = require('../../Routes/classes/UserManager')
const parsems = require('parse-ms')

// -----------------------------------------------------------------

// const {
//     MessageEmbed, Permissions, f, RegisterUser, RegisterServer, UpdateUserName, sdb, db, BlockCommandsBot, rateLimiter, client, ServerManager, UserManager, AfkSystem, xp, React, parsems, RequestAutoDelete, Blacklisted, ServerBlocked, Error, N, e, config
// } = {
//     MessageEmbed: Super.MessageEmbed,
//     Permissions: Super.Permissions,
//     f: Super.f,
//     RegisterUser: Super.RegisterUser,
//     RegisterServer: Super.RegisterServer,
//     UpdateUserName: Super.UpdateUserName,
//     sdb: Super.sdb,
//     db: Super.db,
//     BlockCommandsBot: Super.BlockCommandsBot,
//     rateLimiter: Super.rateLimiter,
//     client: require('../../index'),
//     ServerManager: Super.ServerManager,
//     UserManager: Super.UserManager,
//     AfkSystem: Super.AfkSystem,
//     xp: Super.xp,
//     React: Super.React,
//     parsems: Super.parsems,
//     RequestAutoDelete: Super.RequestAutoDelete,
//     Blacklisted: Super.Blacklisted,
//     ServerBlocked: Super.ServerBlocked,
//     Error: Super.Error,
//     N: Super.DatabaseObj.N,
//     e: Super.DatabaseObj.e,
//     config: Super.DatabaseObj.config
// }

// -----------------------------------------------------------------

// const {
//     MessageEmbed, Permissions, f, RegisterUser, RegisterServer, UpdateUserName, sdb, db, CommandsLog, BlockCommandsBot, rateLimiter, ServerManager, UserManager, AfkSystem, xp, React, parsems, RequestAutoDelete, Blacklisted, ServerBlocked, Error, DatabaseObj: { N, e, config }
// } = Super

// -----------------------------------------------------------------

client.on('messageCreate', async message => {

    if (!message.guild || !message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES) || !message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.VIEW_CHANNEL) || !message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES) || !message.guild.me.permissions.has(Permissions.FLAGS.VIEW_CHANNEL))
        return

    const Server = new ServerManager(message.guild)
    const User = new UserManager(message, message.author)

    const { prefix, request, baka, blacklist, blacklistServers, Tsundere, frases, Result, AuthorId } = {
        prefix: Server.prefix,
        request: User.request,
        // request: false,
        baka: User.baka,
        blacklist: User.blacklist,
        blacklistServers: Server.Blacklisted,
        Tsundere: Server.tsundere,
        Result: Math.floor(Math.random() * 12),
        frases: f.Tsundere[Math.floor(Math.random() * f.Tsundere.length)],
        AuthorId: message.author.id
    }

    if (!sdb.has(`Users.${AuthorId}`)) RegisterUser(message)
    if (!sdb.has(`Servers.${message.guild.id}`)) RegisterServer(message.guild)

    if (message.content?.toLowerCase() === 'saphire')
        message.channel.send(`${e.SaphireHi} | \`${prefix}help\``).catch(() => { })

    if (!message.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY) || !message.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) || !message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS) || !message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS))
        return message.channel.send(`Hey, ${message.author}! Eu preciso das permissões "\`Ver histórico de mensagens\`, \`Usar emojis externos\` \`Adicionar Reações\` e \`Enviar links\`" para que eu possa usar meu sistema de interação, respostas, emojis e informações.`)

    if (!message.author.bot) {
        UpdateUserName(message)
        React(message) // React System
        xp(message) // XP System
        RequestAutoDelete(message) // Auto delete requests
        AfkSystem(message)
    }

    if (message.content.startsWith(`<@`) && message.content.endsWith('>') && message.mentions.has(client.user.id))
        message.channel.send(`${e.SaphireHi} | \`${prefix}help\``)

    // Block Bot Commands
    BlockCommandsBot(message)

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()

    if (message.author.bot || !message.content.startsWith(prefix) || cmd.length == 0) return

    if (sdb.get('Client.Rebooting.ON')) return message.reply(`${e.Loading} Relogando...\n${sdb.get('Client.Rebooting.Features')} `)

    if (baka) return message.reply(`${e.SaphireRaivaFogo} | Saaai, você me chamou de BAAAKA`)

    let limited = rateLimiter.take(AuthorId);
    if (limited) return message.react('⏱️').catch(() => { message.reply('⏱️ | Calminha!') })

    try {

        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && sdb.get(`Servers.${message.guild.id}.Blockchannels.${message.channel.id}`))
            return message.reply(`${e.Deny} | Meus comandos foram bloqueados neste canal.`).then(msg => setTimeout(() => { msg.delete().catch(() => { }) }, 4500)).catch(() => { })

        if (AuthorId !== config.ownerId) {
            if (!sdb.get(`Moderadores.${AuthorId}`)) {
                if (blacklist) return Blacklisted(message)
                if (blacklistServers) return ServerBlocked(message)
            }
        }

        if (cmd.indexOf('.') > -1 || cmd.indexOf(',') > -1)
              return message.reply(`${e.Deny} | Este comando contém caracteres bloqueado pelo meu sistema.`)

        if (sdb.has(`ComandoBloqueado.${cmd}`)) return message.reply(`${e.BongoScript} Este comando foi bloqueado porque houve algum Bug/Erro.\nQuer fazer algúm reporte? Use \`${prefix}bug\``)

        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
        if (command) {

            sdb.add('Client.ComandosUsados', 1)

            CommandsLog.set(`${sdb.get('Client.ComandosUsados')}`, {
                Author: `${message.author.tag} - ${message.author.id}` || 'Indefinido',
                Server: `${message.guild.name} - ${message.guild.id}` || 'Indefinido',
                Command: cmd || 'Indefinido',
                Time: data() || 'Indefinido'
            })

            let time = parsems(1500000 - (Date.now() - sdb.get(`Users.${AuthorId}.Timeouts.Preso`)))
            let timeImage = parsems(10000 - (Date.now() - sdb.get(`Users.${AuthorId}.Timeouts.ImagesCooldown`)))
            if (!message.member.permissions.has(command.UserPermissions || [])) return message.reply(`${e.Hmmm} | Você não tem permissão para usar este comando.\nPermissão necessária: \`${command.UserPermissions || []}\``)
            if (!message.guild.me.permissions.has(command.ClientPermissions || [])) return message.reply(`${e.SadPanda} | Eu preciso da permissão \`${command.ClientPermissions || []}\` para continuar com este comando.`)
            if (command.category === 'owner' && AuthorId !== config.ownerId) return message.reply(`${e.OwnerCrow} | Este é um comando restrito da classe: Owner/Desenvolvedor`)
            if (command.category === 'economy') { if (sdb.get(`Users.${AuthorId}.Timeouts.Preso`) !== null && 1500000 - (Date.now() - sdb.get(`Users.${AuthorId}.Timeouts.Preso`)) > 0) return message.reply(`${e.Cadeia} Você está preso! Liberdade em: \`${time.minutes}m e ${time.seconds}s\``) }
            if (command.category === 'images') {
                if (sdb.get(`Users.${AuthorId}.Timeouts.ImagesCooldown`) !== null && 10000 - (Date.now() - sdb.get(`Users.${AuthorId}.Timeouts.ImagesCooldown`)) > 0)
                    return message.reply(`⏱️ | Os comandos de imagens são diferenciados, vai com calma! \`${timeImage.seconds} segundos\``)

                sdb.set(`Users.${AuthorId}.Timeouts.ImagesCooldown`, Date.now())
            }

        } else {
            let frases = [`Eu não tenho esse comando não... Que tal usar o \`${prefix}help\` ?`, `Olha... Eu não tenho esse comando não, sabe? Tenta usar o \`${prefix}help\`, lá tem todos os meus comandos.`, `Viiiish, comando desconhecido, foi mal.`, `Conheço esse comando aí não... Verifica a ortografia e tenta novamente`, `Huuum, quer usar o \`${prefix}help\` não?`]
            let resposta = frases[Math.floor(Math.random() * frases.length)]
            return message.reply(`${e.Deny} | ${resposta}`)
        }


        try {

            if (Tsundere) {

                Result === 1 ? message.reply(frases) : command.run(client, message, args, prefix, db, MessageEmbed, request, sdb).catch(err => { Error(message, err) })

            } else {
                command.run(client, message, args, prefix, db, MessageEmbed, request, sdb).catch(err => { Error(message, err) })
            }

        } catch (err) {
            let frases = [`Eu não tenho esse comando não... Que tal usar o \`${prefix}help\` ?`, `Olha... Eu não tenho esse comando não, sabe? Tenta usar o \`${prefix}help\`, lá tem todos os meus comandos.`, `Viiiish, comando desconhecido, foi mal.`, `Conheço esse comando aí não... Verifica a ortografia e tenta novamente`, `Huuum, quer usar o \`${prefix}help\` não?`]
            let resposta = frases[Math.floor(Math.random() * frases.length)]
            return message.reply(`${e.Deny} | ${resposta}`)
        }

    } catch (err) {
        Error(message, err)
        return message.channel.send(`${e.Warn} | Houve um erro crítico em um sistema prioritário do meu sistema. Por favor, fale com meu criador >-- **${N.Rody}** <-- e reporte este erro.\n\`${err}\``)
    }
})