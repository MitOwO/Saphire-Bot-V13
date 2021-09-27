const { e } = require('../../../Routes/emojis.json')
const Moeda = require('../../../Routes/functions/moeda')
const Colors = require('../../../Routes/functions/colors')

module.exports = {
    name: 'bingo',
    category: 'economy',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: '💴',
    usage: '<bingo> quantia',
    description: 'Jogar bingo é divertido',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let money = db.get(`Balance_${message.author.id}`)
        let ChannelAtived = db.get(`Request.${message.channel.id}.BingoCommand`)
        if (ChannelAtived) return message.reply(`${e.Nagatoro} | Opa opa coisinha fofa! Já tem um bingo rolando nesse chat.\n${ChannelAtived}`)

        const BingoEmbed = new MessageEmbed()
            .setColor(Colors(message.member))
            .setTitle(`💴 Bingo ${client.user.username}`)
            .setDescription('Jogar bingo é MUITO BOM! Com este comando você e todo o chat pode jogar bingo sem toda aquela burocracia')
            .addField(`${e.Obs} Como jogar?`, `Quando alguém mandar um bingo no chat, basta você digitar o **NÚMERO** que você acha que é.`)
            .addField(`${e.Obs} Como iniciar um bingo?`, `Use o comando \`${prefix}bingo [quantia/all]\`. É só isso mesmo.`)

        if (!args[0]) return message.reply({ embeds: [BingoEmbed] })

        let quantia = parseInt(args[0])
        if (['all', 'tudo'].includes(args[0].toLowerCase())) quantia = money
        if (isNaN(quantia)) return message.reply(`${e.Deny} | **${args[0]}** | Não é um número`)
        if (quantia > money || quantia <= 0) return message.reply(`${e.Deny} | Você não tem todo esse dinheiro na carteira.`)

        db.add(`${message.author.id}.BingoPrize`, quantia)
        db.subtract(`Balance_${message.author.id}`, quantia)

        let Number = Math.floor(Math.random() * 80)

        const Bingo = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${message.author.username} iniciou um Bingo.`)
            .setDescription(`🏆 ${quantia} ${Moeda(message)}\n \nAdivinhe o número do bingo!\n**1 a 80**`)
            .setFooter('Tempo: 1 Minuto')

        message.channel.send({ embeds: [Bingo] }).then(msg => {
            db.set(`Request.${message.channel.id}.BingoCommand`, `${msg.url}`)

            const filter = msg => msg.content === (`${Number}`)
            const collector = message.channel.createMessageCollector({ filter, max: 1, time: 60000 })
            
            collector.on('collect', WinnerMsg => {
                let prize = db.get(`${message.author.id}.BingoPrize`) || 0
                db.set('Bingo', true)
                Bingo.setTitle(`${message.author.username} fez um Bingo.`).setDescription(`🏆 ${quantia} ${Moeda(message)}\n${e.OwnerCrow} ${WinnerMsg.author} Acertou o número: ${Number}`).setFooter('Concluído')
                msg.edit({ embeds: [Bingo] }).catch(() => { })
                db.add(`${WinnerMsg.author.id}.Cache.Resgate`, prize)
                db.get(`${message.author.id}.BingoPrize`) ? db.delete(`${message.author.id}.BingoPrize`) : ''
                WinnerMsg.reply(`${e.MoneyWings} | ${WinnerMsg.author} acertou o número do bingo! **${Number}**\n${e.PandaProfit} | ${(db.get(`${WinnerMsg.author.id}.Cache.Resgate`) || 0)} ${Moeda(message)} estão no seu cache. Use \`${prefix}resgate\` para resgatar seu cache.\nBingo link: ${db.get(`Request.${message.channel.id}.BingoCommand`)}`).catch(err => { })
                db.delete(`Request.${message.channel.id}.BingoCommand`)
            })

            collector.on('end', collected => {
                if (!db.get('Bingo')) {
                    Bingo.setColor('RED').setTitle(`${message.author.username} fez um Bingo.`).setDescription(`🏆 ${quantia} ${Moeda(message)}\n${e.Deny} Ninguém acertou o número: ${Number}`).setFooter('Concluído')
                    msg.edit({ embeds: [Bingo] }).catch(() => { })
                    db.add(`${message.author.id}.Cache.Resgate`, (db.get(`${message.author.id}.BingoPrize`) || 0))
                    db.get(`${message.author.id}.BingoPrize`) ? db.delete(`${message.author.id}.BingoPrize`) : ''
                    message.channel.send(`${e.Deny} | Tempo do bingo expirado!\n${message.author}, o dinheiro lançado no Bingo está no seu cache.\nBingo Link: ${db.get(`Request.${message.channel.id}.BingoCommand`)}`)
                    db.delete(`Request.${message.channel.id}.BingoCommand`)
                } else {
                    db.delete('Bingo')
                    db.delete(`Request.${message.channel.id}.BingoCommand`)
                }
            })

        }).catch(() => {
            db.delete(`Request.${message.channel.id}.BingoCommand`)
        })
    }
}