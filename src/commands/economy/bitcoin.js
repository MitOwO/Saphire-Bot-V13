const { e } = require('../../../Routes/emojis.json')
const ms = require('parse-ms')
const Moeda = require('../../../Routes/functions/moeda')

module.exports = {
    name: 'bitcoin',
    aliases: ['bc', 'bitcoins', 'bit'],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.BitCoin}`,
    usage: '<bitcoin> | [bitcoin me] | [bitcoin @user]',
    description: 'Bitcoin é uma moeda rara do meu sistema de economia',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const Bits = db.get(`User.${message.author.id}.Bits`) || '0'
        let user = message.mentions.members.first() || message.repliedUser

        if (user) {

            const BitUserFarm = db.get(`User.${user.id}.Bits`) || '0'
            let BitUser = db.get(`Bitcoin_${user.id}`) || '0'
            let avatar = user.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })
            const BitEmbed = new MessageEmbed().setColor('#FF8C00').setAuthor(`${user.user.username}`, avatar).addField('BitCoins', `${e.BitCoin} ${BitUser}`, true).addField('BitFarm', `${e.BitCoin} \`${BitUserFarm}/1000\``, true)
            return message.reply({ embeds: [BitEmbed] })

        } else if (['status', 'stats', 'me', 'eu'].includes(args[0])) {
            const BitEmbed = new MessageEmbed().setColor('#FF8C00').setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })).addField('BitCoins', `${e.BitCoin} ${db.get(`Bitcoin_${message.author.id}`) || '0'}`, true).addField('BitFarm', `${e.BitCoin} \`${db.get(`User.${message.author.id}.Bits`) || '0'}/1000\``, true)
            return message.reply({ embeds: [BitEmbed] })
        } else {

            let timeout1 = 7200000
            let author1 = db.get(`User.${message.author.id}.Timeouts.Preso`)
            if (author1 !== null && timeout1 - (Date.now() - author1) > 0) {
                let time = ms(timeout1 - (Date.now() - author1))
                return message.reply(`Você está preso! Liberdade em: \`${time.minutes}m e ${time.seconds}s\``)
            } else {

                let timeout = 7200000
                let author = db.get(`User.${message.author.id}.Timeouts.Bitcoin`)
                if (author !== null && timeout - (Date.now() - author) > 0) {
                    let time = ms(timeout - (Date.now() - author))
                    return message.reply(`${e.BitCoin} | Status: \`${Bits}/1000\` | Reset em \`${time.hours}h ${time.minutes}m e ${time.seconds}s\``).catch(err => { })

                } else {
                    Bits === 1000 ? NewBitCoin() : MineBitCoin()
                }

                function NewBitCoin() {
                    db.set(`User.${message.author.id}.Bits`, 1); db.add(`Bitcoin_${message.author.id}`, 1); db.add(`Bank_${message.author.id}`, 1000000)
                    return message.reply(`${e.Tada} | Você obteve 1 ${e.BitCoin} BitCoin\n+1000000 ${Moeda(message)}`)
                }

                function MineBitCoin() {
                    db.add(`User.${message.author.id}.Bits`, 1); db.set(`User.${message.author.id}.Timeouts.Bitcoin`, Date.now())
                    return message.reply(`${e.BitCoin} | +1 | \`${Bits + 1}/1000\` | Reset em \`2 horas\``)
                }
            }
        }
    }
}