const { e } = require('../../../Routes/emojis.json')
const { Permissions } = require('discord.js')
const { f } = require('../../../Routes/frases.json')
const Data = require('../../../Routes/functions/data')

module.exports = {
    name: 'ban',
    aliases: ['banir', 'bn'],
    category: 'moderation',
    UserPermissions: 'BAN_MEMBERS',
    ClientPermissions: 'BAN_MEMBERS',
    emoji: `${e.ModShield}`,
    usage: '<ban> <@user> [Motivo] | <ban> <list> | <ban> <id>',
    description: 'Banir membros e checagem de bans',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        let IdChannel = db.get(`Servers.${message.guild.id}.LogChannel`)

        let reason = args.slice(1).join(" ")
        if (!reason) reason = 'Sem motivo informado'

        if (['lista', 'list', 'histórico', 'historico'].includes(args[0])) {

            message.guild.bans.fetch().then(banned => {
                let list = banned.map(user => `${user.user.tag} \`${user.user.id}\``).join('\n')

                if (list.length >= 1950) list = `${list.slice(0, 1948)}...`
                if (banned.size === null) { banned.size = '0' }

                const embed = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle(`${e.ModShield} Lista de Banidos`)
                    .setDescription(`${e.Info} | **0 usuários banidos**`)

                if (list) { embed.setDescription(`${e.Info} **${banned.size} usuários banidos**\n${list || 'Não há nada aqui'}`) }
                return message.reply({ embeds: [embed] })
            })

        } else if (!isNaN(args[0])) {

            if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply(`${e.Deny} | Este comando é muito "forte". Então, é privado somente para administradores.`)
            let ID = args[0]
            if (ID.length !== 18) { return message.reply(`${e.Deny} | ID's de usuários possuem 18 digitos, verifique o ID informado.`) }

            message.guild.bans.fetch(ID).then(() => {
                return message.reply(`${e.Deny} | Este ID já está banido.`)
            }).catch(() => {

                return message.reply(`${e.QuestionMark} | Desejar forçar o ban do ID \`${ID}\` ?`).then(msg => {
                    db.set(`User.Request.${message.author.id}`, 'ON')
                    msg.react('✅').catch(err => { }) // e.Check
                    msg.react('❌').catch(err => { }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 20000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            db.delete(`User.Request.${message.author.id}`)
                            return message.guild.bans.create(ID).then(ban => {
                                IdChannel ? (message.reply(`${e.Check} | Prontinho! Eu mandei as informações no canal <#${IdChannel}>`), Notify(ban, true)) : message.reply(`${e.Check} | Prontinho! Eu não achei o canal de logs no servidor :( Ativa ele ou apenas veja do que ele é capaz -> \`-logs\``)
                            }).catch(err => {
                                return message.channel.send(`${e.Info} | Este usuário não existe ou é dono do servidor ou eu não tenho permissão o suficiente.\n${err}`)
                            })
                        } else {
                            db.delete(`User.Request.${message.author.id}`)
                            msg.edit(`${e.Check} | Request FORCEBAN abortada | ${ID}/${message.author.id}/${message.guild.id}`)
                        }
                    }).catch(() => {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit(`${e.Check} | Request FORCEBAN abortada: Tempo Expirado | ${ID}/${message.author.id}/${message.guild.id}`)
                    })
                })

            })

        } else {

            let user = message.mentions.members.first()
            if (!args[0] || !user) return message.reply(`${e.Info} | Para banir alguém se faz assim \`${prefix}ban @user Motivo do banimento\`\n${e.QuestionMark} | Quer ver a lista de bans do servidor? \`${prefix}ban list\`\n${e.ModShield} | Quer banir usando a força? \`${prefix}ban ID Motivo do banimento\``)
            if (db.get(`System.Whitelist.${user.id}`)) { return message.reply(`${e.Deny} | Este usuário está na minha WhiteList.`) }
            if (user.id === message.author.id) { return message.reply(`${e.Confuse} | Por qual motivo neste mundo você se baniria? Vem ver isso @.everyone! Ele quer se banir`) }
            if (user.id === message.guild.ownerId) { return message.reply(`${e.Deny} | Não dá para banir o dono do servidor, sabia?`) }
            if (user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply(`${e.Deny} | Não posso banir um administrador... Que abuso é esse?`)
            if (!user.bannable) return message.reply(`${e.Confuse} | Por algum motivo eu não posso banir esta pessoa.`)

            return message.reply(`${e.QuestionMark} | ${message.author}, você está prestes a banir ${user} do servidor pelo motivo -> "**${reason}**".\nDeseja prosseguir com o banimento?`).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { }) // e.Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 20000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        user.ban({ days: 7, reason: reason }).then(ban => {
                            db.delete(`User.Request.${message.author.id}`)
                            IdChannel ? (msg.edit(`${e.Check} | Prontinho chefe! Eu mandei as informações no canal <#${IdChannel}>`), Notify(ban, false)) : message.reply(`${e.Check} | Feito! Cof Cof... \`-logs\``)
                        }).catch(err => {
                            db.delete(`User.Request.${message.author.id}`)
                            message.reply(`${e.Attention} | Ocorreu um erro durante o banimento... Caso você não saiba resolver, use o comando \`${prefix}bug\` e relate o problema.\n\`${err}\``)
                        })
                    } else {
                        db.delete(`User.Request.${message.author.id}`)
                        msg.edit(`${e.Check} | Request BAN abortada | ${user.id}/${message.author.id}/${message.guild.id}`)
                    }
                }).catch(() => {
                    db.delete(`User.Request.${message.author.id}`)
                    msg.edit(`${e.Check} | Request BAN abortada: Tempo Expirado | ${user.id}/${message.author.id}/${message.guild.id}`)
                })
            })
        }

        async function Notify(ban, x) {
            let banid = `${ban.user?.tag ?? ban.tag ?? ban}`

            const channel = await client.channels.cache.get(IdChannel)
            if (!channel) return

            const embed = new MessageEmbed()
                .setColor('RED')
                .addFields(
                    { name: '👤 Usuário', value: `${banid} - *\`${ban.id}\`*` },
                    { name: `${e.ModShield} Moderador`, value: `${message.author.tag}` },
                    { name: '📝 Razão', value: `${reason || 'Sem motivo informado'}` },
                    { name: '📅 Data', value: `${Data}` }
                )
                .setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))

            x ? embed.setTitle(`🛰️ | Global System Notification | Forceban`) : embed.setTitle(`🛰️ | Global System Notification | Banimento`)
            x ? embed.setThumbnail(ban.displayAvatarURL({ dynamic: true })) : embed.setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))

            return channel.send({ embeds: [embed] }).catch(err => { })

        }
    }
}