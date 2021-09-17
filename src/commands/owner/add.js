const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'adicionar',
    aliases: ['add'],
    category: 'owner',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.OwnerCrow}`,
    usage: '<add> <user> <quantia>',
    description: 'Permite ao meu criador adicionar quantias a qualquer um de qualquer item que tenha quantidade',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.members.first() || message.member

        if (['money', 'coins', 'moedas'].includes(args[0])) {

            if (!user) return message.reply('`' + prefix + 'add money @user/args`')

            let amount = args[2]
            if (!amount) { return message.channel.send('`' + prefix + 'add money @user Valor`') }
            if (isNaN(amount)) { return message.channel.send(`${e.Deny} **${args[2]}** não é um número.`) }

            db.add(`Balance_${user.id}`, amount)
            return message.react(e.Check)
        }

    }
}