const { e } = require('../../../database/emojis.json')
const { lotery, Clan } = require('../../../Routes/functions/database')
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'rank',
    aliases: ['podio', 'ranking'],
    category: 'level',
    ClientPermissions: 'EMBED_LINKS',
    emoji: '🏆',
    usage: '<rank> [money/level/reputação]',
    description: 'Confira os Top 10 Globais',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (!args[0]) return NoArgs()

        if (['xp', 'level', 'nivel'].includes(args[0]?.toLowerCase())) return RankLevel()
        if (['dinheiro', 'money', 'cash', 'sp', 'coin', 'moeda', 'bank', 'coins'].includes(args[0]?.toLowerCase())) return RankMoney()
        if (['carteira', 'wallet'].includes(args[0]?.toLowerCase())) return RankCarteira()
        if (['like', 'curtidas', 'likes'].includes(args[0]?.toLowerCase())) return RankLikes()
        if (['dividas', 'invertido', 'dívidas', 'invert', 'invertido'].includes(args[0]?.toLowerCase())) return RankInvert()
        if (['clan', 'clans'].includes(args[0]?.toLowerCase())) return ClanRanking()

        return message.reply(`${e.Deny} | ${message.author}, este ranking não existe ou você escreveu errado. Use \`${prefix}rank\` e veja os rankings disponiveis.`)

        async function RankLevel() {
            let data = db.all().filter(i => i.ID.startsWith("level_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply(`${e.Deny} | Sem ranking por enquanto`)
            let myrank = data.map(m => m.ID).indexOf(`level_${message.author.id}`) + 1 || "N/A"
            data.length = 10
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.cache.get(id)
                user = user ? user.tag : "Usuário não encontrado"
                let rank = data.indexOf(data[i]) + 1
                let level = db.get(`level_${id}`) || 1
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
        }

        async function RankMoney() {

            let USERS, UsersMoney = []

            try {
                USERS = Object.keys(sdb.get('Users'))
            } catch (err) {
                return message.reply(`${e.Info} | Não há nenhum usuário na minha database por enquanto.`)
            }

            for (const id of USERS) {

                const { Bal, Bank, Resgate } = {
                    Bal: db.get(`Balance_${id}`) || 0,
                    Bank: db.get(`Bank_${id}`) || 0,
                    Resgate: sdb.get(`Users.${id}.Cache.Resgate`) || 0
                }

                let Total = Bal + Bank + Resgate
                Total > 0 ? UsersMoney.push({ id: id, bal: Total }) : null
            }

            let Sorted = UsersMoney.sort((a, b) => b.bal - a.bal)
            let AuthorRank = Sorted.findIndex(author => author.id === message.author.id) + 1 || "N/A"
            if (UsersMoney.length > 15) UsersMoney.length = 15
            let rank = Sorted.map((a, i) => {
                return `> ${Medals(i)} **${client.users.cache.get(a.id)?.tag || 'Usuário não encontrado'}** - *\`${a.id}\`*\n> ${a.bal} ${Moeda(message)}`
            }).join('\n')

            function Medals(i) {
                const Medals = {
                    1: '🥇',
                    2: '🥈',
                    3: '🥉'
                }

                return Medals[i + 1] || `${i + 1}.`
            }

            if (!UsersMoney.length) rank = 'Não há ninguém no ranking'

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle(`👑 Ranking - Global Money`)
                        .setDescription(`O ranking abaixo representa a soma total entre carteira, banco e cache.\n \n${rank}`)
                        .setFooter(`Seu ranking: ${AuthorRank}`)
                ]
            })

        }

        async function RankCarteira() {

            let data = db.all().filter(i => i.ID.startsWith("Balance_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply("Sem ranking por enquanto")
            let myrank = data.map(m => m.ID).indexOf(`Balance_${message.author.id}`) + 1 || "N/A"
            data.length = 10
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.cache.get(id)
                user = user ? user.tag : "Usuário não encontrado"
                let rank = data.indexOf(data[i]) + 1
                let bank = db.get(`Bank_${id}`) || 0
                let balance = data[i].data
                lb.push({ user: { id, tag: user }, rank, balance, bank, })
            }

            let loteria = lotery.get('Loteria.Prize')?.toFixed(0) || 0
            const embedxp = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`👑 Ranking - Global Money`)
            lb.forEach(d => { embedxp.addField(`${d.rank}. ${d.user.tag}`, `🆔 *\`${d.user.id}\`*\n${e.Bells} ${d.balance} ${Moeda(message)}`) })
            embedxp.setFooter(`Seu ranking: ${myrank} | Rank Base: Carteira`)
            embedxp.addField(`${e.PandaProfit} Loteria ${client.user.username}`, `Prêmio Atual: ${loteria} ${Moeda(message)}`)
            return message.reply({ embeds: [embedxp] })

        }

        async function RankLikes() {
            let data = db.all().filter(i => i.ID.startsWith("Likes_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply("Sem ranking por enquanto")
            let myrank = data.map(m => m.ID).indexOf(`Likes_${message.author.id}`) + 1 || "N/A"
            data.length = 10
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.cache.get(id)
                user = user ? user.tag : "Usuário não encontrado"
                let rank = data.indexOf(data[i]) + 1
                let level = db.get(`Likes_${id}`)
                let xp = data[i].data
                lb.push({ user: { id, tag: user }, rank, level, xp, })
            }

            const embedrep = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`👑 Ranking - Likes`)
            lb.forEach(d => { embedrep.addField(`${d.rank}. ${d.user.tag}`, `${e.Like} ${d.level} Likes`) })
            embedrep.setFooter(`Seu ranking: ${myrank}`)
            return message.reply({ embeds: [embedrep] })

        }

        async function RankInvert() {

            let data = db.all().filter(i => i.ID.startsWith("Balance_")).sort((a, b) => a.data - b.data)
            if (data.length < 1) return message.reply("Sem ranking por enquanto")
            let myrank = data.map(m => m.ID).indexOf(`Balance_${message.author.id}`) + 1 || "N/A"
            data.length = 10
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.cache.get(id)
                user = user ? user.tag : "Usuário não encontrado"
                let rank = data.indexOf(data[i]) + 1
                let bank = db.get(`Bank_${id}`) || 0
                let balance = data[i].data
                lb.push({ user: { id, tag: user }, rank, balance, bank, })
            }

            let loteria = lotery.get('Loteria.Prize')?.toFixed(0) || 0
            const embedxp = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle(`👑 Ranking - Global Money | Invertido`)
            lb.forEach(d => { embedxp.addField(`${d.rank}. ${d.user.tag}`, `🆔 *\`${d.user.id}\`*\n${e.Bells} ${d.balance} ${Moeda(message)}`) })
            embedxp.setFooter(`Seu ranking: ${myrank} | Rank Base: Carteira`)
            embedxp.addField(`${e.PandaProfit} Loteria ${client.user.username}`, `Prêmio Atual: ${loteria} ${Moeda(message)}`)
            return message.reply({ embeds: [embedxp] })

        }

        function ClanRanking() {

            const ClansArray = []
            const keys = Object.keys(Clan.get('Clans'))
            const AtualClan = sdb.get(`Users.${message.author.id}.Clan`)

            for (const key of keys) {
                if (Clan.get(`Clans.${key}.Donation`) > 0) {
                    ClansArray.push({ key: key, name: Clan.get(`Clans.${key}.Name`), donation: Clan.get(`Clans.${key}.Donation`) })
                }
            }

            if (ClansArray.length < 1) return message.reply(`${e.Info} | Não tem nenhum ranking por enquanto.`)

            const rank = ClansArray.slice(0, 10).sort((a, b) => b.donation - a.donation).map((clan, i) => ` \n> ${Medals(i)} **${clan.name}** - \`${clan.key}\`\n> ${clan.donation} ${Moeda(message)}\n`).join('\n')
            let MyClanRank = ClansArray.findIndex(clans => clans.name === AtualClan) + 1 || 'N/A'

            function Medals(i) {
                const Medals = {
                    1: '🥇',
                    2: '🥈',
                    3: '🥉'
                }

                return Medals[i + 1] || `${i + 1}.`
            }

            return message.reply(
                {
                    embeds: [
                        new MessageEmbed()
                            .setColor(Colors(message.member))
                            .setTitle(`👑 Top 10 Clans`)
                            .setDescription(`O clan é baseado nas doações\n \n${rank}`)
                            .setFooter(`Meu Clan: ${MyClanRank}`)
                    ]
                }
            )

        }

        function NoArgs() {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#246FE0')
                        .setTitle('🏆 | Global Ranking')
                        .setDescription('Aqui você pode ver os top 10 em cada clase')
                        .addField('Ranking Money', `\`${prefix}rank money\`\n\`${prefix}rank carteira\`\n\`${prefix}rank invertido\``)
                        .addField('Ranking Experiência', '`' + prefix + 'rank xp`')
                        .addField('Ranking Reputação', '`' + prefix + 'rank likes`')
                        .addField('Ranking Clans', `\`${prefix}rank clan\``)
                ]
            })
        }

    }
}