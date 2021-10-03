const { e } = require('../../../Routes/emojis.json')
const { g } = require('../../../Routes/Images/gifs.json')
const Colors = require('../../../Routes/functions/colors')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'casar',
    aliases: ['marry'],
    category: '',
    UserPermissions: '',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: '💍',
    usage: '<casar> <@user>',
    description: 'Casamentos são importantes. Para alguns',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.mentions.repliedUser
        let color = Colors(message.member)
        let anel = db.get(`${message.author.id}.Slot.Anel`)

        const noargs = new MessageEmbed()
            .setColor(color)
            .setTitle('💍 Casamento')
            .setDescription(`Você pode se casar no Sistema Saphire.`)
            .addField(`${e.On} Comando`, `\`${prefix}casar @user\``)

        if (!args[0]) return message.reply({ embeds: [noargs] })

        let level = db.get(`level_${user.id}`) || 0
        let levelauthor = db.get(`level_${message.author.id}`) || 0
        if (level < 7 || levelauthor < 7) { return message.reply(`${e.Deny} | O casal deve estar acima do level 7 para se casar.`) }
        if (!anel) return message.reply(`${e.Deny} | Você precisa de um 💍 \`Anel de Casamento\` para se casar.`)

        if (db.get(`${message.author.id}.Perfil.Marry`)) return message.reply(`${e.Deny} | Você já está em um relacionamento, o que você quer por aqui?`)
        if (db.get(`${user.id}.Perfil.Marry`)) return message.reply(`${e.Deny} | ${user} está em um relacionamento.`)
        if (user.id === client.user.id) return message.reply(`${e.Deny} | Já sou casada com o Itachi Uchiha, sai daqui. ${e.Itachi}`)
        if (user.bot) return message.reply(`${e.Deny} | Você não pode se casar com bots`)

        const gif = 'https://imgur.com/Ush7ZDy.gif'

        const casar = new MessageEmbed()
            .setColor(color)
            .setTitle('💍Novo Pedido de Casamento💍')
            .setDescription(`${message.author.username} está pedindo a mão de ${user.user.username} em casamento.\n\n${user}, você aceita se casar com ${message.author}?`)
            .setThumbnail(gif)

        const casados = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`:heart: Um novo casal acaba de se formar :heart:`)
            .setDescription(`${user} aceitou o pedido de casamento de ${message.author}`)
            .setFooter('Anel gasto com sucesso!')

        message.reply(`${e.QuestionMark} | ${message.author}, você irá gastar seu 💍 \`Anel de Casamento\` caso ${user} aceite o pedido. Deseja continuar?`).then(msg1 => {
            db.set(`Request.${message.author.id}`, `${msg1.url}`)
            msg1.react('✅').catch(err => { }) // Check
            msg1.react('❌').catch(err => { }) // X

            const filter = (reaction, u) => { return ['✅', '❌'].includes(reaction.emoji.name) && u.id === message.author.id }

            msg1.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    db.delete(`Request.${message.author.id}`)
                    msg1.delete().catch(() => { })
                    CasarAsk()
                } else {
                    db.delete(`Request.${message.author.id}`)
                    msg1.edit(`${e.Deny} | Request cancelada.`).catch(() => { })
                }
            }).catch(() => {
                db.delete(`Request.${message.author.id}`)
                msg1.edit(`${e.Deny} | Request cancelada.`).catch(() => { })
            })
        })

        function CasarAsk() {
            message.reply({ embeds: [casar] }).then(msg => {
                msg.react('✅').catch(err => { }) // Check
                msg.react('❌').catch(err => { }) // X

                const filter = (reaction, u) => { return ['✅', '❌'].includes(reaction.emoji.name) && u.id === user.id }

                msg.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        db.delete(`${message.author.id}.Slot.Anel`)
                        db.set(`${message.author.id}.Perfil.Marry`, user.id)
                        db.set(`${user.id}.Perfil.Marry`, message.author.id)
                        return msg.edit({ embeds: [casados] }).catch(() => { })
                    } else {
                        msg.delete().catch(err => { })
                        return message.channel.send(`${e.Deny} | Não foi dessa vez, ${message.author}. ${user} recusou seu pedido de casamento.`)
                    }
                }).catch(() => {
                    casar.setColor('RED').setFooter('Tempo expirado')
                    msg.edit({ embeds: [casar] }).catch(err => { })
                    return message.channel.send(`${e.Deny} | Pedido de casamento expirado.`)
                })
            })
        }
    }
}