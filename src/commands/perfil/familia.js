const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'familia',
    aliases: ['family', 'família'],
    category: 'perfil',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: '👩‍👩‍👧‍👧',
    usage: '<family>',
    description: 'Entre pra uma família',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        return message.channel.send(`${e.Loading} | Código ainda está sendo escrito... Espere mais um pouco, ok?`)

        let user = message.mentions.members.first() || message.member || message.guild.members.cache.get(args[0])

        if (args[1]) return message.reply(`${e.Deny} | Hey ${message.author}! Nada além do @user, por favor.`)

        if (!member) return message.reply('Ei, me fala quem você quer convidar para sua familia.')
        if (user.bot) return message.reply(`${e.Deny} | Nada de bots, ok?`)

        if (db.get(`${message.author.id}.Perfil.Family.1`)) { return message.reply(`Nesta posição, <@${db.get(`family1_${message.author.id}`)}> é seu familiar.`) }
        if (db.get(`${user.id}.Perfil.Family.1`)) { return message.reply(user.username + ' já tem um familiar nesta posição.') }

        if (user.id === db.get(`marry_${message.author.id}`)) { return message.reply(`✅ ${member} já está na sua familia`) }
        if (user.id === db.get(`family1_${message.author.id}`)) { return message.reply(`✅ ${member} já está na sua familia`) }
        if (user.id === db.get(`family2_${message.author.id}`)) { return message.reply(`✅ ${member} já está na sua familia`) }
        if (user.id === db.get(`family3_${message.author.id}`)) { return message.reply(`✅ ${member} já está na sua familia`) }

        switch (user.id) {
            case message.author.id:
                message.reply(`${e.BlueHeart} Convide alguém para usa familia! Pode até 3 pessoas. \`${prefix}family 1/2/3 @user\``)
                break;
            case client.user.id:
                message.reply(`${e.Deny} | É... Foi mal, mas eu já tenho uma família.`)
                break;
            case db.get(`marry_${message.author.id}`):
            case db.get(`family1_${message.author.id}`):
            case db.get(`family2_${message.author.id}`):
            case db.get(`family3_${message.author.id}`):
                message.reply(`✅ ${member} já está na sua familia`)
                break;
            case value:

                break;
            case value:

                break;
        
            default:
                break;
        }

        let family = await db.get(`family1_${message.author.id}`)
        let family2 = await db.get(`family1_${user.id}`)

        if (family === null && family2 === null) {
            const familyembed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('❤️ Novo Pedido de Family')
                .setDescription(`${message.author} está pedindo para ${member} entrar em sua familia.\n \nClique no coração para aceitar o pedido.`)
                .setFooter('40 segundos para aceitar o pedido.')

            message.reply(familyembed).then(msg => {
                msg.react('❤️').catch(err => { })

                let reactions = (reaction, user) =>
                    reaction.emoji.name === '❤️' && user.id === user.id

                let coletor = msg.createReactionCollector(reactions)

                coletor.on('collect', cp => {
                    msg.delete().catch(err => { })

                    db.set(`family1_${message.author.id}`, user.id)
                    db.set(`family1_${user.id}`, message.author.id)

                    let familyembed = new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`✅ ${member} aceitou o pedido de ${message.author} e agora são uma familia!`)
                    setTimeout(function () { message.reply(familyembed) }, 4650)
                    return message.channel.send('🔄 Autenticando mudanças no banco de dados...').then(msg => msg.delete({ timeout: 4500 }).catch(err => { }))
                })
            })
        } else {
            return message.reply(`❗ Tem algo errado. Parece que algúm dos dois tem algo no Family 1.`)
        }
    }
}