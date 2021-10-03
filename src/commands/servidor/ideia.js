const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'ideia',
    aliases: ['sugerir', 'sugestão'],
    category: 'servidor',
    UserPermissions: '',
    ClientPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'],
    emoji: '💭',
    usage: '<ideia> <sua ideia em diante>',
    description: 'Dê suas ideias para o servidor votar',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const NoChannelEmbed = new MessageEmbed()
            .setColor('#246FE0')
            .setDescription(`${e.Info} | Graças ao meu sistema de organização, este é um dos comandos que requer um canal especifico para funcionamento.\n \nAs ideias e sugestões dos membros ficará em um canal para serem votadas pelos os outros membros. Bem... Se a administração do servidor assim quiser, é claro.`)
            .addFields({ name: 'Comando de Ativação', value: `\`${prefix}ideiachannel\``, inline: true})
            .addFields({ name: 'Comando de Desativação', value: `\`${prefix}ideiachannel off\``, inline: true})

        let canal = db.get(`Servers.${message.guild.id}.IdeiaChannel`)
        if (!canal) return message.reply({ content: `${e.Deny} | O canal de ideias não existe no servidor`, embeds: [NoChannelEmbed] })

        await message.guild.channels.fetch(canal).then(channel => {

            let content = args.join(" ")
            let avatar = message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })
            if (!content) { return message.reply(`${e.Info} | Use este comando para enviar ideias para o servidor votar.\n\`${prefix}ideia A sua ideia em diante\``) }
            if (content.length > 500 || content.length < 10) { return message.reply(`${e.Deny} | Tente colocar suas ideias dentro de **10~700 caracteres**.`) }

            const IdeiaEmbed = new MessageEmbed()
                .setColor('#246FE0')
                .setAuthor(`${message.author.tag} enviou uma ideia`, avatar)
                .setDescription(content)
                .setFooter(`${prefix}ideia`)
                .setTimestamp()

            channel.send({ embeds: [IdeiaEmbed] }).then(msg => {

                message.reply(`${e.Check} | A sua ideia foi enviada com sucesso no canal ${channel}`)

                let emojis = [`${e.Upvote}`, `${e.DownVote}`, `${e.QuestionMark}`]
                for (let i in emojis) { msg.react(emojis[i]) }
            }).catch(() => {
                message.channel.send(`${e.Warn} | Ocorreu um erro ao enviar a mensagem. Caso não saiba resolver o problema, use o comando \`${prefix}bug\` ou entre no meu servidor abrindo meu perfil e reporte o bug.`)
            })

        }).catch(() => {
            return message.reply({ content: `${e.Deny} | O canal de ideias não existe no servidor`, embeds: [NoChannelEmbed] })
        })
    }
}