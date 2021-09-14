const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'setactivity',
    aliases: ['activity', 'botstatus'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    usage: '<status> <NOVOSTATUS> | <activity> <Nova atividade> | <online/idle/dnd/invisible>',
    description: 'Permite meu criador alterar as informações no meu perfil',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (['online', 'idle', 'dnd', 'invisible'].includes(args[0])) {
            db.set(`Client.Status.setStatus`, `${args[0]}`)
            client.user.setStatus(`${args[0]}`)
            return message.react('✅')

        } else if (args[0] === 'status') {

            let NewStatus = args[1]
            if (args[2]) { return message.reply('Nada além do status!') }
            if (!NewStatus) { return message.reply('Status Disponiveis: WATCHING, LISTENING, COMPETING') }

            if (['WATCHING', 'LISTENING', 'COMPETING', 'PLAYING'].includes(NewStatus)) {

                client.user.setActivity({ type: `${NewStatus}` }).then(() => {
                    db.set('Client.Status.SetAction', NewStatus)
                    return message.react(e.Check)
                }).catch(err => {
                    const Embed = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Ocorreu um erro na alteração do Status`).setDescription(`\`${err}\``)
                    return message.reply({ embeds: [Embed] })
                })
            } else {
                return message.reply('Status Disponiveis: WATCHING, LISTENING, COMPETING, PLAYING')
            }

        } else if (['activity', 'atividade'].includes(args[0])) {

            let NewActivity = args.join(' ')
            if (NewActivity) { return message.reply('Forneça uma nova atividade.') }
            if (NewActivity.length > 400 || NewActivity.length < 3) { return message.reply('O meu novo nome deve estar entre **3~32 caracteres**.') }

            client.user.setActivity(NewActivity).then(() => {
                db.set(`Client.Status.SetActivity`, NewActivity)
                return message.reply(`Atividade alterada para \`${NewActivity}\` com sucesso!`)
            }).catch(err => {
                const Embed = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Ocorreu um erro na alteração da Atividade`).setDescription(`\`${err}\``)
                return message.reply({ embeds: [Embed] })
            })
        } else {
            return message.reply(`\`${prefix}help setactivity\``)
        }
    }
}