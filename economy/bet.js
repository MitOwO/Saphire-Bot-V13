const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const Error = require('../../../Routes/functions/errors')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'bet',
    aliases: ['apostar', 'aposta'],
    category: 'economy',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: '💵',
    usage: '<bet> <quantia>',
    description: 'Aposte dinheiro no chat',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let money = db.get(`Balance_${message.author.id}`) || 0
        let cache = db.get(`${message.author.id}.Cache.Resgate`) || 0
        if (db.get(`BetRequest.${message.author.id}`)) return message.reply(`${e.Deny} | Você está com uma aposta rolando no momento.\nBet Link: ${db.get(`BetRequest.${message.author.id}`)}`)

        const Embed = new MessageEmbed()
            .setColor(Colors(message.member))
            .setTitle('💵 Comando Aposta')
            .setDescription(`Você pode apostar ${Moeda(message)} com todos no chat.`)
            .addField(`${e.Gear} Emojis`, `✅ Force o final da aposta\n💸 Entre na aposta`)
            .addField(`${e.On} Comando`, `\`${prefix}bet [quantia]\` Aposte uma quantia`)

        if (!args[0]) return message.reply({ embeds: [Embed] })

        let quantia = parseInt(args[0])
        if (['all', 'tudo'].includes(args[0]?.toLowerCase())) quantia = money
        if (isNaN(quantia)) return message.reply(`${e.Deny} | **${args[0]}** | Não é um número`)
        if (args[1]) return message.reply(`${e.Deny} | Por favor, use \`${prefix}bet [quantia]\` ou \`${prefix}bet\`, nada além disso, ok?`)
        if (money < quantia || quantia <= 0) return message.reply(`${e.Deny} | Você não tem todo esse dinheiro na carteira.`)

        const BetEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setThumbnail('https://imgur.com/k5NKfe8.gif')
            .setTitle(`${message.member.displayName} iniciou uma nova aposta`)

        if (money >= quantia) {
            db.add(`${message.author.id}.BetPrize`, quantia)
            db.subtract(`Balance_${message.author.id}`, quantia)
            db.push(`Bet.${message.author.id}`, `${message.author.id}`)
            return BetInit(quantia)
        } else {
            message.reply(`${e.Deny} | Você está usando o comando errado... Tenta \`${prefix}lance\``)
        }

        function BetInit(prize) {

            BetEmbed
                .setDescription(`Valor da aposta: ${prize} ${Moeda(message)}\n**Participantes**\n${message.author}\n`)
                .addField('⠀', `✅ Encerrar | 💸 Apostar`)

            return message.channel.send({ embeds: [BetEmbed] }).then(msg => {
                db.set(`Request.${message.author.id}`, `${msg.url}`)
                db.set(`BetRequest.${message.author.id}`, `${msg.url}`)
                msg.react('✅').catch(() => { })
                msg.react('💸').catch(() => { })

                const filter = (reaction, user) => { return reaction.emoji.name === '💸' && user.id === user.id; };
                const collector = msg.createReactionCollector({ filter, time: 120000 });

                const cancel = (reaction, user) => { return reaction.emoji.name === '✅' && user.id === message.author.id; };
                const CollectorCancel = msg.createReactionCollector({ filter: cancel, max: 1, time: 120000, errors: 'max' })

                CollectorCancel.on('collect', collected => {
                    db.delete(`Request.${message.author.id}`)
                    db.delete(`BetRequest.${message.author.id}`)
                    collector.stop()
                    // msg.delete().catch(() => { return message.channel.send(`${e.Deny} | Falha ao forçar o sorteio do lance.`) })
                });

                collector.on('collect', (reaction, user) => {
                    if (user.id === client.user.id) return
                    if (db.get(`Bet.${message.author.id}`)?.includes(user.id)) return

                    if (db.get(`Balance_${user.id}`) < quantia) return message.channel.send(`${e.Deny} | ${user}, você deve ter pelo menos ${prize} ${Moeda(message)} na carteira para entrar na aposta.`)

                    db.add(`${message.author.id}.BetPrize`, quantia)
                    db.subtract(`Balance_${user.id}`, quantia)
                    db.push(`Bet.${message.author.id}`, `${user.id}`)

                    let desc = BetEmbed.description
                    BetEmbed.setDescription(`${desc}${user}\n`)
                    msg.edit({ embeds: [BetEmbed] }).catch(() => { })
                    message.channel.send(`${e.MoneyWings} | ${user} entrou na aposta aumentando o prêmio para **${db.get(`${message.author.id}.BetPrize`)} ${Moeda(message)}**`)

                });

                collector.on('end', collected => {
                    db.delete(`Request.${message.author.id}`)
                    db.delete(`BetRequest.${message.author.id}`)
                    Win(db.get(`${message.author.id}.BetPrize`))
                });

                function Win(prize) {
                    if (db.get(`Bet.${message.author.id}`).length <= 1) {
                        db.delete(`Bet.${message.author.id}`)
                        const BetEmbedCancel = new MessageEmbed().setColor('RED').setTitle(`${message.member.displayName} fez uma aposta`).setThumbnail('https://imgur.com/k5NKfe8.gif').setDescription(`${BetEmbed.description} \n${e.Deny} Essa aposta foi cancelada por não haver participantes`)
                        msg.edit({ embeds: [BetEmbedCancel] }).catch(() => { })
                        db.add(`${message.author.id}.Cache.Resgate`, prize)
                        db.get(`${message.author.id}.BetPrize`) ? db.delete(`${message.author.id}.BetPrize`) : ''
                        return message.channel.send(`${e.Deny} | ${message.author}, aposta cancelada.\n${e.PandaProfit} | ${db.get(`${message.author.id}.Cache.Resgate`) || 0} ${Moeda(message)} estão no cache. Use \`${prefix}resgate\` para resgatar o dinheiro.`)
                    } 
                    
                    if (db.get(`Bet.${message.author.id}`).length >= 2) {
                        let winner = db.get(`Bet.${message.author.id}`)[Math.floor(Math.random() * db.get(`Bet.${message.author.id}`).length)]
                        db.add(`${winner}.Cache.Resgate`, prize)
                        db.get(`${message.author.id}.BetPrize`) ? db.delete(`${message.author.id}.BetPrize`) : ''
                        message.channel.send(`${e.MoneyWings} | <@${winner}> ganhou a aposta no valor de ${prize} ${Moeda(message)} iniciada por ${message.author}\n${e.PandaProfit} | <@${winner}>, você possui ${(db.get(`${winner}.Cache.Resgate`) || 0)} ${Moeda(message)} no cache. Use \`${prefix}resgate\` para resgatar o dinheiro.`).catch(err => { })
                        db.delete(`Bet.${message.author.id}`)
                        const NewWinner = new MessageEmbed().setColor('RED').setTitle(`${message.member.displayName} fez uma aposta`).setThumbnail('https://imgur.com/k5NKfe8.gif').setDescription(`${BetEmbed.description} \n🏆 <@${winner}> ganhou a aposta`)
                        msg.edit({ embeds: [NewWinner] }).catch(() => { })
                    }
                }

            }).catch(err => {
                db.delete(`BetRequest.${message.author.id}`)
                db.add(`${message.author.id}.Cache.Resgate`, (db.get(`${message.author.id}.BetPrize`) || 0))
                db.get(`${message.author.id}.BetPrize`) ? db.delete(`${message.author.id}.BetPrize`) : ''
                Error(message, err)
                return message.channel.send(`${e.Warn} | Aconteceu algo inesperado.\n\`${err}\``)
            })
        }
    }
}