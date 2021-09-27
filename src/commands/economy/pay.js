const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'pagar',
    aliases: ['pay', 'transferir'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Coin}`,
    usage: '<pay> <@user> <quantia/all>',
    description: 'Pague outras pessoas',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let money = db.get(`Balance_${message.author.id}`) || '0'

        const noargs = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('💸 Sistema de Pagamento')
            .setDescription(`Pague a galera, é simples e rápido!\n \n${e.Warn} *Dinheiro perdido não serão recuperados. Cuidado para não ser enganado*`)
            .addField(`${e.On} Comando`, `\`${prefix}pay @user quantia\`\n\`${prefix}pay @user all/tudo\``)
            .setFooter('Apenas o dinheiro na carteira será válido para pagamentos.')

        if (request) return message.reply(`${e.Deny} | ${f.Request}${db.get(`Request.${message.author.id}`)}`)

        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.get(args[1]) || message.mentions.repliedUser
        if (!isNaN(args[0]) && !user) return message.reply(`${e.Deny} | Eu não encontrei ninguém com esse ID...`)
        if (!user) return message.reply({ embeds: [noargs] })
        if (user.id === client.user.id) return message.reply(`${e.HiNagatoro} | Preciso não coisa fofa, eu já sou rica.`)
        if (user.id === message.author.id) return message.reply(`${e.Deny} | Nada de pagar você mesmo.`)
        if (user.bot) return message.reply(`${e.Deny} | Nada de bots.`)

        let quantia = args[1]
        !isNaN(quantia) ? (quantia = args[1]) : (quantia = args[0])
        if (client.users.cache.get(args[0])) { quantia = args[1] || 0 }
        if (client.users.cache.get(args[1])) { quantia = args[0] || 0 }
        if (['all', 'tudo'].includes(args[0]?.toLowerCase()) || ['all', 'tudo'].includes(args[1]?.toLowerCase())) quantia = money || 0
        if (!quantia) return message.reply(`${e.Deny} | Só faltou dizer o valor do pagamento`)
        if (isNaN(quantia)) return message.reply(`${e.Deny} | **${quantia}** | A quantia deve ser um número.`)
        if (quantia > money) return message.reply(`${e.Deny} | Você não tem essa quantia na sua carteira.`)
        if (quantia <= 0) return message.reply(`${e.Deny} | Você não pode fazer um pagamento menor que 1 ${Moeda(message)}, baaaaka.`)

        db.add(`${message.author.id}.Cache.Pay`, parseInt(quantia))
        db.subtract(`Balance_${message.author.id}`, parseInt(quantia))
        let cache = db.get(`${message.author.id}.Cache.Pay`)

        await message.reply(`${e.QuestionMark} | ${message.author}, você confirma pagar a quantia de **${quantia} ${Moeda(message)}** para ${user.username}?`).then(msg => {
            msg.react('✅').catch(err => { }) // Check
            msg.react('❌').catch(err => { }) // X

            const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    db.delete(`Request.${message.author.id}`)
                    db.add(`Balance_${user.id}`, cache)
                    db.delete(`${message.author.id}.Cache.Pay`)
                    msg.edit(`${e.Check} | Transação efetuada com sucesso!\n${e.PandaProfit} Panda Profit Stats\n${message.author.tag}: -${parseInt(quantia)} ${Moeda(message)}\n${user.tag}: +${quantia} ${Moeda(message)}`).catch(err => { })
                    msg.reactions.removeAll().catch(err => { })
                } else {
                    db.delete(`Request.${message.author.id}`)
                    db.add(`Balance_${message.author.id}`, cache)
                    db.delete(`${message.author.id}.Cache.Pay`)
                    msg.edit(`${e.Deny} | ${message.author} cancelou a transação.`).catch(err => { })
                }
            }).catch(err => {
                db.delete(`Request.${message.author.id}`)
                db.add(`Balance_${message.author.id}`, cache)
                db.delete(`${message.author.id}.Cache.Pay`)
                msg.edit(`${e.Deny} | Transação cancelado por tempo excedido.`).catch(err => { })
            })
        })
    }
}