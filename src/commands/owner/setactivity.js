const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'setactivity',
    aliases: ['activity', 'botstatus'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    usage: '<status> <NOVOSTATUS> | <activity> <Nova atividade> | <online/idle/dnd/invisible>',
    description: 'Permite meu criador alterar as informações no meu perfil',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        ['atividade', 'activity'].includes(args[0]) ? SetActivity() : message.reply(`${e.Deny} | Assim: \`${prefix}setactivity atividade Nova Atividade\``)

        function SetActivity() {
            if (args.slice(1).join(' ').length > 35) return message.reply(`${e.Deny} | Limite máx: 35 caracteres.`)
            client.user.setActivity(args.slice(1).join(' '))
            return message.reply(`${e.Check} | Minha nova atividade é: **${args.slice(1).join(' ')}**`)
        }

    }
}