const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'vote',
    aliases: ['pull', 'votação', 'voto'],
    category: 'util',
    UserPermissions: '',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.Upvote}`,
    usage: '<vote> <Conteúdo a ser votado>',
    description: 'Abra facilmente uma votação no chat',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const Conteudo = args.join(' ')
        if (!Conteudo) return message.reply(`${e.Deny} | Você precisa me dizer o que vai ser votado.`)
        if (Conteudo.length > 1000 || Conteudo.length < 6) return message.reply(`${e.Deny} | Você precisa fornecer uma mensagem que contenha pelo menos **6~1000 caracteres.**`)
        let avatar = message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })
        let color = message.member.roles.highest.hexColor

        const VoteEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(Conteudo)

        if (avatar) { VoteEmbed.setAuthor(`${message.author.username} abriu uma votação`, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })) } else { VoteEmbed.SetAuthor(`${message.author.username} abriu uma votação`) }

        setTimeout(() => {
            return message.channel.send({ embeds: [VoteEmbed] }).then(msg => {
                msg.react(`${e.Upvote}`).catch(err => { })
                msg.react(`${e.DownVote}`).catch(err => { })
            }).catch(err => { return message.reply(`${e.Warn} | Ocorreu um erro ao executar este comando.\n\`${err}\``) })
        }, 1400)
    }
}