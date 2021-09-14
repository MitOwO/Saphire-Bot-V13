const ms = require("parse-ms")
const { e } = require('../../../Routes/emojis.json')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'pagar',
    aliases: ['pay', 'transferir'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Coin}`,
    usage: '<pay> <@user> <quantia>',
    description: 'Pague outras pessoas',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        let timeout1 = 9140000
        let author1 = await db.get(`Profile.${message.author.id}.Timeouts.PresoMax`)

        if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
            let time = ms(timeout1 - (Date.now() - author1))

            return message.reply(`${e.Sirene} Você está sob detenção máxima por mais \`${time.hours}h ${time.minutes}m e ${time.seconds}s\` `)
        } else {

            let money = db.get(`Balance_${message.author.id}`) || '0'

            const noargs = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('💸 Sistema de Pagamento')
                .setDescription(`Page a galera, é simples e rápido!\n \n${e.Attention} *Moedas perdidas não serão recuperadas. Cuidado para não ser enganado*`)
                .addField(`${e.Activ} Comando`, `\`${prefix}pay @user quantia\`\n\`${prefix}pay @user all/tudo\``)
                .setFooter('Apenas o dinheiro na carteira será válido para pagamentos.')

            if (request) return message.reply(`${e.Deny} | ${f.Request}`)

            let user = message.mentions.members.first()

            if (args[0] && !user) { return message.reply(`${e.Deny} | Tenta usar assim: \`${prefix}pay @user quantia/all\``) }
            if (!user) { return message.reply({ embeds: [noargs] }) }

            let bot = user.user.bot
            if (user.id === message.author.id) { return message.reply('❌ | Você não pode pagar você mesmo.') }
            if (user.id === client.user.id) { return message.reply(`${e.Deny} | Eu não preciso do seu dinheiro, desculpa.`) }
            if (bot) { return message.reply(`${e.Deny} | Bots não podem receber dinheiro, desculpa.`) }
            if (!args[1]) { return message.reply(`${e.Deny} | Tenta usar assim: \`${prefix}pay @user quantia/all\``) }
            if (args[2]) { return message.reply(`${e.Deny} | Nada além do comando, está bem? \`${prefix}pay @user quantia/all\``) }
            if (['all', 'tudo'].includes(args[1])) args[1] = money
            if (args[1] < 0) { return message.reply(`${e.Deny} | Dinheiro insuficiente.`) }
            if (money < args[1]) { return message.reply(`${e.Deny} | Você precisa ter ${args[1]} ${e.Coin} Moedas na carteira para poder pagar ${user.user.username}.`) }
            if (isNaN(args[1])) { return message.reply(`${e.Deny} | **${args[1]}** | O valor digitado não é um número.`) }

            db.add(`User.${message.author.id}.Caches.Pay`, args[1])
            db.subtract(`Balance_${message.author.id}`, args[1])
            let cache = db.get(`User.${message.author.id}.Caches.Pay`)

            // 
            await message.reply(`${e.QuestionMark} | ${message.author}, você confirma transferir a quantia de **${args[1]} ${e.Coin}Moedas** para ${user}?`).then(msg => {
                msg.react('✅').catch(err => { return }) // Check
                msg.react('❌').catch(err => { return }) // X

                const filter = (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id }

                msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first()

                    if (reaction.emoji.name === '✅') {
                        db.delete(`User.Request.${message.author.id}`)
                        db.add(`Balance_${user.id}`, cache)
                        db.delete(`User.${message.author.id}.Caches.Pay`)
                        msg.edit(`${e.Check} | Transação efetuada com sucesso!\n${message.author.tag}: -${args[1]} ${e.Coin} Moedas\n${user.user.tag}: +${args[1]} ${e.Coin} Moedas`)
                        msg.reactions.removeAll().catch(err => { return })
                    } else {
                        db.delete(`User.Request.${message.author.id}`)
                        db.add(`Balance_${message.author.id}`, cache)
                        db.delete(`User.${message.author.id}.Caches.Pay`)
                        msg.edit(`${e.Deny} | ${message.author} cancelou a transação.`)
                    }
                }).catch(err => {
                    db.delete(`User.Request.${message.author.id}`)
                    db.add(`Balance_${message.author.id}`, cache)
                    db.delete(`User.${message.author.id}.Caches.Pay`)
                    msg.edit(`${e.Deny} | Transação cancelado por tempo excedido.`)
                    message.channel.send(`PRINTA O ERRO AQUI MANO: \n\`${err}\``)
                })

            })
        }
    }
}