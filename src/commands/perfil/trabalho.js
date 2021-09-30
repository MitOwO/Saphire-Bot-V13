const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'trabalho',
    aliases: ['profissão', 'job', 'profissao', 'setprofissão'],
    category: 'perfil',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: '👷',
    usage: '<job> ~~ Sua profissão',
    description: 'Defina um trabalho no seu perfil',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let Job = db.get(`${message.author.id}.Perfil.Trabalho`) || false

        if (!args[0]) return message.channel.send(`${e.SaphireObs} | Escolha uma profissão pro ser perfil. Você pode usar o comando assim: \`${prefix}job Bombeiro\``)

        let NewJob = args.join(' ')

        if (NewJob === Job) return message.reply(`${e.SaphireEntaoKkk} | Então... Esse já é o seu trabalho definido.`).catch(() => { })
        if (NewJob.length > 20 || NewJob.length < 4) return message.reply(`${e.SaphireRaiva} | O tamanho limite é de **4~~20 caracteres**.`).catch(() => { })

        db.set(`${message.author.id}.Perfil.Trabalho`, NewJob)
        return message.reply(`${e.SaphireFeliz} | Trabalho definido com sucesso! Você pode vê-lo no seu perfil!`).catch(() => { })
    }
}