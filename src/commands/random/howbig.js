const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'howbig',
    aliases: ['tamanho'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: '🍆',
    usage: '<howbig> [@user]',
    description: 'Confira o tamanho do brinquedo',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let u = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.get(args[1]) || message.mentions.repliedUser || message.author || message.member
        let user = client.users.cache.get(u.id)
        if (!user) return message.reply(`${e.Deny} | Não achei ninguém...`)
        if (user.id === client.user.id) return message.reply(`${e.Deny} | Eu não tenho essa coisa, para com isso!`)

        let array = [
            '3====================D',
            '3===================D',
            '3==================D',
            '3=================D',
            '3================D',
            '3===============D',
            '3==============D',
            '3=============D',
            '3============D',
            '3===========D',
            '3==========D',
            '3=========D',
            '3========D',
            '3=======D',
            '3======D',
            '3=====D',
            '3====D',
            '3===D',
            '3==D',
            '3=D',
            'Não achei nada aqui :cry:'
        ]
        
        let piiiinto = array[Math.floor(Math.random() * array.length)]

        const Piiinto = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`🍆 | Tamanho do brinquedo de ${user.username}`)
            .setDescription(piiiinto)
        return message.reply({ embeds: [Piiinto] })
    }
}