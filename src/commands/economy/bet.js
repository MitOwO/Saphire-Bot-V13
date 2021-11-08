const { e } = require('../../../database/emojis.json')
const { f } = require('../../../database/frases.json')
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

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)

        const Embed = new MessageEmbed()
            .setColor(Colors(message.member))
            .setTitle('💵 Comando Aposta')
            .setDescription(`Você pode apostar ${Moeda(message)} com todos no chat.`)
            .addField(`${e.Gear} Emojis`, `✅ Force o final da aposta\n💸 Entre na aposta\n❌ Sair da aposta`)
            .addField(`${e.On} Comando`, `\`${prefix}bet [quantia]\` Aposte uma quantia`)

        if (!args[0]) return message.reply({ embeds: [Embed] })

        let quantia = parseInt(args[0].replace(/k/g, '000'))
        if (['all', 'tudo'].includes(args[0]?.toLowerCase())) quantia = parseInt(db.get(`Balance_${message.author.id}`))
        if (isNaN(quantia)) return message.reply(`${e.Deny} | **${args[0]}** | Não é um número`)
        if (args[1]) return message.reply(`${e.Deny} | Por favor, use \`${prefix}bet [quantia/all]\` ou \`${prefix}bet\`, nada além disso, ok?`)
        if (parseInt(db.get(`Balance_${message.author.id}`)) < quantia || quantia <= 0) return message.reply(`${e.Deny} | Você não tem todo esse dinheiro na carteira.`)
        let BetUsers = []
        function BetUsersEmbed() { return BetUsers?.length >= 1 ? BetUsers.map((id) => `<@${id}>`).join('\n') : 'Ninguém' }

        const BetEmbed = new MessageEmbed().setColor('GREEN').setThumbnail('https://imgur.com/k5NKfe8.gif').setTitle(`${message.member.displayName} iniciou uma nova aposta`).setFooter('Limite máximo: 30 participantes')

        if (parseInt(db.get(`Balance_${message.author.id}`)) >= quantia) {
            sdb.add(`Users.${message.author.id}.Cache.BetPrize`, quantia)
            db.subtract(`Balance_${message.author.id}`, quantia)
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

            // const filter = (reaction, user) => { return reaction.emoji.name === '💸' && !user.bot };
            const collector = msg.createReactionCollector({
                filter: (reaction, user) => { return reaction.emoji.name === '💸' && user.id !== client.user.id },
                time: 120000
            });

            const CollectorCancel = msg.createReactionCollector({
                filter: (reaction, user) => { return reaction.emoji.name === '✅' && user.id === message.author.id },
                max: 1,
                time: 120000,
                errors: 'max'
            })

            const RemoveUserFromArray = msg.createReactionCollector({
                filter: (reaction, user) => { return reaction.emoji.name === '❌' && user.id !== client.user.id },
                time: 120000
            })

            for (const emoji of ['✅', '💸', '❌']) {
                msg.react(emoji).catch(e => {
                    return message.channel.send(`${e.Deny} | Houve um erro ao adicionar as reações. Verifique se eu realmente tenho a permissão \`ADICIONAR REAÇÕES\``)
                })
            }

            RemoveUserFromArray.on('collect', (reaction, user) => {
                return RemoveUser(user)

            })

            CollectorCancel.on('collect', () => {
                sdb.delete(`Request.${message.author.id}`)
                collector.stop()
            })

            collector.on('collect', (reaction, user) => {
                if (BetUsers.includes(user.id)) return

                if (db.get(`Balance_${user.id}`) < quantia)
                    return message.channel.send(`${e.Deny} | ${user}, você deve ter pelo menos **${quantia} ${Moeda(message)}** na carteira para entrar na aposta.`)

                db.subtract(`Balance_${user.id}`, quantia)
                sdb.add(`Users.${message.author.id}.Cache.BetPrize`, quantia)
                BetUsers.push(user.id)

                BetEmbed.setDescription(`Valor da aposta: ${quantia} ${Moeda(message)}\n**Participantes**\n${BetUsersEmbed()}\n \n💰 Prêmio acumulado: ${(BetUsers?.length || 0) * quantia}`)
                msg.edit({ embeds: [BetEmbed] }).catch(err => {
                    message.channel.send(`${e.Deny} | Houve um erro ao editar a mensagem da aposta.\n\`${err}\``)
                    collector.stop()
                })
                if (BetUsers.length >= 30) {
                    collector.stop()
                }

            });

            collector.on('end', collected => {
                sdb.delete(`Request.${message.author.id}`)
                Win()
            });

            function Win() {

                if (BetUsers.length <= 0) {

                    const BetEmbedCancel = new MessageEmbed().setColor('RED').setTitle(`${message.member.displayName} fez uma aposta`).setThumbnail('https://imgur.com/k5NKfe8.gif').setDescription(`${BetEmbed.description}\n \n${e.Deny} Essa aposta foi cancelada por não haver participantes suficientes`)
                    msg.edit({ embeds: [BetEmbedCancel] }).catch(() => { Erro() })
                    db.add(`Balance_${message.author.id}`, (sdb.get(`Users.${message.author.id}.Cache.Resgate`) || 0) + (parseInt(sdb.get(`Users.${message.author.id}.Cache.BetPrize`)) || 0))
                    sdb.delete(`Users.${message.author.id}.Cache.Resgate`)
                    sdb.delete(`Users.${message.author.id}.Cache.BetPrize`)
                    sdb.delete(`Users.${message.author.id}.Cache.Bet`)
                    return message.channel.send(`${e.Deny} | ${message.author}, aposta cancelada.\n${e.PandaProfit} | ${db.get(`Balance_${message.author.id}`) || 0} ${Moeda(message)} estão na sua carteira. Use \`${prefix}dep all\` para depositar o dinheiro e não ser roubado*(a)*.`)

                } else {

                    let winner = BetUsers[Math.floor(Math.random() * BetUsers.length)]
                    db.add(`Balance_${winner}`, parseInt(sdb.get(`Users.${message.author.id}.Cache.BetPrize`)) || 0)
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

                db.add(`Balance_${user.id}`, quantia)
                sdb.subtract(`Users.${message.author.id}.Cache.BetPrize`, quantia)
                return
            }

            function Erro() {

                let quantia = sdb.get(`Users.${message.author.id}.Cache.BetPrize`) || 0
                sdb.add(`Users.${message.author.id}.Cache.Resgate`, (sdb.get(`Users.${message.author.id}.Cache.BetPrize`) || 0))
                sdb.set(`Users.${message.author.id}.Cache.BetPrize`, 0)
                sdb.delete(`Request.${message.author.id}`)
                Error(message, err)
                return message.channel.send(`${e.Warn} | Aconteceu algo inesperado. O dinheiro na quantia de ${quantia} ${Moeda(message)} foi adicionado ao cache de ${message.author}. O erro já foi reportado ao meu criador, mas se quiser fazer um reporte, use o comando \`${prefix}bug\`\n\`${err}\``)
            }


        }
    }
}