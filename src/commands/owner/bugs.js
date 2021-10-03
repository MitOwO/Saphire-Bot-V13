const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'bugs',
    aliases: ['erros'],
    category: 'owner',
    UserPermissions: '',
    ClientPermissions: '',
    emoji: `${e.Warn}`,
    usage: '<bugs>',
    description: 'Permite meu criador ver uma lista de bugs decorrentes.',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let bugs = Object.entries(db.get('ComandoBloqueado') || [])
        if (!bugs.length) return message.reply(`${e.Check} | Nenhum bug na lista.`)

        const Embed = new MessageEmbed()
            .setColor('#246FE0')
            .setTitle(`${e.Gear} Lista de Bugs`)
            .setDescription(`${bugs.map(([a, b]) => `**${a}**\n\`${b}\``).join('\n')}`)
        return message.channel.send({ embeds: [Embed] })
    }
}