const { f } = require('../../../database/frases.json')
const { e } = require('../../../database/emojis.json')
const Error = require('../../../Routes/functions/errors')

// #246FE0 - Azul Saphire
module.exports = {
    name: 'transactions',
    aliases: ['transações', 'extrato', 'transação', 'ts'],
    category: 'economy2',
    ClientPermissions: ['ADD_REACTIONS'],
    emoji: `${e.MoneyWings}`,
    usage: '<transactions> [@user]',
    description: 'Veja o extrato bancário.',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {
        if (request) return message.reply(`${e.Deny} | ${f.Request}${sdb.get(`Request.${message.author.id}`)}`)

        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.mentions.repliedUser || message.author

        let transactions = sdb.get(`Users.${user.id}.Transactions`) || []

        if (user.bot || transactions.length < 1)
            return message.reply(`${e.Deny} | Nenhuma transação foi encontrada.`)

        const embeds = EmbedGenerator()
        const msg = await message.reply({ embeds: [embeds[0]] })
        let EmbedsControl = 0

        if (embeds.length === 1) return

        for (const i of ['◀️', '▶️', '❌']) {
            msg.react(i).catch(() => { return FinishCollector() })
        }

        const LeftFilter = (reaction, user) => { return reaction.emoji.name === '◀️' && user.id === message.author.id }
        const collectorLeft = msg.createReactionCollector({ filter: LeftFilter, time: 30000, errors: ['time'] });

        const RightFilter = (reaction, user) => { return reaction.emoji.name === '▶️' && user.id === message.author.id }
        const collectorRight = msg.createReactionCollector({ filter: RightFilter, time: 30000, errors: ['time'] });

        const CancelFilter = (reaction, user) => { return reaction.emoji.name === '❌' && user.id === message.author.id }
        const collectorCancel = msg.createReactionCollector({ filter: CancelFilter, time: 30000, errors: ['time'] });

        collectorRight.on('collect', () => {

            try {

                EmbedsControl++
                if (!embeds[EmbedsControl]) {
                    EmbedsControl--
                } else {
                    return msg.edit({ embeds: [embeds[EmbedsControl]] }).catch(() => { return FinishCollector() })
                }

            } catch (err) {
                Error(message, err)
            }

        });

        collectorLeft.on('collect', () => {

            try {

                EmbedsControl--
                if (!embeds[EmbedsControl]) {
                    EmbedsControl++
                } else {
                    return msg.edit({ embeds: [embeds[EmbedsControl]] }).catch(() => { return FinishCollector() })
                }

            } catch (err) {
                Error(message, err)
            }

        })

        collectorCancel.on('collect', () => { FinishCollector() });

        function FinishCollector() {
            sdb.delete(`Request.${message.author.id}`)
            collectorLeft.stop()
            collectorRight.stop()
            collectorCancel.stop()
            return msg.edit({ content: `${e.Deny} Comando cancelado.` }).catch(() => { return FinishCollector() })
        }

        function EmbedGenerator() {
            let amount = 10
            let Page = 1
            const embeds = [];
            let AuthorOrUser = user.id === message.author.id ? 'Suas transações' : `Transações de ${user.tag}`

            for (let i = 0; i < transactions.length; i += 10) {

                const current = transactions.slice(i, amount)
                const description = current.map(t => `> \`${t.time}\` ${t.data}`).join("\n")
                let length = parseInt(transactions.length / 10) + 1

                embeds.push({
                    color: 'GREEN',
                    title: `${e.MoneyWings} ${AuthorOrUser} - ${Page}/${length}`,
                    description: `${description}`,
                    footer: {
                        text: `${transactions.length} transações contabilizadas`
                    },
                })
                Page++
                amount += 10
            }

            return embeds;
        }

        function ReactCollection(msg, emoji) {
            return msg.createReactionCollector({
                filter: (reaction, user) => reaction.emoji.name === `${emoji}` && user.id === message.author.id,
                time: 30000,
                errors: ['time']
            });
        }

    }
}
