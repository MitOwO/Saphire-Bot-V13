const { Permissions } = require('discord.js')
const { e } = require('../../../database/emojis.json')
const ms = require('ms')
const parsems = require('parse-ms')
const Super = require('../../../Routes/classes/SupremacyClass')

module.exports = {
    name: 'mute',
    aliases: ['mutar', 'silence'],
    category: 'moderation',
    UserPermissions: ['MANAGE_ROLES'],
    ClientPermissions: ['MANAGE_ROLES'],
    emoji: '🔇',
    usage: '<mute> <@user> [Tempo] [Motivo]',
    description: 'Mutar membros do servidor',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        return message.reply(`${e.Loading} | Em construção...`)

        // const server = new Super.ServerManager(message.guild)
        // const user = new Super.UserManager(message, message.author)

        // const { logchannel, logchannelDb, role, RoleDB, BotRole } = {
        //     logchannel: server.LogChannel.Channel(),
        //     logchannelDb: server.LogChannel.ChannelDB,
        //     role: server.MuteSystem.Role() || 'não definido',
        //     RoleDB: server.MuteSystem.RoleDB(),
        //     BotRole: server.BotRole()
        // }
        
        // if (!args[0] || ['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return InfoEmbed()

        // if (!logchannel && logchannelDb)
        //     server.DeleteLogChannel(message.guild, message, false)

        // if (!role && RoleDB)
        //     server.MuteSystem.DeleteRoleDb()

        // if (['del', 'remove', 'delete'].includes(args[0]?.toLowerCase())) return DeleteMuteCommand()
        // if (['refresh', 'atualizar', 'att'].includes(args[0]?.toLowerCase())) return RefreshMutedRoleConfiguration()
        // if (!role) return SetAndConfigMutedRole()
        // if (!role.editable) return message.reply(`${e.Deny} | Eu não tenho permissão suficiente para gerenciar o Cargo **${role}**.`)

        // function DeleteMuteCommand() {

        //     return logchannelDb ?
        //         server.DeleteLogChannel(message.guild, message, true)
        //         : message.reply(`${e.Deny} | Não há nenhum cargo mute configurado na minha database para este servidor.`)

        // }

        // async function SetAndConfigMutedRole() {

        //     if (!role && RoleDB)
        //         server.MuteSystem.DeleteRoleDb()

        //     let Role = message.mentions.roles.first()
        //     if (role) return InfoEmbed()

        //     if (['new'].includes(args[1]?.toLowerCase())) return CreateRole()
        //     if (Role) return SetupNewRole()

        //     return message.reply(`${e.Info} | Este servidor não tem um cargo mute configurado   . Para configurar tudo rapidamente, use o comando \`${prefix}mute config new\` ou \`${prefix}mute config @cargo\`. Caso queria criar um cargo personalizado, use o comando \`${prefix}cargo create <Nome do Cargo>\`\n \nNo meu sistema mute, eu configuro o cargo Muted em todos os canais do servidor bloqueando as permissões **Enviar mensagens,  Adicionar reacões, Gerenciar Canais/Mensagens**. Vale lembrar que Administradores são imune ao sistema mute.`)

        //     async function SetupNewRole() {

        //         if (Role.id === sdb.get(`Servers.${message.guild.id}.Roles.Muted`))
        //             return message.reply(`${e.Info} | Este já está configurado como Cargo Muted.`)

        //         if (role) {

        //             Role.setPermissions(0n).catch(err => {
        //                 return message.channel.send(`${e.Warn} | Ocorreu um erro na configuração do cargo Muted.\n\`${err}\``)
        //             })

        //             message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async channel => {
        //                 try {
        //                     await channel.permissionOverwrites.delete(role)
        //                     await channel.permissionOverwrites.create(Role, { SEND_MESSAGES: false, ADD_REACTIONS: false, SEND_TTS_MESSAGES: false, MANAGE_MESSAGES: false, MANAGE_ROLES: false, MANAGE_CHANNELS: false })
        //                 } catch (err) {
        //                     return message.channel.send(`${e.Warn} | Ocorreu um erro na configuração do cargo Muted.\n\`${err}\``)

        //                 }
        //             })

        //             message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').forEach(async channel => {
        //                 try {
        //                     await channel.permissionOverwrites.delete(role);
        //                     await channel.permissionOverwrites.create(Role, { SPEAK: false, CONNECT: false })
        //                 } catch (err) {
        //                     return message.channel.send(`${e.Warn} | Ocorreu um erro na configuração do cargo Muted.\n\`${err}\``)

        //                 }
        //             })

        //             sdb.set(`Servers.${message.guild.id}.Roles.Muted`, role.id)
        //             return message.reply(`${e.Check} | O cargo ${Role} foi configurado como Cargo Muted com sucesso!\nEu tirei as configurações de mute do cargo ${role} de todos os canais do servidor pra facilitar a sua vida, ok?`)

        //         } else {

        //             message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async channel => { await channel.permissionOverwrites.create(Role, { SEND_MESSAGES: false, ADD_REACTIONS: false, SEND_TTS_MESSAGES: false, MANAGE_MESSAGES: false, MANAGE_ROLES: false, MANAGE_CHANNELS: false }).catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro na configuração do cargo Muted.\n\`${err}\``) }) })
        //             message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').forEach(async channel => { await channel.permissionOverwrites.create(Role, { SPEAK: false, CONNECT: false }).catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro na configuração do cargo Muted.\n\`${err}\``) }) })
        //             sdb.set(`Servers.${message.guild.id}.Roles.Muted`, role.id)
        //             return message.reply(`${e.Check} | O cargo ${Role} foi configurado como Cargo Muted com sucesso!`)

        //         }

        //     }

        //     async function CreateRole() {

        //         const role = await message.guild.roles.create({
        //             name: 'Muted',
        //             reason: 'Mute Role Configuration.',
        //             permissions: []
        //         }).catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro na criação do cargo Muted.\n\`${err}\``) })

        //         message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async channel => { await channel.permissionOverwrites.create(muterole, { SEND_MESSAGES: false, ADD_REACTIONS: false, SEND_TTS_MESSAGES: false, MANAGE_MESSAGES: false, MANAGE_ROLES: false, MANAGE_CHANNELS: false }).catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro na configuração do cargo Muted.\n\`${err}\``) }) })
        //         message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').forEach(async channel => { await channel.permissionOverwrites.create(muterole, { SPEAK: false, CONNECT: false }).catch(err => { return message.channel.send(`${e.Warn} | Ocorreu um erro na configuração do cargo Muted.\n\`${err}\``) }) })
        //         sdb.set(`Servers.${message.guild.id}.Roles.Muted`, muterole.id)
        //         return message.reply(`${e.Check} | O cargo ${muterole} foi criado e configurado com sucesso!`)
        //     }
        // }

        // async function RefreshMutedRoleConfiguration() {

        //     if (!role)
        //         return message.reply(`${e.Deny} | Este servidor não possui nenhum cargo configurado como Cargo Muted. Para configuragar um novo cargo, use o comando \`${prefix}mute config new\` ou \`${prefix}mute config @cargo\` que eu faço todo o resto pra você.`)

        //     role?.setPermissions(0n).catch(err => {
        //         return message.channel.send(`${e.Warn} | Ocorreu um erro na configuração do cargo Muted.\n\`${err}\``)
        //     })

        //     message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async channel => {
        //         try {
        //             await channel.permissionOverwrites.create(role, { SEND_MESSAGES: false, ADD_REACTIONS: false, SEND_TTS_MESSAGES: false, MANAGE_MESSAGES: false, MANAGE_ROLES: false, MANAGE_CHANNELS: false })
        //         } catch (err) {
        //             return message.channel.send(`${e.Warn} | Ocorreu um erro na atualização na configuração do cargo Muted.\n\`${err}\``)

        //         }
        //     })


        //     message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').forEach(async channel => {
        //         try {
        //             await channel.permissionOverwrites.create(role, { SPEAK: false, CONNECT: false })
        //         } catch (err) {
        //             return message.channel.send(`${e.Warn} | Ocorreu um erro na configuração do cargo Muted.\n\`${err}\``)

        //         }
        //     })

        //     return message.reply(`${e.Check} | O cargo foi atualizado com sucesso em todos os canais do servidor!`)
        // }

        // let member = message.mentions.members.first() || await message.guild.members.cache.get(args[0])
        // if (!member) return message.reply(`${e.Deny} | Você não me disse quem é pra mutar. Tenta assim : \`${prefix}mute @user Tempo Razão\``)

        // if (member.id === message.author.id)
        //     return message.reply("'-' Vou nem comentar nada...")

        // if (member.id === message.guild.ownerId) return message.reply(`${e.Deny} | Mutar o dono do servidor não é uma opção.`)
        // if (member.id === client.user.id) return message.reply(`${e.Drinking} | Ai ai... Vê se pode...`)
        // if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply(`${e.Deny} | Nada de mudar administradores(as).`)

        // if (message.author.id !== message.guild.ownerId) {
        //     if (member.roles.highest.comparePositionTo(message.member.roles.highest) > -1) {
        //         return message.reply(`${e.Deny} | Você não pode mutar alguém com o mesmo cargo ou um cargo maior que o seu.`)
        //     }
        // }

        // let TimeMs

        // if (args[1]) {

        //     if (!['s', 'm', 'h', 'd'].includes(args[1]?.slice(-1)))
        //         return message.reply(`${e.Deny} | Tempo inválido!`)

        //     try {
        //         TimeMs = ms(args[1])
        //     } catch (er) {
        //         return message.reply(`${e.Deny} | Tempo inválido!`)
        //     }

        // } else {
        //     TimeMs = 'Invalid'
        // }

        // let Tempo = isNaN(TimeMs) ? 'Tempo não especificado.' : parsems(TimeMs)
        // let MensagemDeMute = !isNaN(Tempo) ? `${e.QuestionMark} | Você confirma o mute de ${member} por **${Tempo.days} dias, ${Tempo.hours} horas, ${Tempo.minutes} minutos e ${Tempos.segundos} segundos**?` : `${e.QuestionMark} | Você confirma o mute de ${member} por tempo indertemidado?`

        // let reason = args.slice(2)?.join(" ") || `Motivo não especificado por ${message.author.username}.`

        // const MuteEmbed = new MessageEmbed()
        //     .setColor('#8B0000')
        //     .setAuthor(`Sistema de Mute - ${message.guild.name}`)
        //     .addFields(
        //         {
        //             name: 'Usuário',
        //             value: `> ${member.user}`,
        //             inline: true
        //         },
        //         {
        //             name: 'Nome Original',
        //             value: `${member.user.tag} *\`${member.user.id}\`*`
        //         },
        //         {
        //             name: 'Moderador(a)',
        //             value: `${message.author} *\`${message.author.id}\`*`,
        //             inline: true
        //         },
        //         {
        //             name: 'Tempo do Mute',
        //             value: `> ${time}`,
        //             inline: true
        //         },
        //         {
        //             name: 'Motivo do Mute',
        //             value: `> ${reason}`
        //         },
        //     )
        //     .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        //     .setTimestamp()

        // if (member.roles.cache.has(role.id)) {

        //     return message.reply({ embeds: [embed] }).then(msg => {
        //         sdb.set(`Request.${message.author.id}`, `${msg.url}`)
        //         msg.react('✅').catch(() => { }) // Check
        //         msg.react('❌').catch(() => { }) // X

        //         const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

        //         msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
        //             const reaction = collected.first()

        //             if (reaction.emoji.name === '✅') {
        //                 sdb.delete(`Request.${message.author.id}`)

        //                 if (!isNaN(time))
        //                     sdb.set(`Servers.${message.guild.id}.UsersMuted.${member.id}`, { Time: time, DateNow: Date.now() })

        //                 return message.reply(`${e.Check} | Usuário remutado com sucesso!`)

        //             } else {
        //                 sdb.delete(`Request.${message.author.id}`)
        //                 msg.edit(`${e.Deny} | Comando cancelado.`).catch(() => { })
        //             }
        //         }).catch(() => {
        //             sdb.delete(`Request.${message.author.id}`)
        //             msg.edit(`${e.Deny} | Comando cancelado por tempo expirado.`).catch(() => { })
        //         })

        //     }).catch(err => {
        //         Error(message, err)
        //         message.channel.send(`${e.SaphireCry} | Ocorreu um erro durante o processo. Por favor, reporte o ocorrido usando \`${prefix}bug\`\n\`${err}\``)
        //     })

        // }

        // const msg = await message.reply(`${MensagemDeMute}`)

        // sdb.set(`Request.${message.author.id}`, `${msg.url}`)
        // msg.react('✅').catch(() => { }) // Check
        // msg.react('❌').catch(() => { }) // X

        // const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

        // msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
        //     const reaction = collected.first()

        //     if (reaction.emoji.name === '✅') {
        //         sdb.delete(`Request.${message.author.id}`)

        //         if (!isNaN(time))
        //             sdb.set(`Servers.${message.guild.id}.UsersMuted.${member.id}`, { Time: time, DateNow: Date.now() })

        //         member.roles.add(role).catch(err => {
        //             return message.channel.send(`${e.Warn} | Ocorreu um erro ao mutar este usuário.\n\`${err}\``)
        //         })

        //         if (logchannel)
        //             logchannel?.send({ embeds: [MuteEmbed] })

        //         let ReplyMessage = logchannel ? `${e.Check} | Mute efetuado com sucesso! Mais detalhes em ${logchannel}` : `${e.Check} | Mute efetuado com sucesso! Ative \`${prefix}logs\` para receber mais informações.`
        //         return message.reply(`${ReplyMessage}`)

        //     } else {
        //         sdb.delete(`Request.${message.author.id}`)
        //         msg.edit(`${e.Deny} | Comando cancelado.`).catch(() => { })
        //     }

        // }).catch(() => {
        //     sdb.delete(`Request.${message.author.id}`)
        //     msg.edit(`${e.Deny} | Comando cancelado por tempo expirado.`).catch(() => { })
        // })


        // function InfoEmbed() {
        //     return message.reply({
        //         embeds: [
        //             new MessageEmbed()
        //                 .setColor('#246FE0')
        //                 .setTitle('Comando Mute - Detalhes')
        //                 .addFields(
        //                     {
        //                         name: '⌨️ Formato',
        //                         value: `\`${prefix}mute <@user> [5s/m/h] [Razão]\``
        //                     },
        //                     {
        //                         name: 'Cargo Atual',
        //                         value: `${role}`
        //                     },
        //                     {
        //                         name: '🔄 Atualize o Mute System',
        //                         value: `\`${prefix}mute refresh\` - Aqui você atualiza as configurações di cargo mute em todos os canais do servidor.`
        //                     },
        //                     {
        //                         name: '🆕 Auto Atualização',
        //                         value: 'Sempre que criar um canal de texto/voz novo, eu vou atualizar o cargo no canal, então não precisa se preocupar com a configuração do cargo.'
        //                     },
        //                     {
        //                         name: '📑 Canal Log',
        //                         value: `\`${prefix}logs\` - Neste canal, mandarei todos os detalhes do mute. Você pode deixar este canal público ou privado alterando as permissões dele.\nClaro, não vá me privar dele, né?.`
        //                     },
        //                     {
        //                         name: `⬆️ ${client.user.username} Role`,
        //                         value: `É **extremamente** importante que o meu cargo, ${BotRole} esteja acima dos outros cargos, para que eu possa efetuar os mutes com maestria.`
        //                     }
        //                 )
        //         ]
        //     })
        // }
    }
}