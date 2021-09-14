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

        if (args[1]) { return message.reply(`${e.Deny} Sem informações além do @user, por favor.`) }

        let user = message.mentions.members.first() || message.repliedUser || message.member
        if (user.id === client.user.id) { return message.reply(`${e.Deny} | Eu não tenho essa coisa, para com isso!`) }

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
            .setColor('BLUE')
            .setTitle(`🍆 | Tamanho do brinquedo de ${user.user.username}`)
            .setDescription(piiiinto)
        return message.reply({ embeds: [Piiinto] })
    }
}