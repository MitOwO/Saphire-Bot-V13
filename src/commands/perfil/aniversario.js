const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'anivesario',
    aliases: ['aniversário', 'setniver', 'niver', 'setaniversario'],
    category: 'perifl',
    ClientPermissions: 'MANAGE_MESSAGES',
    emoji: '🎉',
    usage: '<niver> <dia> <mes> <ano>',
    description: 'Configure seu aniversário no seu perfil',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const noargs = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('🎉 Data de Aniversário')
            .setDescription('Defina sua data de aniversário no seu perfil atráves deste comando. Claro, é tudo opicional.\n \nObs: É obrigatório seguir o formato do exemplo! Com **espaçamento** e no **formato DD / MM / AAAA**')
            .addField('`' + prefix + 'setniver 15 / 03 / 2007`', '**Desative**\n`' + prefix + 'setniver off`')
            .setFooter('Siga o formato, ok?')

        if (!args[0]) { return message.reply(noargs) }

        const erro = new MessageEmbed()
            .setColor('#8B0000')
            .setTitle('Siga o formato correto')
            .setDescription('✅ `' + prefix + 'setniver 15 / 03 / 2007`\n❌ ' + '`' + prefix + 'setniver 15/03/2007`')

        if (['off', 'delete', 'deletar'].includes(args[0])) {

            return message.reply('❗ Você realmente deseja deletar sua data de aniversário do perfil?').then(msg => {
                msg.react('✅').catch(err => { })
                msg.react('❌').catch(err => { })
                msg.delete({ timeout: 30000 }).catch(err => { })

                msg.awaitReactions((reaction, user) => {
                    if (message.author.id !== user.id) return

                    if (reaction.emoji.name === '✅') {
                        msg.delete().catch(err => { })
                        db.delete(`aniversario_${message.author.id}`)
                        message.reply('✅ Sua data de aniversário foi deletada com sucesso.')
                    }

                    if (reaction.emoji.name === '❌') {
                        msg.delete().catch(err => { })
                        return message.reply('✅ Comando cancelado.')
                    }
                })
            })
        }

        if (args[0] > 31) { return message.reply('Hey, fala um dia do mês, eu acho que o mês acaba no dia 31', erro) }
        if (args[0] < 1) { return message.reply('Hey, esse dia não existe nos meses', erro) }
        if (isNaN(args[0])) { return message.reply('Números por favor, números.', erro) }
        if (args[0].length > 2) { return message.reply('Hey, esse dia não existe nos meses', erro) }
        if (args[0].length < 2) { return message.reply('Hey, esse dia não existe nos meses', erro) }
        if (args[1] !== "/") { return message.reply(erro) }
        if (args[2] > 12) { return message.reply('Quantos meses tem seu ano?', erro) }
        if (args[0] > 28 && args[2] === '02') { return message.reply('Fevereiro não tem mais de 28 dias', erro) }
        if (args[2] < 1) { return message.reply('Qual é, colabora!', erro) }
        if (isNaN(args[2])) { return message.reply('Sem letras poxa', erro) }
        if (args[2].length < 2) { return message.reply('Não trolla', erro) }
        if (args[2].length > 2) { return message.reply('Tá de zoeira né?', erro) }
        if (args[0] > 30 && args[2] === "02" || "04" || "06" || "09" || "10" || "11") { return message.reply('Esse mês não tem o dia 31, baka.', erro) }
        if (args[3] !== "/") { return message.reply('Qual é, colabora!', erro) }
        if (args[4] > 2015) { return message.reply('Calminha, você tem menos de 7 anos? Você não deveria estar usando o Discord') }
        if (args[4] < 1902) { return message.reply('Eu acho que você não é a pessoa mais velha do mundo...') }
        if (isNaN(args[4])) { return message.reply('N Ú M E R O S....') }
        if (args[4].length > 4) { return message.reply('Tá de zoeira né?', erro) }
        if (args[4].length < 4) { return message.reply('Qual é...', erro) }
        if (args[5]) { return message.reply('Espera um pouco, essa data não é válida!', erro) }

        let atual = db.get(`aniversario_${message.author.id}`)
        let niver = `${args[0]}/${args[2]}/${args[4]}`

        if (niver === atual) { return message.reply('✅ Esta já é sua data de aniversário atual.') }

        const confirm = new MessageEmbed()
            .setColor('#22A95E')
            .setDescription(':question: | **Sua data de aniversário está correta?**\n`' + niver + '`')

        const ValidandoEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`🔄 | Validando dados para autenticação...`)
            .setDescription(`Usuário: ${message.author} *(${message.author.id})*\nData: ${niver}`)

        return message.reply(confirm).then(msg => {
            msg.react('✅').catch(err => { })
            msg.react('❌').catch(err => { })
            setTimeout(function () { msg.reactions.removeAll().catch(err => { }) }, 30000)
            setTimeout(function () { msg.edit(confirm.setDescription('Tempo de resposta expirado.').setColor('#808080')).catch(err => { }) }, 30000)

            msg.awaitReactions((reaction, user) => {
                if (message.author.id !== user.id) return

                if (reaction.emoji.name === '✅') {
                    msg.delete().catch(err => { })

                    message.reply(ValidandoEmbed).then(m => {

                        setTimeout(function () {
                            db.set(`aniversario_${message.author.id}`, niver)
                            m.edit(`${prefix}perfil`, ValidandoEmbed.setColor('GREEN').setTitle('🎉 Sucesso!').setDescription('✅ | Sua data de aniversário foi salva com sucesso.'))
                        }, 11000)

                        setTimeout(function () { m.edit(ValidandoEmbed.setDescription('🔄 | Autenticando informações no banco de dados...').setTitle('Por favor, espere...')) }, 6000)
                    })
                }

                if (reaction.emoji.name === '❌') {
                    msg.delete().catch(err => { })
                    return message.reply('Comando cancelado.')
                }
            })
        })
    }
}