const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'balance',
    aliases: ['b', 'bal', 'money', 'banco', 'dinheiro', 'conta', 'saldo', 'sp', 'coins', 'coin', 'atm', 'carteira', 'bank'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<bal> [@user]',
    description: 'Confira as finanças',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (['info', 'help', 'ajuda'].includes(args[0]?.toLowerCase())) return BalInfo()
        let u = message.mentions.members.first() || client.users.cache.get(args[0]) || message.member || message.mentions.repliedUser
        let user = client.users.cache.get(u.id)
        if (!isNaN(args[0]) && !client.users.cache.get(args[0])) {
            if (!user) return message.reply(`${e.Deny} | Eu não encontrei ninguém com esse ID...`)
        }

        let bal = db.get(`Balance_${user.id}`)?.toFixed(0) || 0
        let bank = db.get(`Bank_${user.id}`)?.toFixed(0) || 0
        let vip = db.get(`Vip_${user.id}`)
        let oculto = db.get(`${user.id}.BankOcult`)
        let frase = f.BalanceTypes[Math.floor(Math.random() * f.BalanceTypes.length)]
        let cache = db.get(`${user.id}.Cache.Resgate`)?.toFixed(0) || 0
        let avatar = user?.displayAvatarURL({ dynamic: true }) || user.user.displayAvatarURL({ dynamic: true })
        let name = user.username || user.user.username

        const embed = new MessageEmbed()
            .setColor(Colors(user))
            .setAuthor(`Finanças de ${name}`, avatar)
            .setDescription(frase)
            .addField('👝 Carteira', `${bal} ${Moeda(message)}`, true)

        if (!oculto) {
            embed.addField('🏦 Banco', `${bank} ${Moeda(message)}`, true)
        } else if (oculto) {
            if (message.author.id === config.ownerId) {
                embed.addField('🏦 Banco', `${bank} ${Moeda(message)}`, true)
            } else if (user.id === message.author.id) {
                embed.addField('🏦 Banco', `${bank} ${Moeda(message)}`, true)
            } else {
                embed.addField('🏦 Banco', `||Oculto|| ${Moeda(message)}`, true)
            }
        }

        embed.addField('📦 Cache', `${cache} ${Moeda(message)}`)
            .setFooter(`Dúvidas? ${prefix}bal info`)

        if (vip) { embed.setDescription(`${e.Star} ${frase}`) }
        return message.reply({ embeds: [embed] })

        function BalInfo() {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(Colors(message.member))
                        .setTitle(`${e.MoneyWings} ${client.user.username} Balance Info`)
                        .setDescription(`No balance você pode ver quantas ${Moeda(message)} você ou alguém tem`)
                        .addFields(
                            {
                                name: '👝 Carteira',
                                value: `A carteira é responsável por girar a economia. Você paga e utiliza o dinheiro que está na carteira. Porém, a carteira abre espaço para os comandos \`${prefix}roubar/assaltar\`, onde tomar dinheiro dos outros é possível. Então, tome cuidado com dinheiro na carteira.`
                            },
                            {
                                name: '🏦 Banco',
                                value: `O banco garante segurança. Você não pode utilizar o dinheiro no banco, ninguém pode roubar ou tomar seu dinheiro do banco. O banco também é a base para o \`${prefix}rank money\``
                            },
                            {
                                name: '📦 Cache',
                                value: `Todo o dinheiro que você no games da ${client.user.username} vão para o cache. Isso garante a sua segurança contra roubos.\n \n${e.QuestionMark} **Por que do Cache?**\nO cache foi criado para armazenar o dinheiro ganho nos jogos. Tornando o banco totalmente administrado pelo dono da conta. O cache garante segurança contra assaltos e roubos, impedindo que você perca seu dinheiro ganho nos games ou até mesmo na loteria.\n \n${e.QuestionMark} **Por que não adicionar direto no banco?**\nO banco é de total controle do dono da conta! Valores ganhos em games ir direto para a conta, pode confundir a cabeça dos jogadores. *Eu recebi o dinheiro? / Eu não lembro quanto eu tinha*.\nEnfim, isso evita muito problemas.\nObs: Para tirar dinheiro do cache, use \`${prefix}resgate\``
                            },
                            {
                                name: `${e.Gear} Comandos refentes ao balance`,
                                value: `\`${prefix}balance\` \`-b\` \`${prefix}bal\` \`${prefix}money\` \`${prefix}banco\` \`${prefix}dinheiro\` \`${prefix}conta\` \`${prefix}saldo\` \`${prefix}sp\` \`${prefix}coins\` \`${prefix}coin\` \`${prefix}atm\` \`${prefix}carteira\` \`${prefix}bank\`\n \n**${e.Info} Comandos Externos**\n\`${prefix}pix\` \`${prefix}pay\` \`${prefix}sacar\` \`${prefix}roubar\` \`${prefix}assaltar\` \`${prefix}resgatar\``
                            }
                        )
                ]
            })
        }
    }
}