const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'acess',
    aliases: ['giveacess', 'addacess', 'liberaracesso'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    usage: 'add/remove <@user/id> | addid/removeid <@user/id> | deleteAll',
    description: 'Libera acesso aos meus comandos (Pre-Acesso)',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {
        let user = message.mentions.members.first()

        if (['remove', 'tirar', 'retirar', 'delete'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'acess give @user`') }
            db.delete(`Client.Acess.${user.id}`)
            return message.reply(`O usuário "${user}" *\`${user.id}\`* foi retirado a lista de acesso.`)

        } else if (['removeid', 'tirarid', 'retirarid', 'deleteid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'acess removeid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply("❌ Isso não é um número.") }

            db.delete(`Client.Acess.${id}`)
            return message.reply(`O usuário "<@${id}>" *\`${id}\`* foi retirado da lista de acesso.`)

        } else if (['deleteAll', 'deleteALL', 'delall'].includes(args[0])) {

            db.delete(`Client.Acess`)
            return message.reply(`A lista de acesso foi deletada com sucesso.`)

        } else if (['id', 'giveid', 'addid'].includes(args[0])) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'acess giveid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply("❌ Isso não é um número.") }

            db.set(`Client.Acess.${id}`, true)
            return message.reply(`O usuário "<@${id}> *\`(${id})\`*" foi adicionado a lista de acesso.`)
        } else if (['add', 'give', 'liberar', 'user'].includes(args[0])) {

            if (!user) { return message.reply('`' + prefix + 'acess give @user`') }
            db.set(`Client.Acess.${user.id}`, true)
            return message.reply(`O usuário "${user}" *\`${user.id}\`* foi adicionado a lista de acesso.`)

        } else {
            return message.reply(`Use \`${prefix}help acess\` para obter os comandos.`)
        }
    }
}