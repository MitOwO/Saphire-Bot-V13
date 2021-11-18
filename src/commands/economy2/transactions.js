const { f } = require('../../../database/frases.json'),
    { e } = require('../../../database/emojis.json'),
    { Transactions } = require('../../../Routes/functions/database')

module.exports = {
    name: 'transactions',
    aliases: ['transações', 'extrato', 'transação', 'ts'],
    category: 'economy2',
    ClientPermissions: ['ADD_REACTIONS'],
    emoji: `${e.MoneyWings}`,
    usage: '<transactions> [@user]',
    description: 'Veja o extrato bancário.',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.mentions.repliedUser || message.author,
            transactions = Transactions.get(`Transactions.${user.id}`) || []

        if (user.bot || transactions.length < 1)
            return message.reply(`${e.Deny} | Nenhuma transação foi encontrada.`)

        if (['delete', 'excluir', 'del'].includes(args[0]?.toLowerCase()))
            return DeleteAllTransactions()

        if (args[0])
            return message.reply(`${e.Info} | Você pode usar o comando \`${prefix}transações delete\` para deletar todas as suas transações. Ou só \`${prefix}transações <@user/ID>\` para ver as suas transações ou a de algém`)

        let embeds = EmbedGenerator(),
            msg = await message.reply({ embeds: [embeds[0]] }),
            EmbedsControl = 0

        if (embeds.length === 1) return

        for (const i of ['◀️', '▶️', '❌']) {
            msg.react(i).catch()
        }

        const CancelFilter = (reaction, user) => { return ['◀️', '▶️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id },
            collector = msg.createReactionCollector({ filter: CancelFilter, time: 30000, errors: ['time'] });

        collector.on('collect', (reaction) => {

            if (reaction.emoji.name === '◀️') {

                EmbedsControl++
                return embeds[EmbedsControl] ? msg.edit({ embeds: [embeds[EmbedsControl]] }).catch() : EmbedsControl--

            }

            if (reaction.emoji.name === '▶️') {

                EmbedsControl--
                return embeds[EmbedsControl] ? msg.edit({ embeds: [embeds[EmbedsControl]] }).catch() : EmbedsControl++

            }

            if (reaction.emoji.name === '❌')
                return collector.stop()

        })

        collect.on('end', () => {
            return msg.edit({ content: `${e.Deny} Comando cancelado.` })
        })

        function EmbedGenerator() {

            let amount = 10,
                Page = 1,
                embeds = [],
                AuthorOrUser = user.id === message.author.id ? 'Suas transações' : `Transações de ${user.tag}`,
                length = parseInt(transactions.length / 10) + 1

            for (let i = 0; i < transactions.length; i += 10) {

                const current = transactions.slice(i, amount)
                const description = current.map(t => `> \`${t.time}\` ${t.data}`).join("\n")

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

        async function DeleteAllTransactions() {

            const msg = await message.channel.send(`${e.QuestionMark} | Você realmente deseja apagar **TODAS** as suas transações?`),
                collector = msg.createReactionCollector({
                    filter: (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id,
                    time: 30000,
                    errors: ['time']
                });

            for (const emoji of ['✅', '❌'])
                msg.react(emoji).catch()

            collector.on('collect', (reaction) => {
                return reaction.emoji.name === '✅' ? DeleteAllData(msg) : collector.stop()
            })

            collector.on('end', () => {
                return msg.edit(`${e.Deny} | Comando cancelado`).catch()
            })

        }

        function DeleteAllData(msg) {
            Transactions.delete(`Transactions.${message.author.id}`)
            return msg.edit(`${e.Check} | Todas as suas transações foram deletadas.`).catch()
        }

    }
}