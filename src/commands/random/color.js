const { c } = require('../../../Routes/hex.json')
const { e } = require('../../../Routes/emojis.json')
const { N } = require('../../../Routes/nomes.json')

module.exports = {
    name: 'color',
    aliases: ['cor', 'hex', 'cores', 'codhex'],
    category: 'random',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: '🎨',
    usage: '<color> <ColorName>/<#hex>',
    description: `Cores em #HEX. Use \`cor\` para mais informações.`,

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const embed = new MessageEmbed().setFooter(`${prefix}cor #hex`)

        const NoArgsEmbed = new MessageEmbed().setColor('BLUE').setTitle(`${e.Info} Tabelinha de Cores #HEX`).addField('🎨 Cores Disponiveis', 'Preto\n Azul\n Ciano\n Verde\n Vermelho\n Rosa\n Roxo\n Laranja\n Amarelo\n Branco').addField('Comando', `\`${prefix}cor <cor>\` Códigos #hex\n\`${prefix}cor <#hex>\` A cor da #hex`).setFooter(`Ideia do comando: ${N.Makol}`)

        let HexColors = ''

        if (args[1]) {
            return message.reply(`${e.Deny} | Nada além da \`<cor/#hex>\`. Quer ajuda? Use \`${prefix}cor\``)
        } else if (!args[0]) {

            return message.reply({ embeds: [NoArgsEmbed] })

        } else if (args[0].startsWith("#")) {

            if (args[0].length !== 7) {
                return message.reply(`${e.Deny} | Código #HEX Inválido. Verifique se o #HEX possui 7 digitos, incluindo a #.`)
            } else {
                const EmbedHex = new MessageEmbed().setColor(args[0]).setDescription(`🎨 \`${args[0]}\``)
                return message.reply({ embeds: [EmbedHex] }).catch(err => {
                    return message.reply(`${e.Deny} | Código #HEX Inválido.`)
                })
            }

        } else if (['preto', 'black', 'dark', 'preta'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Preto').setColor(c.Black[1])
            for (let i = 0; i < c.Black.length; i++) {
                HexColors += `\n${i + 1}. ${c.Black[i]}`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else if (['blue', 'azul'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Azul').setColor(c.Blue[8])
            for (let i = 0; i < c.Blue.length; i++) {
                HexColors += `${i + 1}. ${c.Blue[i]}\n`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else if (['cyan', 'ciano'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Ciano').setColor(c.Cyan[1])
            for (let i = 0; i < c.Cyan.length; i++) {
                HexColors += `${i + 1}. ${c.Cyan[i]}\n`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else if (['green', 'verde'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Verde').setColor(c.Green[2])
            for (let i = 0; i < c.Green.length; i++) {
                HexColors += `${i + 1}. ${c.Green[i]}\n`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else if (['red', 'vermelho'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Vermelho').setColor(c.Red[1])
            for (let i = 0; i < c.Red.length; i++) {
                HexColors += `${i + 1}. ${c.Red[i]}\n`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else if (['pink', 'rosa'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Rosa').setColor(c.Pink[1])
            for (let i = 0; i < c.Pink.length; i++) {
                HexColors += `${i + 1}. ${c.Pink[i]}\n`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else if (['purple', 'roxo'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Roxo').setColor(c.Purple[1])
            for (let i = 0; i < c.Purple.length; i++) {
                HexColors += `${i + 1}. ${c.Purple[i]}\n`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else if (['orange', 'laranja'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Laranja').setColor(c.Orange[1])
            for (let i = 0; i < c.Orange.length; i++) {
                HexColors += `${i + 1}. ${c.Orange[i]}\n`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else if (['yellow', 'amarelo'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Amarelo').setColor(c.Yellow[1])
            for (let i = 0; i < c.Yellow.length; i++) {
                HexColors += `${i + 1}. ${c.Yellow[i]}\n`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else if (['white', 'branco'].includes(args[0])) {

            embed.setTitle('🎨 #HEX: Branco').setColor(c.White[0])
            for (let i = 0; i < c.White.length; i++) {
                HexColors += `${i + 1}. ${c.White[i]}\n`
                embed.setDescription(HexColors)
            }
            return message.reply({ embeds: [embed] })

        } else {
            return message.reply(`${e.Deny} | Cor não listada. Use \`${prefix}cor\` que te mando a lista.`)
        }
    }
}