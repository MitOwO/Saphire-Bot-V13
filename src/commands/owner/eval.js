const { f } = require('../../../database/frases.json')
const { sdb, db, BgLevel, BgWall, conf, emojis, nomes, lotery, CommandsLog, DatabaseObj: { e }, ServerDb, ticket, Transactions, Clan, Frases } = require('../../../Routes/functions/database')

module.exports = {
    name: 'eval',
    aliases: ['code', 'test', 'e'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    usage: '<eval> <code>',
    description: 'Permite meu criador testar códigos',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let code = args.join(" ")
        if (!code) return message.reply({ content: "... Código." })

        let result
        try {
            result = eval(code)
            const EvalEmbed = new MessageEmbed().setColor('GREEN').addField('📥 Input', '```' + code + '```').addField('📤 Output', '```' + await result + '```')
            await message.reply({ embeds: [EvalEmbed] }).catch(err => { return message.channel.send(`${e.Deny} | Erro na resolução do código\n\`${err}\``) })
        } catch (err) {
            const ErrorEmbed = new MessageEmbed().setColor('RED').addField('📥 Input', '```' + code + '```').addField('📤 Output', '```' + err + '```')
            await message.reply({ embeds: [ErrorEmbed] }).catch(err => { return message.channel.send(`${e.Deny} | Erro na resolução do código\n\`${err}\``) })
        }
    }
}