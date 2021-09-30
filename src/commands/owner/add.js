const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'adicionar',
    aliases: ['add'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    usage: '<add> <@user/id> <quantia>',
    description: 'Permite ao meu criador adicionar quantias a qualquer um de qualquer item que tenha quantidade',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.mentions.repliedUser
        if (!user) return message.channel.send(`${e.Deny} | Usuário não encontrado.`)

        if (['money', 'coins', 'moedas', 'dinheiro'].includes(args[0])) AddMoney()
        if (['vip'].includes(args[0])) AddNewVip()

        function AddNewVip() {
            db.set(`Vip_${user.id}`, true)
            return message.channel.send(`${e.Check} | Feito.`)
        }

        function AddMoney() {
            let amount = args[1]
            if (amount.length === 18) amount = args[2]
            if (amount === message.mentions.users.first()) amount = args[2]
            if (!amount) return message.channel.send(`\`${prefix}add <@user/id> <quantia>\``)
            if (isNaN(amount)) return message.channel.send(`${e.Deny} | **${amount}** | Não é um número.`)
            db.add(`Balance_${user.id}`, amount)
            return message.channel.send(`${e.Check} | Feito.`)
        }

    }
}