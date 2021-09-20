const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'delete',
    aliases: ['del', 'deletar'],
    usage: '<item/class/caches> [@user]',
    category: 'owner',
    ClientPermissions: 'ADD_REACTIONS',
    emoji: `${e.OwnerCrow}`,
    description: 'permite meu criador deletar qualquer coisa de qualquer um dentro do meu sistema',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const commands = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('📋 Comandos Exclusivos de Delete (OWNER)')
            .setDescription('Com este comando, o meu criador torna possivel a opção de Deletar qualquer item de qualquer pessoa.')
            .addField('Comando', '`' + prefix + 'del Item @user`')
            .setFooter(`${prefix}itens`)

        if (!args[0]) { return message.reply({ embeds: [commands] }) }

        let user = message.mentions.members.first() || message.member

        if (['caches', 'cache'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del cache @user`') }
            db.delete(`Caches_${user.id}`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['event'].includes(args[0])) {
            db.delete(`Client.EventChannelNotification`)
            message.reply(`${e.Check} | Feito!`)
        }

        if (['bitcoin', 'bitcoins'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del bitcoin @user`') }
            db.delete(`Bitcoin_${user.id}`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['servers', 'servidores'].includes(args[0])) {

            db.delete(`Servers`)
            return message.reply('Todas as informações de todos os servidores foram apagadas.')
        }

        if (['request', 'requests'].includes(args[0])) {
            db.delete(`User.Request`)
            return message.reply('Todas as request de todos os servidores foram apagadas.')
        }

        if (['serverid'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del uesrid @user`') }
            db.delete(`Servers.${id}`)
            return message.reply(`Todos os dados do servidor *\`${id}\`* foram deletados.`)
        }

        if (['user', 'usuário'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del uesrid @user`') }

            db.delete(`User.${user.id}`)
            db.delete(`Bank_${user.id}`)
            db.delete(`Balance_${user.id}`)
            db.delete(`Xp_${user.id}`)
            db.delete(`level_${user.id}`)
            db.delete(`Vip_${user.id}`)
            db.delete(`rp_${user.id}`)
            db.delete(`Bitcoin_${user.id}`)
            return message.reply(`Todos os dados de ${user} foram deletados.`)
        }

        if (['userid', 'usuárioid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del userid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}`)
            db.delete(`Bank_${id}`)
            db.delete(`Balance_${id}`)
            db.delete(`Xp_${id}`)
            db.delete(`level_${id}`)
            db.delete(`Vip_${id}`)
            db.delete(`rp_${id}`)
            db.delete(`Bitcoin_${id}`)
            return message.reply(`Todos os dados de <@${id}> *\`${id}\`* foram deletados.`)
        }

        if (['cachesAll', 'cacheAll'].includes(args[0])) {
            db.delete('Caches_')
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['banco', 'bank'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del bank @user`') }

            db.delete(`Bank_${user.id}`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['bancoid', 'bankid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del bancoid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`Bank_${id}`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['cachorro', 'doguinho', 'dog'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del cachorro @user`') }

            db.delete(`User.${user.id}.Slot.Cachorro`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['money', 'coins', 'moedas'].includes(args[0])) {

            if (!user) return message.reply('`' + prefix + 'del money @user/args`')

            db.delete(`Bank_${user.id}`)
            db.delete(`Balance_${user.id}`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['lotery', 'loteria'].includes(args[0])) {
            db.delete('Loteria')
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['moneyid', 'coinid', 'moedasid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del moneyid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply('❌ Esse ID não é um número.') }

            db.delete(`Balance_${id}`)
            db.delete(`Bank_${id}`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['medalha'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del medalha @user`') }

            db.delete(`User.${user.id}.Slot.MedalhaAcess`)
            db.delete(`User.${user.id}.Perfil.Medalha`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['medalhaid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del medalhaid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply('❌ Esse ID não é um número.') }

            db.delete(`User.${id}.Slot.MedalhaAcess`)
            db.delete(`User.${id}.Perfil.Medalha`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['cachorroid', 'doguinhoid', 'dogid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del cachorroid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply('❌ Esse ID não é um número.') }

            db.delete(`User.${id}.Slot.Cachorro`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['estrelas', 'estrela'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del estrelas @user`') }

            db.delete(`User.${user.id}.Slot.Estrela`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['estrelasid', 'estrelaid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del estrelasid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}.Slot.Estrela`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['status'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del status @user`') }

            db.delete(`User.${user.id}.Perfil.Status`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['statusid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del statusid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}.Perfil.Status`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['xp', 'level'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del xp @user`') }

            db.delete(`Xp_${user.id}`)
            db.delete(`level_${user.id}`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['xpall', 'levelall'].includes(args[0])) {
            db.delete(`XP`)
            db.delete(`Level`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['xpid', 'levelid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del xpid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`Xp_${id}`)
            db.delete(`level_${id}`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['marry', 'casal', 'casamento'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del marry @user`') }

            db.delete(`User.${user.id}.Perfil.Marry`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['marryid', 'casalid', 'casamentoid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del marryid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}.Perfil.Marry`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['family'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del family @user`') }

            db.delete(`User.${user.id}.Perfil.Family`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['family1'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del family1 @user`') }

            db.delete(`User.${user.id}.Perfil.Family.1`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['family1id'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del family1id ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}.Perfil.Family.1`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['family2'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del family2 @user`') }

            db.delete(`User.${user.id}.Perfil.Family.2`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['family2id'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del family2id ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}.Perfil.Family.2`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['family3'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del family2 @user`') }

            db.delete(`User.${user.id}.Perfil.Family.3`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['family3id'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del family3id ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}.Perfil.Family.3`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['title', 'titulo', 'título'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del título @user`') }

            db.delete(`User.${user.id}.Perfil.TitlePerm`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['timing', 'timeout', 'cooldown', 't'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del timeout @user`') }

            if (args[1] === 'divida') {
                db.delete(`Client.Timeouts.RestoreDividas`)
                return message.reply(`${e.Check} | Feito!`)
            }

            db.delete(`User.${user.id}.Timeouts`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['titleid', 'tituloid', 'títuloid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del tituloid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}.Perfil.TitlePerm`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['remedio', 'remédio'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del remedio @user`') }

            db.delete(`User.${user.id}.Slot.Remedio`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['remedioid', 'remédioid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del remedioid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}.Slot.Remedio`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['niver', 'aniversário', 'aniversario'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'del niver @user`') }

            db.delete(`User.${user.id}.Perfil.Aniversario`)
            return message.reply(`${e.Check} | Feito!`)
        }

        if (['niverid', 'aniversárioid', 'aniversarioid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'del niverid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply(`❌ **${args[1]}** não é um número.`) }

            db.delete(`User.${id}.Perfil.Aniversario`)
            return message.reply(`${e.Check} | Feito!`)
        }

        return message.reply('Comando não encontrado no registro.')
    }
}