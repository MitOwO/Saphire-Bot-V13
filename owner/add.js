const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'adicionar',
    aliases: ['add'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    usage: '<add> <class> <@user/id> <value>',
    description: 'Permite ao meu criador adicionar qualquer quantia de qualquer item a qualquer usuário',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let u = message.mentions.members.first() || message.mentions.repliedUser || client.users.cache.get(args[0]) || client.users.cache.get(args[1]) || message.member
        let user = client.users.cache.get(u.id)

        let amount = args[2]
        if (client.users.cache.get(args[1])) amount = parseInt(args[2])
        if (client.users.cache.get(args[2])) amount = parseInt(args[1])
        if (message.mentions.members.first()) amount = parseInt(args[2])
        if (message.mentions.repliedUser) amount = parseInt(args[1])
        if (user.id === message.author.id) amount = parseInt(args[1])

        // NO USERS
        if (['commands', 'comandos', 'comando'].includes(args[0])) return AddCommands()

        if (!user) return message.channel.send(`${e.Deny} | Usuário não encontrado.`)
        if (user.bot) return message.channel.send(`${e.Deny} | No bots.`)

        if (['money', 'coins', 'moedas', 'dinheiro'].includes(args[0])) return AddMoney()
        if (['banco', 'bank'].includes(args[0])) return AddBank()
        if (['bônus', 'bonus'].includes(args[0])) return AddBonus()
        if (['vip'].includes(args[0])) return SetNewVip()
        if (['mod', 'moderador'].includes(args[0])) return SetNewSystemModerator()
        if (['bughunter'].includes(args[0])) return SetNewBugHunter()
        if (['designer'].includes(args[0])) return SetNewDesigner()
        if (['developer', 'dev'].includes(args[0])) return SetNewDeveloper()
        return message.reply(`${e.Deny} | **${args[0]}** | Não é um argumento válido.`)

        function SetNewVip() {
            if (db.get(`Vip_${user.id}`)) return message.channel.send(`${e.Info} | Este usuário já é VIP.`)
            db.set(`Vip_${user.id}`, true)
            user.send(`${e.VipStar} | Você agora é **VIP**! Quer ver as vantagens dos membros vips? Use \`${prefix}vip vantagens\` e veja tudo o que você liberou!`).catch(() => { message.reply(`${e.Deny} | Não foi possível contactar este usuário.`) })
            return message.channel.send(`${e.Check} | ${user.username} agora é VIP!`)
        }

        function AddMoney() {
            if (!amount) return message.channel.send(`-> \`${prefix}add money <@user/id> <quantia>\``)
            if (isNaN(amount)) return message.channel.send(`${e.Deny} | **${amount}** | Não é um número.`)
            db.add(`Balance_${user.id}`, amount)
            return message.channel.send(`${e.Check} | Feito.`)
        }

        function AddBank() {
            if (!amount) return message.channel.send(`-> \`${prefix}add bank <@user/id> <quantia>\``)
            if (isNaN(amount)) return message.channel.send(`${e.Deny} | **${amount}** | Não é um número.`)
            db.add(`Bank_${user.id}`, amount)
            return message.channel.send(`${e.Check} | Feito.`)
        }

        function AddBonus() {
            if (!amount) return message.channel.send(`-> \`${prefix}add bonus <@user/id> <quantia>\``)
            if (isNaN(amount)) return message.channel.send(`${e.Deny} | **${amount}** | Não é um número.`)
            db.add(`${user.id}.Cache.Resgate`, amount)
            user.send(`${e.SaphireFeliz} | Você recebeu um bônus de **${amount} ${Moeda(message)}**. Parabéns!`).catch(() => { message.reply(`${e.Deny} | Não foi possível contactar este usuário.`) })
            return message.channel.send(`${e.Check} | Feito.`)
        }

        function AddCommands() {
            if (!amount) return message.channel.send(`-> \`${prefix}add commands <quantia>\``)
            if (isNaN(amount)) return message.channel.send(`${e.Deny} | **${amount}** | Não é um número.`)
            db.add(`ComandosUsados`, amount)
            return message.channel.send(`${e.Check} | ${db.get(`ComandosUsados`)}`)
        }

        function SetNewSystemModerator() {
            if (db.get(`Moderadores.${user.id}`) === user.id)
                return message.channel.send(`${e.Info} | ${user.username} já é um moderador*(a)*.`)

            db.set(`Moderadores.${user.id}`, user.id)
            user.send(`Parabéns! Você agora é um **${e.ModShield} Official Moderator** no meu sistema.`).catch(() => { })
            return message.channel.send(`${e.Check} | ${user.username} agora é um moderador*(a)*.`)
        }

        function SetNewBugHunter() {
            if (db.get(`BugHunter.${user.id}`))
                return message.channel.send(`${e.Info} | ${user.username} já é um Bug Hunter.`)

            db.set(`BugHunter.${user.id}`, true)
            user.send(`Parabéns! Você adquiriu o título **${e.Gear} Bug Hunter**.`).catch(() => { })
            return message.channel.send(`${e.Check} | ${user.username} agora é um Bug Hunter!`)
        }

        function SetNewDesigner() {
            if (db.get(`OfficialDesigner.${user.id}`))
                return message.channel.send(`${e.Info} | ${user.username} já é um Designer Official & Emojis Productor.`)

            db.set(`OfficialDesigner.${user.id}`, true)
            user.send(`Parabéns! Você adquiriu o título **${e.SaphireFeliz} **Designer Official & Emojis Productor****.`).catch(() => { })
            return message.channel.send(`${e.Check} | ${user.username} agora é um Designer Official & Emojis Productor`)
        }

        function SetNewDeveloper() {
            if (db.get(`Developer.${user.id}`))
                return message.channel.send(`${e.Info} | ${user.username} já é um Developer.`)

            db.set(`Developer.${user.id}`, true)
            user.send(`Parabéns! Você adquiriu o título **${e.OwnerCrow} **Official Developer****.`).catch(() => { })
            return message.channel.send(`${e.Check} | ${user.username} agora é um Developer!`)
        }
    }
}