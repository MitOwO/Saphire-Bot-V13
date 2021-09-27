const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')
const Moeda = require('../../../Routes/functions/moeda')
const { f } = require('../../../Routes/frases.json')

module.exports = {
    name: 'balance',
    aliases: ['bal', 'money', 'banco', 'dinheiro', 'conta', 'saldo', 'sp', 'coins', 'coin', 'atm', 'carteira', 'bank'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Coin}`,
    usage: '<bal> [@user]',
    description: 'Confira as finanças',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let u = message.mentions.members.first() || client.users.cache.get(args[0]) || message.member || message.mentions.repliedUser
        let user = client.users.cache.get(u.id)
        if (!isNaN(args[0]) && !client.users.cache.get(args[0])) {
            if (!user) return message.reply(`${e.Deny} | Eu não encontrei ninguém com esse ID...`)
        }

        let bal = parseInt(db.get(`Balance_${user.id}`)) || 0
        let bank = parseInt(db.get(`Bank_${user.id}`)) || 0
        let vip = db.get(`Vip_${user.id}`)
        let oculto = db.get(`${user.id}.BankOcult`)
        let frase = f.BalanceTypes[Math.floor(Math.random() * f.BalanceTypes.length)]
        let cache = db.get(`${user.id}.Cache.Resgate`) || 0
        let avatar = user?.displayAvatarURL({ dynamic: true }) || user.user.displayAvatarURL({ dynamic: true })
        let name = user.username || user.user.username

        const embed = new MessageEmbed()
            .setColor('YELLOW')
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
            .setFooter(`Dinhero no cache? ${prefix}resgatar`)

        if (vip) { embed.setDescription(`${e.Star} ${frase}`) }
        return message.reply({ embeds: [embed] })
    }
}