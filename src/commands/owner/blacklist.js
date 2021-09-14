const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'blacklist',
    aliases: ['listanegra', 'bloqueados', 'bl'],
    category: ['owner'],
    emoji: `${e.OwnerCrow}`,
    usage: ['(owner) <add/remove> [@user] | <deleteall>'],
    description: 'Membros bloqueados no meu sistema',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        if (!args[0]) {

            let data = db.all().filter(i => i.ID.startsWith("Blacklist_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply("Não há ninguém na blacklist por enquanto")

            data.length = 20
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.fetch(id)
                user = user ? user.tag : "Usuário não encontrado"
                let Blacklist_ = data[i].data
                let razao = db.get(`Blacklist.${id}`)
                lb.push({ user: { id, tag: user }, Blacklist_, razao })
            }

            const embed = new MessageEmbed()
                .setColor("#8B0000")
                .setTitle("🚫 Blacklist System")
            lb.forEach(d => {
                embed.addField(`🆔 ${d.user.tag} \`${d.user.id}\``, `📝 ${d.razao}`)
            })
            return message.reply({ embeds: [embed] })

        } else if (['adicionar', 'add', 'colocar'].includes(args[0].toLowerCase())) {

            let user = message.mentions.members.first()
            if (!user) { return message.reply(`\`${prefix}blacklist add @user Razão\``) }

            let razao = args.slice(2).join(" ")
            if (!razao) razao = 'Nenhum motivo especificado.'

            db.set(`Blacklist_${user.id}`, user.id)
            db.set(`Blacklist.${user.id}`, razao)
            return message.reply(`O usuário "${user} *\`(${user.id})\`*" foi adicionado a Blacklist.`)

        } else if (['addid', 'adicionarid'].includes(args[0].toLowerCase())) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'blacklist addid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply("❌ Isso não é um número.") }

            let razao = args.slice(2).join(" ")
            if (!razao) razao = 'Nenhum motivo especificado.'

            db.set(`Blacklist_${id}`, id)
            db.set(`Blacklist.${id}`, razao)
            return message.reply(`${e.Check} O usuário "<@${id}> *\`(${id})\`*" foi removido da Blacklist.`)
        } else if (['remover', 'remove', 're', 'tirar'].includes(args[0].toLowerCase())) {

            let user = message.mentions.members.first()
            if (!user) { return message.reply(`\`${prefix}blacklist remove @user\``) }

            db.delete(`Blacklist_${user.id}`)
            db.delete(`Blacklist.${user.id}`)
            return message.reply(`O usuário "${user} *\`(${user.id})\`*" foi removido da Blacklist.`)

        } //else if (['removerall', 'removeall', 'reall', 'tirarall', 'deleteall', 'delall'].includes(args[0].toLowerCase())) {

        // db.delete('Blacklist')
        // return message.reply(`${e.Check} Blacklist deletada.`)

        //} 
        else if (['delid', 'removerid', 'removeid', 'reid', 'tirarid'].includes(args[0].toLowerCase())) {

            let id = args[1]
            if (!id) { return message.reply('`' + prefix + 'blacklist removeid ID`') }
            if (id.length < 17) { return message.reply("❌ Isso não é um ID") }
            if (isNaN(id)) { return message.reply("❌ Isso não é um número.") }

            db.delete(`Blacklist_${id}`)
            db.delete(`Blacklist.${id}`)
            return message.reply(`${e.Check} O usuário "<@${id}> *\`(${id})\`*" foi removido da Blacklist.`)
        } else {
            return message.reply(`${e.Info} \`${prefix}blacklist add/remove @user\``)
        }
    }
}