const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const Error = require('../../../Routes/functions/errors')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'lance',
    aliases: ['lançar'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.MoneyWings}`,
    usage: '<lance> <quantia>',
    description: 'Lance dinheiro no chat',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let money = db.get(`Balance_${message.author.id}`) || 0
        let cache = db.get(`${message.author.id}.Cache.Resgate`) || 0
        if (db.get(`Request.${message.author.id}.LanceCommand`)) return message.reply(`${e.Deny} | Você está com um lance rolando no momento.\nLance Link: ${db.get(`Request.${message.author.id}.LanceCommand`)}`)

        const Embed = new MessageEmbed()
            .setColor(Colors(message.member))
            .setTitle(`${e.MoneyWings} Comando Lance`)
            .setDescription(`Você pode lançar ${Moeda(message)} no chat para todos tentar pegar.`)
            .addField(`${e.Gear} Emojis`, `✅ Force o sorteio do lance\n💸 Entre e concorra ao lance`)
            .addField(`${e.On} Comandos`, `\`${prefix}lance [quantia]\` Valor mínino: 500 ${Moeda(message)}\n\`${prefix}lance resgate\` Resgate o valor que ficou em cache\n\`${prefix}lance again\` Relance o valor em cache\n\`${prefix}lance all\` Lance todo o dinheiro da carteira a cache`)

        if (!args[0]) return message.reply({ embeds: [Embed] })

        if (['again', 'dnv', 'novamente'].includes(args[0]?.toLowerCase())) {
            if (cache <= 0) {
                return message.reply(`${e.Deny} | Você não tem nada no seu cache.`)
            } else {
                db.add(`${message.author.id}.Prize`, cache)
                db.delete(`${message.author.id}.Cache.Resgate`)
                return Lance(db.get(`${message.author.id}.Prize`))
            }

        }

        if (['all', 'tudo'].includes(args[0]?.toLowerCase())) {
            if (money + cache < 500) {
                return message.reply(`${e.Deny} | Sua carteira mais seu cache não somam o valor mínimo de 500 ${Moeda(message)}.`)
            } else {
                db.add(`${message.author.id}.Prize`, (money + cache))
                db.delete(`${message.author.id}.Cache.Resgate`)
                db.subtract(`Balance_${message.author.id}`, money)
                return Lance(db.get(`${message.author.id}.Prize`))
            }
        }

        let quantia = parseInt(args[0])
        if (quantia < 500) return message.reply(`${e.Deny} | Quantia mínima para lances é de 500 ${Moeda(message)}`)
        if (isNaN(quantia)) return message.reply(`${e.Deny} | **${args[0]}** | Não é um número`)
        if (args[1]) return message.reply(`${e.Deny} | Por favor, use \`${prefix}lance [quantia/all/resgate/again]\` ou \`${prefix}lance\`, nada além disso, ok?`)
        if (money < quantia) return message.reply(`${e.Deny} | Você não tem todo esse dinheiro.`)

        if (money >= quantia) {
            db.add(`${message.author.id}.Prize`, quantia)
            db.subtract(`Balance_${message.author.id}`, quantia)
            return Lance(db.get(`${message.author.id}.Prize`))
        } else {
            return message.reply(`${e.Deny} | Você está usando o comando errado... Tenta \`${prefix}lance\``)
        }

        function Lance(prize) {
            return message.channel.send(`${e.MoneyWings} ${message.author} lançou ${prize} ${Moeda(message)} no chat.`).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                db.delete(`Lance.${message.author.id}`)
                msg.react('✅').catch(() => { })
                msg.react('💸').catch(() => { })

                const filter = (reaction, user) => { return reaction.emoji.name === '💸' && user.id === user.id; };
                const collector = msg.createReactionCollector({ filter, time: 120000 });

                const cancel = (reaction, user) => { return reaction.emoji.name === '✅' && user.id === message.author.id; };
                const CollectorCancel = msg.createReactionCollector({ filter: cancel, max: 1, time: 120000, errors: 'max' })

                collector.on('collect', (reaction, user) => {
                    if (user.id === client.user.id) return
                    if (db.get(`Lance.${message.author.id}`)?.includes(user.id)) return message.channel.send(`${e.Deny} | ${user}, você já entrou no lance.`)
                    db.push(`Lance.${message.author.id}`, `${user.id}`)
                    message.channel.send(`${e.MoneyWings} | ${user} entrou no lance.`)
                });

                collector.on('end', collected => {
                    db.delete(`Request.${message.author.id}.LanceCommand`)
                    Win(prize)
                });

                CollectorCancel.on('collect', collected => {
                    msg.delete().catch(() => { return message.channel.send(`${e.Deny} | Falha ao forçar o sorteio do lance.`) })
                });

                function Win(prize) {
                    if (!db.get(`Lance.${message.author.id}`)) {
                        db.delete(`Lance.${message.author.id}`)
                        msg.edit(`${e.Deny} ${message.author} lançou ${prize} ${Moeda(message)} no chat. | Cancelado`).catch(() => { })
                        db.add(`${message.author.id}.Cache.Resgate`, prize)
                        db.delete(`${message.author.id}.Prize`)
                        return message.channel.send(`${e.Deny} | Lance cancelado.\n${e.PandaProfit} ${db.get(`${message.author.id}.Cache.Resgate`) || 0} ${Moeda(message)} estão no cache. Use \`${prefix}resgate\` para resgatar o dinheiro ou \`${prefix}lance again\` para lançar ${db.get(`${message.author.id}.Cache.Resgate`)} ${Moeda(message)}.`)
                    } else {
                        let winner = db.get(`Lance.${message.author.id}`)[Math.floor(Math.random() * db.get(`Lance.${message.author.id}`).length)]
                        db.add(`${winner}.Cache.Resgate`, prize)
                        db.delete(`${message.author.id}.Prize`)
                        message.channel.send(`${e.MoneyWings} | <@${winner}> pegou o ${prize} ${Moeda(message)} lançado por ${message.author}\n${e.SaphireObs} | <@${winner}>, você possui ${(db.get(`${winner}.Cache.Resgate`) || 0)} ${Moeda(message)} no cache. Use \`${prefix}resgate\` para resgatar o prêmio ou \`${prefix}lance again\` para lançar ${db.get(`${winner}.Cache.Resgate`) || 0} ${Moeda(message)}.`).catch(() => { })
                        db.delete(`Lance.${message.author.id}`)
                        return msg.edit(`${e.Check} ${message.author} lançou ${prize} ${Moeda(message)} no chat. | <@${winner}> levou este lance.`).catch(() => { })
                    }
                }

            }).catch(err => {
                db.delete(`Request.${message.author.id}.LanceCommand`)
                db.add(`${message.author.id}.Cache.Resgate`, db.get(`${message.author.id}.Prize`))
                db.delete(`${message.author.id}.Prize`)
                Error(message, err)
                return message.channel.send(`${e.Warn} | Aconteceu algo inesperado.\n\`${err}\``)
            })
        }
    }
}