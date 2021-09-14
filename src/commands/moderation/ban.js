const { e } = require('../../../Routes/emojis.json')
const { Permissions } = require('discord.js')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'ban',
    aliases: ['banir'],
    category: 'moderation',
    UserPermissions: 'BAN_MEMBERS',
    ClientPermissions: 'BAN_MEMBERS',
    emoji: `${e.ModShield}`,
    usage: '<ban> <@user> [Motivo] | <ban> <list> | <ban> <id>',
    description: 'Banir membros e checagem de bans',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}`)
        let user = message.mentions.members.first()
        let logchannel = db.get(`Servers.${message.guild.id}.LogChannel`)

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
                    msg.react('✅').catch(err => { return }) // e.Check
                    msg.react('❌').catch(err => { return }) // X

                    const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                    msg.awaitReactions({ filter, max: 1, time: 20000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first()

                        if (reaction.emoji.name === '✅') {
                            db.delete(`User.Request.${message.author.id}`)
                            return message.guild.bans.create(ID)
                                .then(banInfo => { return message.reply(`${e.Check} | Forceban concluido! -> Banido: ${banInfo.user?.tag ?? banInfo.tag ?? banInfo}`) })
                                .catch(err => {
                                    return message.channel.send(`${e.Info} | Este usuário não existe ou é dono do servidor ou eu não tenho permissão o suficiente.`)
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

            if (!args[0]) { return message.reply(`${e.Info} | Para banir alguém se faz assim \`${prefix}ban @user Motivo do banimento\`\n${e.QuestionMark} | Quer ver a lista de bans do servidor? \`${prefix}ban list\`\n${e.ModShield} | Quer banir usando a força? \`${prefix}ban ID Motivo do banimento\``) }
            if (!user) { return message.reply(`${e.Info} | Para banir alguém, basta usar assim \`${prefix}ban @user Motivo do banimento\`\n${e.QuestionMark} | Quer ver a lista de bans do servidor? \`${prefix}ban list\`\n${e.ModShield} | Quer banir usando a força? \`${prefix}ban ID Motivo do banimento\``) }
            if (db.get(`System.Whitelist.${user.id}`)) { return message.reply(`${e.Deny} | Este usuário está na minha WhiteList.`) }
            if (user.id === message.author.id) { return message.reply(`${e.Confuse} | Por qual motivo neste mundo você se baniria? Vem ver isso @.everyone! Ele quer se banir`) }
            if (user.id === message.guild.ownerId) { return message.reply(`${e.Deny} | Não dá para banir o dono do servidor, sabia?`) }
            if (user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply(`${e.Deny} | Não posso banir um administrador... Que abuso é esse?`)
            if (!user.bannable) return message.reply(`${e.Confuse} | Por algum motivo eu não posso banir esta pessoa.`)

            let reason = `${message.author.tag} diz: ${args.slice(1).join(" ")}`
            if (reason === `${message.author.tag} diz: `) { reason = `${message.author.tag} não especificou nenhuma razão.` }
            let msgreason = args.slice(1).join(" ")
            if (!msgreason) msgreason = 'Sem motivo especificado'

            return message.reply(`${e.QuestionMark} | ${message.author}, você está prestes a banir ${user} do servidor pelo motivo -> "**${msgreason}**".\nDeseja prosseguir com o banimento?`).then(msg => {
                db.set(`User.Request.${message.author.id}`, 'ON')
                msg.react('✅').catch(err => { return }) // e.Check
                msg.react('❌').catch(err => { return }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 20000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        let Name = user.user.tag
                        user.ban({ days: 7, reason: reason }).then(() => {
                            db.delete(`User.Request.${message.author.id}`)
                            return message.reply(`${e.Check} | Feito! De brinde, eu apaguei as mensagens de ${Name} dos últimos 7 dias, ok?`).then(() => {
                                const canal = client.channels.cache.get(logchannel)
                                if (!canal) {
                                    message.channel.sendTyping().then(() => {
                                        setTimeout(() => {
                                            db.delete(`User.Request.${message.author.id}`)
                                            message.channel.send(`${e.Drinking} | Parece que esse maravilhoso servidor não tem o meu sistema log ativado... #Chateada...\n\`${prefix}setlogchannel\``)
                                        }, 5000)
                                    })
                                }
                            })
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
    }
}