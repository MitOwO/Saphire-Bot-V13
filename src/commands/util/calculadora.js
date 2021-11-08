const simplydjs = require('simply-djs')

module.exports = {
    name: 'calculadora',
    aliases: ['cal'],
    category: 'util',
    emoji: '🧮',
    usage: 'Não informado',
    description: 'Calculado simples',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {
        try {
            await simplydjs.calculator(message, { embedColor: '#246FE0', credit: false })
        } catch (err) { return }
    }
}