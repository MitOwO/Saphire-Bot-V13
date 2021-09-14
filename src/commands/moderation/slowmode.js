const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'slowmode',
    aliases: ['modolento', 'slow'],
    category: 'moderation',
    UserPermissions: 'MANAGE_CHANNELS',
    ClientPermissions: 'MANAGE_CHANNELS',
    emoji: `${e.ModShield}`,
    usage: '<slowmode> <TEMPO EM SEGUNDOS> [#canal(opicional)]',
    description: 'Ative o slowmode no chat',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let canal = message.mentions.channels.first() || message.channel

        const noargs = new MessageEmbed().setColor('BLUE').setTitle(`${e.QuestionMark} | Slowmode Command`).setDescription('Com o slowmode, você dita um intervalo em que os membros podem mandar mensagens nos canais.').addFields({ name: 'Ative o Slowmode', value: '`' + prefix + 'slowmode 10` *(segundos)*', inline: true }, { name: 'Desative o Slowmode', value: '`' + prefix + 'slowmode off`', inline: true })

        if (!args[0]) { return message.reply({ embeds: [noargs] }) }

        if (['off', '0', 'desligar'].includes(args[0])) {
            canal.setRateLimitPerUser(0).then(() => {
                return message.reply(`${e.Check} | Slowmode desativado.`)
            }).catch(err => {
                return message.channel.send(`${e.Deny} | Ocorreu um erro ao desativar o slowmode . Caso não saiba resolver este problema, use o comando \`${prefix}bug\` e relate o problema.\n\`${err}\``)
            })
        } else {

            if (isNaN(args[0])) { return message.reply(`${e.Deny} | O tempo deve ser um número entre **1 ~ 21600 segundos**`) }
            if (args[0] < 1 || args[0] > 21600) return message.reply(`${e.Deny} | O tempo mínimo é **1 segundo**, o máximo é **21600 segundos** *(6 horas)*`)

            canal.setRateLimitPerUser(args[0], [`Author do comando: ${message.author.tag}`]).then(() => {
                return message.reply(`${e.Check} | Slowmode ativado em ${args[0]} segundos.`)
            }).catch(err => {
                return message.channel.send(`${e.Deny} | Ocorreu um erro ao setar o slowmode em **${args[1]} segundos**. Caso não saiba resolver este problema, use o comando \`${prefix}bug\` e relate o problema.\n\`${err}\``)
            })
        }
    }
}