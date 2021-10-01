const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'nota',
    aliases: [],
    category: 'economy',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: '📌',
    usage: '<nota>',
    description: 'Uma nota do meu criador',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        setTimeout(() => {
            return message.reply(`${e.Info} | Olá, Tudo bem? Espero que sim!\nNo momento, o sistema de \`economia/games/interactions/perfil\` estão em produção. Por causa da quantidade de comandos, testes estão sendo efetuados para evitar burlas ou bugs no sistema. Eu estou pegando pesado no sistema de \`moderação/permissões\` no momento. Então, espere só mais um pouco, ok?\n \n**~ Rody#1000 | Saphire Creator**`)
        }, 3000)

    }
}