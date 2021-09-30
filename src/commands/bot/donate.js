const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')

module.exports = {
    name: 'donate',
    aliases: ['doar', 'doação'],
    category: 'bot',
    ClientPermissions: 'EMBED_LINKS',
    emoji: `${e.MoneyWings}`,
    usage: '<donate>',
    description: 'Quer me dar um dinheirinho?',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const Link1RMercadoPago = 'https://mpago.la/2YbvxZd'
        const LinkPicPay = 'https://picpay.me/donatesaphire'
        const PixEmail = 'saphirediscord@gmail.com'
        const LinkServidor = `${config.SuportServerLink}`

        const DonateEmbed = new MessageEmbed()
            .setColor('#FDFF00')
            .setTitle(`${e.PandaProfit} Donate`)
            .setDescription(`Aqui você pode efetuar doações e adquirir seu VIP.`)
            .addField(`${e.QuestionMark} | O que eu ganho doando dinheiro além do Vip?`, `Um grande obrigado e me ajuda a ficar online ${e.SaphireTimida}`)
            .addField(`${e.Info} Meios de Doações`, `${e.Pix} **Pix**\nEmail: ${PixEmail}\n${e.Picpay} ${LinkPicPay}\n${e.Mercadopago} **Mercado Pago 1 Real**\nLink: ${Link1RMercadoPago}`)
            .addField(`${e.Check} Comprove o pagamente`, `${LinkServidor}`)

        return message.reply({ embeds: [DonateEmbed] })
    }
}