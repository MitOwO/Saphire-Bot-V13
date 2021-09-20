const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'botusername',
    aliases: ['nomebot', 'botname'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    usage: '<Novo Nome>',
    description: 'Permite meu criador alterar meu nome',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let NewName = args.join(' ')
        if (!NewName) { return message.reply('Forneça um novo nome.') }
        if (NewName.length > 32 || NewName.length < 3) { return message.reply('O meu novo nome deve estar entre **3~32 caracteres**.') }

        const SucessEmbed = new MessageEmbed().setColor('GREEN').setDescription(`${e.Check} Nome alterado com sucesso!`)
        const LoadingEmbed = new MessageEmbed().setColor('BLUE').setDescription(`${e.Loading} Alterando meu nome...`)

        return message.reply({ embeds: [LoadingEmbed] }).then(msg => {
            message.channel.sendTyping().then(() => {
                setTimeout(() => {
                    client.user.setUsername(NewName).then(data => {
                        msg.edit({ content: data, embeds: [SucessEmbed] }).catch(err => { return message.reply(`${e.Deny} | ${err}`) })
                        return message.channel.send(`${e.NezukoJump} Meu novo nome agora é **${NewName}**`)
                    }).catch(err => {
                        return message.reply(`${e.Warn} Discord Warn:\n\`${err}\``)
                    })
                }, 5000)
            })
        })

    }
}