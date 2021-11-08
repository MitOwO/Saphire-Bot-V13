const { e } = require('../../../database/emojis.json')

module.exports = {
    name: 'liberar',
    aliases: ['destravar', 'open'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    usage: '<Nome do Comando> | <All>',
    description: 'Permite meu criador liberar comandos bloqueados pelo meu sistema',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (!args[0]) return message.reply(`${e.Info} | Apenas o nome do comando que deseja desbloquear.\nExemplo: \`${prefix}liberar botinfo\``)

        if (['tudo', 'all'].includes(args[0]?.toLowerCase())) {

            sdb.delete('ComandoBloqueado')
            return message.reply(`${e.Check} | Todos os comandos foram liberados.`)

        } else if (sdb.get(`ComandoBloqueado.${args[0]?.toLowerCase()}`)) {

            sdb.delete(`ComandoBloqueado.${args[0]}`)
            return message.reply(`${e.Check} | O comando \`${args[0]}\` foi liberado com sucesso!`)
        } else {
            return message.reply(`${e.Deny} | Este comando não está bloqueado ou não existe.`)
        }
    }
}