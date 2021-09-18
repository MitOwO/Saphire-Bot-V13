const ms = require("parse-ms")
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'roubar',
    aliases: ['rob'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<rob> <@user/ID>',
    description: 'Roube dinheiro da carteira de outras pessoas',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const RouboInfo = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`${e.Info} | Informações do comando Roubo`)
            .setDescription(`O sistema de roubo da ${client.user.username} é um pouco diferente.\nVocê rouba uma quantia aleatória do valor que o seu alvo possui na **carteira**. E você só tem duas possibilidades.`)
            .addField(`${e.Sirene} | Falha`, `Se a tentativa do roubo falhar, você vai preso e pagará uma fiança. Esta fiança tem o valor de **4x a quantia que você iria roubar**. Sendo assim, quanto maior a quantia, maior o dinheiro que você irá perder.\nMetade do dinheiro irá para o banco do seu alvo e a outra metade irá para a Loteria.\n~~ O dinheiro será retirado de seu banco.`)
            .addField(`${e.PandaBag} | Sucesso`, `Você receberá uma quantia aleatória do valor que seu alvo possui na carteira, envolve de **1 a 100% do valor**.\n~~O dinheiro será adicionado na sua carteira.`)
            .addField(`${e.Info} | Roubar o Ranking Global`, `Você pode tentar roubar os **Top 10 Globais** usando o ID que é mostrado no \`${prefix}rank money\`.\n~~As regras de falha/sucesso também se aplica nesta categoria.`)
            .addField(`${e.Activ} | Comando`, `\`${prefix}roubar @user/ID\``)

        if (['help', 'info', 'ajuda'].includes(args[0])) return message.reply({ embeds: [RouboInfo] })

        let timeout1 = 9140000
        let author1 = db.get(`User.${message.author.id}.Timeouts.Preso`)

        if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
            let time = ms(timeout1 - (Date.now() - author1))
            return message.reply(`${e.Sirene} Você está sob detenção máxima por mais \`${time.hours}h ${time.minutes}m e ${time.seconds}s\` `)
        } else {

            let timeout = 6000000
            let daily = db.get(`User.${message.author.id}.Timeouts.Roubo`)
            if (daily !== null && timeout - (Date.now() - daily) > 0) {
                let time = ms(timeout - (Date.now() - daily))
                return message.reply(`${e.Deny} | ${message.author}, você já roubou alguém. Para não ser preso, tente novamente em ${time.minutes}m e ${time.seconds}s.`)
            } else {

                let user = message.mentions.members.first() || client.users.cache.get(args[0]) || message.member

                let usermoney = db.get(`Balance_${user.id}`) || 0

                if (user.id === client.user.id) return message.reply(`${e.Nagatoro} | Você realmente quer me roubar?`)
                if (user.id === message.author.id) return message.reply(`${e.Deny} | Tenta assim: \`${prefix}roubar @user/ID\` ou \`${prefix}roubar info\``)
                if (usermoney === 0 || usermoney < 0) return message.reply(`${e.Deny} | ${user.user.username} não possui dinheiro na carteira.`)

                let luck = [true, false]
                let result = luck[Math.floor(Math.random() * luck.length)]
                let amount = Math.floor(Math.random() * usermoney * 4) + 1
                let amount1 = Math.floor(Math.random() * usermoney) + 1

                function lose() {
                    db.subtract(`Bank_${message.author.id}`, amount); db.add(`Loteria.Prize`, amount / 2); db.add(`Bank_${user.id}`, amount / 2); db.set(`User.${message.author.id}.Timeouts.Roubo`, Date.now())
                    return message.reply(`${e.Sirene} | A polícia te pegou e você foi preso!\n-${amount} ${e.Coin}Moedas`)
                }

                function win() {
                    db.subtract(`Balance_${user.id}`, amount1); db.add(`Balance_${message.author.id}`, amount1); db.set(`User.${message.author.id}.Timeouts.Roubo`, Date.now())
                    return message.reply(`${e.PandaBag} | Você roubou ${user.username} com sucesso!\n+${amount1} ${e.Coin}Moedas`)
                }

                result ? win() : lose()
            }
        }
    }
}