const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'rank',
    aliases: ['podio'],
    category: 'level',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: '🏆',
    usage: '<rank> [money/level/reputação]',
    description: 'Confira os Top 10 Globais',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const RankingEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('🏆 | Global Ranking')
            .setDescription('Aqui você pode ver os top 10 em cada clase')
            .addField('Ranking XP', '`' + prefix + 'rank xp`')
            .addField('Ranking Money', '`' + prefix + 'rank money`')
            .addField('Ranking Reputação', '`' + prefix + 'rank reputação`')

        if (!args[0]) { return message.reply({ embeds: [RankingEmbed] }) }

        if (['xp', 'level', 'nivel'].includes(args[0])) {
            let data = db.all().filter(i => i.ID.startsWith("Xp_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply(`${e.Deny} | Sem ranking por enquanto`)
            let myrank = data.map(m => m.ID).indexOf(`Xp_${message.author.id}`) + 1 || "N/A"
            data.length = 10
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.fetch(id)
                user = user ? user.tag : "Usuário não encontrado"
                let rank = data.indexOf(data[i]) + 1
                let level = db.get(`level_${id}`); if (!level) level + 1
                let xp = db.get(`Xp_${id}`)
                let xpreq = Math.floor(level * 550)
                lb.push({ user: { id, tag: user }, rank, level, xp, xpreq })
            }


            const embedxp = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`${e.Star} Ranking - Experiência`)
            lb.forEach(d => { embedxp.addField(`${d.rank}. ${d.user.tag}`, `${e.RedStar} ${d.level} *(${d.xp} / ${d.xpreq})*`) })
            embedxp.setFooter(`Seu ranking: ${myrank}`)
            return message.reply({ embeds: [embedxp] })

        } else if (['xpid', 'levelid', 'nivelid'].includes(args[0])) {
            if (message.author.id !== config.ownerId) return message.reply(`Ranking Fechado.`)

            let data = db.all().filter(i => i.ID.startsWith("Xp_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply(`${e.Deny} | Sem ranking por enquanto`)
            let myrank = data.map(m => m.ID).indexOf(`Xp_${message.author.id}`) + 1 || "N/A"
            data.length = 10
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.fetch(id)
                user = user ? user.tag : "Usuário não encontrado"
                let rank = data.indexOf(data[i]) + 1
                let level = db.get(`level_${id}`); if (!level) level + 1
                let xp = db.get(`Xp_${id}`)
                let xpreq = Math.floor(level * 550)
                lb.push({ user: { id, tag: user }, rank, level, xp, xpreq })
            }

            const embedxp = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`🏆 Ranking - Experiência`)
            lb.forEach(d => {
                embedxp.addField(`${d.rank}. ${d.user.tag}`, `:id: *\`${d.user.id}\`*\n${e.RedStar} ${d.level} *(${d.xp} / ${d.xpreq})*`)
            })
            embedxp.setFooter(`Seu ranking: ${myrank}`)
            return message.reply({ embeds: [embedxp] })

        } else if (['dinheiro', 'money', 'cash', 'sp', 'coin', 'moeda', 'bank', 'coins'].includes(args[0])) {

            let data = db.all().filter(i => i.ID.startsWith("Bank_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply("Sem ranking por enquanto")
            let myrank = data.map(m => m.ID).indexOf(`Bank_${message.author.id}`) + 1 || "N/A"
            data.length = 10
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.fetch(id)
                user = user ? user.tag : "Usuário não encontrado"
                let rank = data.indexOf(data[i]) + 1
                let balance = db.get(`Balance_${id}`) || '0'
                let bank = data[i].data
                lb.push({ user: { id, tag: user }, rank, balance, bank, })
            }

            let loteria = db.get('Loteria.Prize') || '0'
            const embedxp = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`👑 Ranking - Global Money`)
            lb.forEach(d => { embedxp.addField(`${d.rank}. ${d.user.tag}`, `🆔 *\`${d.user.id}\`*\n${e.Bells} ${d.balance} ${Moeda(message)}\n🏦 ${d.bank} ${Moeda(message)}`) })
            embedxp.setFooter(`Seu ranking: ${myrank} | Rank Base: Banco`)
            embedxp.addField(`${e.PandaProfit} Loteria ${client.user.username}`, `Prêmio Atual: ${loteria} ${Moeda(message)}`)
            return message.reply({ embeds: [embedxp] })

        } else if (['rep', 'reputação'].includes(args[0])) {
            let data = db.all().filter(i => i.ID.startsWith("rp_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply("Sem ranking por enquanto")
            let myrank = data.map(m => m.ID).indexOf(`rp_${message.author.id}`) + 1 || "N/A"
            data.length = 10
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.fetch(id)
                user = user ? user.tag : "Usuário não encontrado"
                let rank = data.indexOf(data[i]) + 1
                let level = db.get(`rp_${id}`)
                let xp = data[i].data
                lb.push({ user: { id, tag: user }, rank, level, xp, })
            }

            const embedrep = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle("👑 Ranking - Reputação")
            lb.forEach(d => { embedrep.addField(`${d.rank}. ${d.user.tag}`, `💌 ${d.level} Reputações`) })
            embedrep.setFooter(`Seu ranking: ${myrank}`)
            return message.reply({ embeds: [embedrep] })

        } else if (['repid', 'reputaçãoid'].includes(args[0])) {
            let data = db.all().filter(i => i.ID.startsWith("rp_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply("Sem ranking por enquanto")
            let myrank = data.map(m => m.ID).indexOf(`rp_${message.author.id}`) + 1 || "N/A"
            data.length = 10
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.fetch(id)
                user = user ? user.tag : "Usuário não encontrado"
                let rank = data.indexOf(data[i]) + 1
                let level = db.get(`rp_${id}`)
                let xp = data[i].data
                lb.push({ user: { id, tag: user }, rank, level, xp, })
            }

            const embedrep = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle("👑 Ranking - Reputação")
            lb.forEach(d => { embedrep.addField(`${d.rank}. ${d.user.tag}`, `:id: *(${d.user.id})*\n💌 ${d.level} Reputações`) })
            embedrep.setFooter(`Seu ranking: ${myrank}`)
            return message.reply({ embeds: [embedrep] })

        } else {
            return message.reply(`${e.Deny} | ${message.author}, este ranking não existe ou você escreveu errado. Use \`${prefix}rank\` e veja os rankings disponiveis.`)
        }
    }
}