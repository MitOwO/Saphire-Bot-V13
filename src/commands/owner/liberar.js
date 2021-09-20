const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'liberar',
    aliases: ['destravar', 'open'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    usage: '<Nome do Comando> | <All>',
    description: 'Permite meu criador liberar comandos bloqueados pelo meu sistema',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (!args[0]) return message.reply(`Apenas o nome do comando que deseja desbloquear.\nExemplo: \`${prefix}liberar botinfo\``)

        if (['tudo', 'all'].includes(args[0]?.toLowerCase())) {
            db.delete('ComandoBloqueado')
            return message.reply('Todos os comandos foram liberados.')
        }

        if (args[1]) { return message.reply(`Apenas o \`args[0]\`, nada mais.`) }

        if (args[0]) {

            if (!db.get(`ComandoBloqueado.${args[0]}`)) {
                return message.reply(`O argumento \`${args[0]}\` não se encontra na lista de Comandos Bloqueados.`)
            } else {
                db.delete(`ComandoBloqueado.${args[0]}`)
                return message.reply(`O comando \`${args[0]}\` foi liberado com sucesso!`)
            }
        } else {
            return message.reply('Argumento invalido.')
        }
    }
}