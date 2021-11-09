const ms = require("parse-ms")
const { e } = require('../../../database/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'roubar',
    aliases: ['rob'],
    category: 'economy',
    emoji: `${e.Coin}`,
    usage: '<rob> <@user/ID>',
    description: 'Roube dinheiro da carteira de outras pessoas',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        const RouboInfo = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`${e.Info} | Informações do comando Roubo`)
            .setDescription(`O sistema de roubo da ${client.user.username} é um pouco diferente.\nVocê rouba uma quantia aleatória do valor que o seu alvo possui na **carteira**. E você só tem duas possibilidades.`)
            .addField(`${e.Sirene} | Falha`, `Se a tentativa do roubo falhar, você vai preso e pagará uma fiança. Esta fiança tem o valor de **4x a quantia que você iria roubar**. Sendo assim, quanto maior a quantia, maior o dinheiro que você irá perder.\n~~ O dinheiro será retirado de seu banco.`)
            .addField(`${e.PandaBag} | Sucesso`, `Você receberá uma quantia aleatória do valor que seu alvo possui na carteira, envolve de **1 a 100% do valor**.\n~~O dinheiro será adicionado na sua carteira.`)
            .addField(`${e.Info} | Roubar o Ranking Global`, `Você pode tentar roubar os **Top 10 Globais** usando o ID que é mostrado no \`${prefix}rank money\`.\n~~As regras de falha/sucesso também se aplica nesta categoria.`)
            .addField(`${e.On} | Comando`, `\`${prefix}roubar @user/ID\``)

        if (['help', 'info', 'ajuda'].includes(args[0]?.toLowerCase())) return message.reply({ embeds: [RouboInfo] })

        let timeout = 1200000
        let daily = sdb.get(`Users.${message.author.id}.Timeouts.Roubo`)
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily))
            return message.reply(`${e.Sirene} | ${message.author}, a polícia está em sua busca... Tente novamente em \`${time.minutes}m e ${time.seconds}s\`.`)
        } else {

            if (!isNaN(args[0]) && args[0]) {
                let u = await client.users.cache.get(args[0])
                u ? Rob(u) : message.reply(`${e.Deny} | Não achei ninguém com esse ID.`)
            } else {
                let u = message.mentions.members.first() || message.member
                let user = u.user
                if (user.id === client.user.id) return message.reply(`${e.Nagatoro} | Você realmente quer me roubar?`)
                if (user.id === message.author.id) return message.reply(`${e.Deny} | Tenta assim: \`${prefix}roubar @user/ID\` ou \`${prefix}roubar info\``)
                Rob(user)
            }

            function Rob(u) {

                if (u.id === message.author.id) return message.reply(`${e.Deny} | Vou nem responder isso, ok?`)
                if (u.id === client.user.id) return message.reply(`${e.Nagatoro} | Você realmente quer me roubar?`)
                let usermoney = db.get(`Balance_${u.id}`) || 0
                if (usermoney <= 0) return message.reply(`${e.Deny} | ${u.username} não possui dinheiro na carteira.`)

                let luck = ['true', 'false']
                let result = luck[Math.floor(Math.random() * luck.length)]
                let amount = Math.floor(Math.random() * usermoney * 4) + 1
                let amount1 = Math.floor(Math.random() * usermoney) + 1
                result === 'true' ? win(u) : lose(u)

                function lose(u) {
                    db.subtract(`Balance_${message.author.id}`, amount); sdb.set(`Users.${message.author.id}.Timeouts.Roubo`, Date.now())
                    return message.reply(`${e.Sirene} | A polícia te pegou mas você escapou.\n-${amount} ${Moeda(message)}`)
                }

                function win(u) {
                    db.subtract(`Balance_${u.id}`, amount1); db.add(`Balance_${message.author.id}`, amount1); sdb.set(`Users.${message.author.id}.Timeouts.Roubo`, Date.now())
                    return message.reply(`${e.PandaBag} | Você roubou ${u.username} com sucesso!\n+${amount1} ${Moeda(message)}`)
                }
            }
        }
    }
}

