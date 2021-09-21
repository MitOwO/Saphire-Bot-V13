const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')
const Moeda = require('../../../Routes/functions/moeda')

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

        let user = message.mentions.members.first() || message.member || message.repliedUser

        let bal = await parseInt(db.get(`Balance_${user.id}`)) || 0
        let bank = parseInt(db.get(`Bank_${user.id}`)) || 0
        let vip = db.get(`Vip_${user.id}`)
        let oculto = db.get(`User.${user.id}.BankOcult`)
        let list = [`Quer ocultar o banco? \`${prefix}ocultar\``, 'Pessoas podem te roubar, tenha cuidado.', 'Mantenha seu dinheiro no banco', 'Sabia que você pode roubar o dinheiro de outras pessoas?', 'Já jogou blackjack hoje?', 'O banco é impossível de roubar.', 'A loteria é um bom lugar para investir', 'Jogadores com arma podem pegar todo dinheiro da carteira', 'Existem vários meios de se obter dinheiro', 'Na loja tem vários itens legais para se comprar', 'Os melhores players tem mais estrelas no perfil', 'Já viu o ranking hoje?', 'Você pode dobrar seu dinheiro no blackjack', 'A roleta é uma boa forma de ganhar e perder dinheiro', 'Já pescou hoje?', 'Já minerou hoje?', 'A loteria é um bom lugar para os sortudos', 'Já apostou na loteria hoje?']
        let frase = list[Math.floor(Math.random() * list.length)]

        const embed = new MessageEmbed()
            .setColor('YELLOW')
            .setAuthor(`Finanças de ${user.user.username}`, user.user.displayAvatarURL({ dynamic: true }))
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

        if (vip) { embed.setDescription(`${e.Star} ${frase}`) }
        return message.reply({ embeds: [embed] })
    }
}