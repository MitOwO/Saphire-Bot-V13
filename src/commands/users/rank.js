const { e } = require('../../../database/emojis.json')
const { lotery, Clan } = require('../../../Routes/functions/database')
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'rank',
    aliases: ['podio', 'ranking'],
    category: 'level',
    ClientPermissions: ['EMBED_LINKS'],
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

            let users = Object.keys(sdb.get('Users')),
                UsersArray = []

            for (const id of users) {
                let Exp = sdb.get(`Users.${id}.Xp`) || 0,
                    Level = sdb.get(`Users.${id}.Level`) || 0,
                    XpNeeded = Level * 550

                if (Exp > 0)
                    UsersArray.push({ id: id, xp: Exp, XpNeeded: XpNeeded, level: Level })
            }

            if (!UsersArray.length) rank = 'Não há ninguém no ranking'

            let RankingSorted = UsersArray.sort((a, b) => b.level - a.level),
                Rank = RankingSorted.slice(0, 10),
                RankMapped = Rank.map((user, i) => `**${Medals(i)} ${client.users.cache.get(user.id)?.tag || 'Usuário não encontrado'}**\n🆔 \`${user.id}\`\n${e.RedStar} ${user.level} *(${user.xp}/${user.XpNeeded})*\n`).join('\n'),
                embed = new MessageEmbed(),
                myrank = RankingSorted.findIndex(author => author.id === message.author.id) + 1 || "N/A"

            embed
                .setColor('YELLOW')
                .setTitle(`👑 Ranking - Global Experience`)
                .setDescription(`${RankMapped}`)
                .setFooter(`Seu ranking: ${myrank} | Rank Base: XP`)
            return message.reply({ embeds: [embed] })

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
                    Bal: parseInt(sdb.get(`Users.${id}.Balance`)) || 0,
                    Bank: parseInt(sdb.get(`Users.${id}.Bank`)) || 0,
                    Resgate: parseInt(sdb.get(`Users.${id}.Cache.Resgate`)) || 0
                }

                let Total = Bal + Bank + Resgate
                Total > 0 ? UsersMoney.push({ id: id, bal: Total }) : null
            }

            let Sorted = UsersMoney.sort((a, b) => b.bal - a.bal)
            let AuthorRank = Sorted.findIndex(author => author.id === message.author.id) + 1 || "N/A"
            if (UsersMoney.length > 10) UsersMoney.length = 10
            let rank = Sorted.map((a, i) => {
                return `**${Medals(i)} ${client.users.cache.get(a.id)?.tag || 'Usuário não encontrado'}**\n🆔*\`${a.id}\`*\n${e.Bells} ${a.bal} ${Moeda(message)}\n`
            }).join('\n')

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

            let users = Object.keys(sdb.get('Users')),
                UsersArray = []

            for (const id of users) {
                let Money = parseInt(sdb.get(`Users.${id}.Balance`)) || 0

                if (Money > 0)
                    UsersArray.push({ id: id, money: Money })
            }

            if (!UsersArray.length) rank = 'Não há ninguém no ranking'

            let RankingSorted = UsersArray.sort((a, b) => b.money - a.money),
                Rank = RankingSorted.slice(0, 10),
                RankMapped = Rank.map((user, i) => `**${Medals(i)} ${client.users.cache.get(user.id)?.tag || 'Usuário não encontrado'}**\n🆔 \`${user.id}\`\n${e.Bells} ${user.money} ${Moeda(message)}\n`).join('\n'),
                loteria = lotery.get('Loteria.Prize')?.toFixed(0) || 0,
                embed = new MessageEmbed(),
                myrank = RankingSorted.findIndex(author => author.id === message.author.id) + 1 || "N/A"

            embed
                .setColor('YELLOW')
                .setTitle(`👑 Ranking - Global Money | Carteira`)
                .setDescription(`${RankMapped}`)
                .addField(`${e.PandaProfit} Loteria ${client.user.username}`, `Prêmio Atual: ${loteria} ${Moeda(message)}`)
                .setFooter(`Seu ranking: ${myrank} | Rank Base: Carteira`)
            return message.reply({ embeds: [embed] })

        }

        async function RankLikes() {

            let users = Object.keys(sdb.get('Users')),
                UsersArray = []

            for (const id of users) {
                let Likes = sdb.get(`Users.${id}.Likes`) || 0

                if (Likes > 0)
                    UsersArray.push({ id: id, like: Likes })
            }

            if (!UsersArray.length) rank = 'Não há ninguém no ranking'

            let RankingSorted = UsersArray.sort((a, b) => b.like - a.like),
                Rank = RankingSorted.slice(0, 10),
                RankMapped = Rank.map((user, i) => `**${Medals(i)} ${client.users.cache.get(user.id)?.tag || 'Usuário não encontrado'}**\n🆔 \`${user.id}\`\n${e.Like} ${user.like}\n`).join('\n'),
                embed = new MessageEmbed(),
                myrank = RankingSorted.findIndex(author => author.id === message.author.id) + 1 || "N/A"

            embed
                .setColor('YELLOW')
                .setTitle(`👑 Ranking - Global Money | Likes`)
                .setDescription(`${RankMapped}`)
                .setFooter(`Seu ranking: ${myrank} | Rank Base: Likes`)
            return message.reply({ embeds: [embed] })

        }

        async function RankInvert() {

            let USERS, UsersMoney = []

            try {
                USERS = Object.keys(sdb.get('Users'))
            } catch (err) {
                return message.reply(`${e.Info} | Não há nenhum usuário na minha database por enquanto.`)
            }

            for (const id of USERS) {

                const { Bal, Bank, Resgate } = {
                    Bal: parseInt(sdb.get(`Users.${id}.Balance`)) || 0,
                    Bank: parseInt(sdb.get(`Users.${id}.Bank`)) || 0,
                    Resgate: parseInt(sdb.get(`Users.${id}.Cache.Resgate`)) || 0
                }

                let Total = Bal + Bank + Resgate
                UsersMoney.push({ id: id, bal: Total })
            }

            let Sorted = UsersMoney.sort((a, b) => a.bal - b.bal)
            let AuthorRank = Sorted.findIndex(author => author.id === message.author.id) + 1 || "N/A"
            if (UsersMoney.length > 10) UsersMoney.length = 10
            let rank = Sorted.map((a, i) => {
                return `**${Medals(i)} ${client.users.cache.get(a.id)?.tag || 'Usuário não encontrado'}**\n🆔*\`${a.id}\`*\n${e.Bells} ${a.bal} ${Moeda(message)}\n`
            }).join('\n')

            if (!UsersMoney.length) rank = 'Não há ninguém no ranking'

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle(`👑 Ranking - Global Money | Invertido`)
                        .setDescription(`O ranking abaixo representa a soma total entre carteira, banco e cache.\n \n${rank}`)
                        .setFooter(`Seu ranking: ${AuthorRank}`)
                ]
            })

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

        function Medals(i) {
            const Medals = {
                1: '🥇',
                2: '🥈',
                3: '🥉'
            }

            return Medals[i + 1] || `${i + 1}.`
        }

    }
}