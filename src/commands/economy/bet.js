const { e } = require('../../../database/emojis.json')
const { f } = require('../../../database/frases.json')
const Moeda = require('../../../Routes/functions/moeda')
const Error = require('../../../Routes/functions/errors')
const Colors = require('../../../Routes/functions/colors')
const { PushTrasaction } = require('../../../Routes/functions/transctionspush')

module.exports = {
    name: 'bet',
    aliases: ['apostar', 'aposta'],
    category: 'economy',
    ClientPermissions: ['ADD_REACTIONS'],
    emoji: '💵',
    usage: '<bet> <quantia>',
    description: 'Aposte dinheiro no chat',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)
        if (db.get(`Aposta.${message.author.id}`))
            return message.reply(`${e.Deny} | Você já está com uma aposta aberta. Aqui esta o link: ${db.get(`Aposta.${message.author.id}`)}`)

        const Embed = new MessageEmbed()
            .setColor(Colors(message.member))
            .setTitle('💵 Comando Aposta')
            .setDescription(`Você pode apostar ${Moeda(message)} com todos no chat.`)
            .addField(`${e.Gear} Emojis`, `✅ Force o final da aposta\n💸 Entre na aposta\n❌ Sair da aposta`)
            .addField(`${e.On} Comando`, `\`${prefix}bet [quantia]\` Aposte uma quantia`)

        if (!args[0]) return message.reply({ embeds: [Embed] })

        let quantia = parseInt(args[0].replace(/k/g, '000'))
        if (['all', 'tudo'].includes(args[0]?.toLowerCase())) quantia = parseInt(sdb.get(`Users.${message.author.id}.Balance`))
        if (isNaN(quantia)) return message.reply(`${e.Deny} | **${args[0]}** | Não é um número`)
        if (args[1]) return message.reply(`${e.Deny} | Por favor, use \`${prefix}bet [quantia/all]\` ou \`${prefix}bet\`, nada além disso, ok?`)
        if (parseInt(sdb.get(`Users.${message.author.id}.Balance`)) < quantia || quantia <= 0) return message.reply(`${e.Deny} | Você não tem todo esse dinheiro na carteira.`)
        let BetUsers = []
        function BetUsersEmbed() { return BetUsers?.length >= 1 ? BetUsers.map((id) => `<@${id}>`).join('\n') : 'Ninguém' }

        const BetEmbed = new MessageEmbed().setColor('GREEN').setThumbnail('https://imgur.com/k5NKfe8.gif').setTitle(`${message.member.displayName} iniciou uma nova aposta`).setFooter('Limite máximo: 30 participantes')

        if (parseInt(sdb.get(`Users.${message.author.id}.Balance`)) >= quantia) {
            sdb.add(`Users.${message.author.id}.Cache.BetPrize`, quantia)
            sdb.subtract(`Users.${message.author.id}.Balance`, quantia)
            PushTrasaction(
                message.author.id,
                `💰 Apostou ${quantia || 0} Moedas no comando bet`
            )
            BetUsers.push(message.author.id)
            return BetInit()
        } else {
            return message.reply(`${e.Deny} | Você está usando o comando errado... Tenta \`${prefix}bet\``)
        }

        async function BetInit() {

            BetEmbed
                .setDescription(`Valor da aposta: ${quantia} ${Moeda(message)}\n**Participantes**\n${BetUsersEmbed()}\n \n💰 Prêmio acumulado: ${(BetUsers?.length || 0) * quantia}`)
                .addField('⠀', `✅ Encerrar | 💸 Apostar | ❌ Sair da aposta`)

            const msg = await message.channel.send({ embeds: [BetEmbed] })
            sdb.set(`Request.${message.author.id}`, `${msg.url}`)
            db.set(`Aposta.${message.author.id}`, `${msg.url}`)

            const collector = msg.createReactionCollector({
                filter: (reaction, user) => ['✅', '💸', '❌'].includes(reaction.emoji.name),
                time: 120000
            });

            for (const emoji of ['✅', '💸', '❌']) {
                msg.react(emoji).catch(() => { })
            }

            collector.on('collect', (reaction, user) => {

                if (reaction.emoji.name === '✅' && user.id === message.author.id) {
                    sdb.delete(`Request.${message.author.id}`)
                    collector.stop()
                }

                if (reaction.emoji.name === '💸' && user.id !== client.user.id) {

                    if (BetUsers.includes(user.id)) return

                    if (sdb.get(`Users.${user.id}.Balance`) < quantia)
                        return message.channel.send(`${e.Deny} | ${user}, você deve ter pelo menos **${quantia} ${Moeda(message)}** na carteira para entrar na aposta.`)

                    sdb.subtract(`Users.${user.id}.Balance`, quantia)
                    sdb.add(`Users.${message.author.id}.Cache.BetPrize`, quantia)
                    PushTrasaction(
                        user.id,
                        `💰 Apostou ${quantia || 0} Moedas no comando bet`
                    )
                    BetUsers.push(user.id)

                    BetEmbed.setDescription(`Valor da aposta: ${quantia} ${Moeda(message)}\n**Participantes**\n${BetUsersEmbed()}\n \n💰 Prêmio acumulado: ${(BetUsers?.length || 0) * quantia}`)
                    msg.edit({ embeds: [BetEmbed] }).catch(err => {
                        message.channel.send(`${e.Deny} | Houve um erro ao editar a mensagem da aposta.\n\`${err}\``)
                        collector.stop()
                    })
                    if (BetUsers.length >= 30) {
                        collector.stop()
                    }
                }

                if (reaction.emoji.name === '❌' && user.id !== client.user.id)
                    return RemoveUser(user)

            })

            collector.on('end', () => {
                sdb.delete(`Request.${message.author.id}`)
                db.delete(`Aposta.${message.author.id}`)
                Win()
            });

            function Win() {

                if (BetUsers.length <= 0) {

                    const BetEmbedCancel = new MessageEmbed().setColor('RED').setTitle(`${message.member.displayName} fez uma aposta`).setThumbnail('https://imgur.com/k5NKfe8.gif').setDescription(`${BetEmbed.description}\n \n${e.Deny} Essa aposta foi cancelada por não haver participantes suficientes`)
                    msg.edit({ embeds: [BetEmbedCancel] }).catch(() => { Erro() })
                    parseInt(sdb.get(`Users.${message.author.id}.Cache.Resgate`)) + parseInt(sdb.get(`Users.${message.author.id}.Cache.BetPrize`)) > 0
                        ? (() => {
                            sdb.add(`Users.${message.author.id}.Balance`, (sdb.get(`Users.${message.author.id}.Cache.Resgate`) || 0) + (parseInt(sdb.get(`Users.${message.author.id}.Cache.BetPrize`)) || 0))
                            PushTrasaction(
                                message.author.id,
                                `💰 Recebeu de volta ${(sdb.get(`Users.${message.author.id}.Cache.Resgate`) || 0) + (parseInt(sdb.get(`Users.${message.author.id}.Cache.BetPrize`)))} Moedas no comando bet`
                            )
                        })()
                        : null
                    sdb.delete(`Users.${message.author.id}.Cache.Resgate`)
                    sdb.delete(`Users.${message.author.id}.Cache.BetPrize`)
                    sdb.delete(`Users.${message.author.id}.Cache.Bet`)
                    return message.channel.send(`${e.Deny} | ${message.author}, aposta cancelada.\n${e.PandaProfit} | ${sdb.get(`Users.${message.author.id}.Balance`) || 1} ${Moeda(message)} estão na sua carteira. Use \`${prefix}dep all\` para depositar o dinheiro e não ser roubado*(a)*.`)

                } else {

                    let winner = BetUsers[Math.floor(Math.random() * BetUsers.length)]
                    parseInt(sdb.get(`Users.${message.author.id}.Cache.BetPrize`)) > 0 ? sdb.add(`Users.${winner}.Balance`, parseInt(sdb.get(`Users.${message.author.id}.Cache.BetPrize`))) : null
                    PushTrasaction(
                        winner,
                        `💰 Recebeu ${parseInt(sdb.get(`Users.${message.author.id}.Cache.BetPrize`)) || 0} Moedas no comando bet`
                    )
                    message.channel.send(`${e.MoneyWings} | <@${winner}> ganhou a aposta no valor de **${sdb.get(`Users.${message.author.id}.Cache.BetPrize`)} ${Moeda(message)}** iniciada por ${message.author}. Use \`${prefix}dep all\` para depositar o dinheiro e não ser roubado*(a)*.`).catch(() => { Erro() })
                    sdb.delete(`Users.${message.author.id}.Cache.BetPrize`)
                    const NewWinner = new MessageEmbed().setColor('RED').setTitle(`${message.member.displayName} fez uma aposta`).setThumbnail('https://imgur.com/k5NKfe8.gif').setDescription(`${BetEmbed.description}\n \n🏆 <@${winner}> ganhou a aposta`)
                    return msg.edit({ embeds: [NewWinner] }).catch(() => { Erro() })

                }
            }

            function RemoveUser(user) {
                if (!BetUsers.includes(user.id)) return

                BetUsers.splice(BetUsers.indexOf(user.id), 1)
                BetEmbed.setDescription(`Valor da aposta: ${quantia} ${Moeda(message)}\n**Participantes**\n${BetUsersEmbed()}\n \n💰 Prêmio acumulado: ${(BetUsers?.length || 0) * (quantia || 0)}`)
                msg.edit({ embeds: [BetEmbed] }).catch(() => { })

                sdb.add(`Users.${user.id}.Balance`, quantia)
                PushTrasaction(
                    user.id,
                    `💰 Recebeu de volta ${quantia || 0} Moedas no comando bet`
                )
                sdb.subtract(`Users.${message.author.id}.Cache.BetPrize`, quantia)
                return
            }

            function Erro() {

                let quantia = sdb.get(`Users.${message.author.id}.Cache.BetPrize`) || 0
                sdb.add(`Users.${message.author.id}.Cache.Resgate`, (sdb.get(`Users.${message.author.id}.Cache.BetPrize`) || 0))
                PushTrasaction(
                    message.author.id,
                    `💰 Recebeu ${quantia || 0} Moedas por erro no comando bet`
                )
                sdb.set(`Users.${message.author.id}.Cache.BetPrize`, 0)
                sdb.delete(`Request.${message.author.id}`)
                Error(message, err)
                return message.channel.send(`${e.Warn} | Aconteceu algo inesperado. O dinheiro na quantia de ${quantia} ${Moeda(message)} foi adicionado ao cache de ${message.author}. O erro já foi reportado ao meu criador, mas se quiser fazer um reporte, use o comando \`${prefix}bug\`\n\`${err}\``)
            }

        }
    }
}