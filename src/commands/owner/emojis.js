const { e } = require('../../../database/emojis.json')
const { emojis } = require('../../../Routes/functions/database')

// #246FE0 - Azul Saphire
module.exports = {
    name: 'emojis',
    aliases: ['setemoji'],
    category: 'owner',
    emoji: `${e.SaphireFeliz}`,
    usage: '<setemoji> <add/remove> <emoji>',
    description: 'Permite meu criador adicionar ou emojis emojis do meu banco de dados',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (['get', 'tem'].includes(args[0]?.toLowerCase())) return GetEmoji(args[1])

        if (['set', 'new', 'novo', 'add'].includes(args[0]?.toLowerCase())) {

            let Nome = args[1]
            let Emoji = args[2]

            if (args[3])
                return message.reply(`${e.Info} | Comando: \`${prefix}emojis new NomeDoEmoji Emoji\`. Nada além disso.`)

            if (!Nome || !Emoji)
                return message.reply(`${e.Info} | Comando: \`${prefix}emojis new NomeDoEmoji Emoji\``)

            if (emojis.get(`e.${Nome}`))
                return message.reply(`${e.Info} | Este emojis já existe no meu banco de dados.`)

            if (Nome.startsWith('<'))
                return message.reply(`${e.Info} | Comando: \`${prefix}emojis new NomeDoEmoji Emoji\``)

            return NewEmoji(Nome, Emoji)
        }

        if (['all', 'tudo'].includes(args[0]?.toLowerCase()))
            return AllEmojis()

        if (['delete', 'del', 'remove', 'tirar', 'excluir'].includes(args[0]?.toLowerCase())) {

            let Name = args[1]

            if (!Name) {

                try {

                    let Emojis = Object.entries(emojis.get('e'))

                    let Page1 = Emojis?.slice(0, 50)?.map(([a, b]) => `\`${a}\`: ${b}`).join('\n') || false
                    let Page2 = Emojis?.slice(50, 100)?.map(([a, b]) => `\`${a}\`: ${b}`).join('\n') || false
                    let Page3 = Emojis?.slice(100, 150)?.map(([a, b]) => `\`${a}\`: ${b}`).join('\n') || false

                    function Fil() {
                        if (Page3 && Page2 && Page1)
                            return 1

                        if (Page2 && Page1)
                            return 2

                        if (Page1)
                            return 3

                        return 0
                    }

                    const embed1 = new MessageEmbed().setColor('#246FE0').setDescription(`${Page1}`)
                    const embed2 = new MessageEmbed().setColor('#246FE0').setDescription(`${Page2}`)
                    const embed3 = new MessageEmbed().setColor('#246FE0').setDescription(`${Page3}`)

                    switch (Fil()) {
                        case 1:
                            message.reply({ content: `${e.Deny} | Diga o nome do emoji que deseja excluir.`, embeds: [embed1, embed2, embed3] })
                            break;
                        case 2:
                            message.reply({ content: `${e.Deny} | Diga o nome do emoji que deseja excluir.`, embeds: [embed1, embed2] })
                            break;
                        case 3:
                            message.reply({ content: `${e.Deny} | Diga o nome do emoji que deseja excluir.`, embeds: [embed1] })
                            break;
                        default:
                            message.reply(`${e.Info} | Não há emojis no banco de dados.`)
                            break;
                    }

                    return

                } catch (err) {
                    return message.reply(`${e.Warn} | Falha ao enviar os nomes dos emojis.\n\`${err}\``)
                }

            } else {
                return DeleteEmoji(Name)
            }

        }

        return message.reply(`${e.Info} | Argumentos: \`get, new, delete, all\``)

        function AllEmojis() {

            try {

                let Emojis = Object.entries(emojis.get('e'))

                let Page1 = Emojis?.slice(0, 50)?.map(([a, b]) => `\`${a}\`: ${b}`).join('\n') || false
                let Page2 = Emojis?.slice(50, 100)?.map(([a, b]) => `\`${a}\`: ${b}`).join('\n') || false
                let Page3 = Emojis?.slice(100, 150)?.map(([a, b]) => `\`${a}\`: ${b}`).join('\n') || false

                function Fil() {
                    if (Page3 && Page2 && Page1) return 1
                    if (Page2 && Page1) return 2
                    if (Page1) return 3
                    return 0
                }

                const embed1 = new MessageEmbed().setTitle(`${client.user.username} Emoji's Database`).setColor('#246FE0').setDescription(`${Page1}`)
                const embed2 = new MessageEmbed().setColor('#246FE0').setDescription(`${Page2}`)
                const embed3 = new MessageEmbed().setColor('#246FE0').setDescription(`${Page3}`)

                switch (Fil()) {
                    case 1:
                        message.reply({ embeds: [embed1, embed2, embed3] })
                        break;
                    case 2:
                        message.reply({ embeds: [embed1, embed2] })
                        break;
                    case 3:
                        message.reply({ embeds: [embed1] })
                        break;
                    default:
                        message.reply(`${e.Info} | Não há emojis no banco de dados.`)
                        break;
                }

                return

            } catch (err) {
                return message.reply(`${e.Warn} | Falha ao enviar os nomes dos emojis.\n\`${err}\``)
            }
        }

        function GetEmoji(Emoji) {
            let emoji = emojis.get(`e.${Emoji}`)
            emoji ? message.reply(`${emoji}`) : message.reply(`${e.Deny} | Emoji não encontrado.`)
        }

        function NewEmoji(Nome, Emoji) {
            emojis.set(`e.${Nome}`, Emoji)
            return message.reply(`${e.Check} | Novo emoji inserido com sucesso no banco de dados! Emoji in DB: ${emojis.get(`e.${Nome}`)}`)
        }

        function DeleteEmoji(Name) {
            if (!emojis.get(`e.${Name}`))
                return message.reply(`${e.Deny} | Emoji não encontrado.`)

            emojis.delete(`e.${Name}`)
            return message.reply(`${e.Check} | Emoji apagado com sucesso!`)
        }

    }
}