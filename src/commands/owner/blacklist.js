const { e } = require('../../../Routes/emojis.json')
const { config } = require('../../../Routes/config.json')

module.exports = {
    name: 'blacklist',
    aliases: ['listanegra', 'bloqueados', 'bl'],
    category: ['owner'],
    emoji: `${e.OwnerCrow}`,
    usage: ['(owner) <add/remove> [@user] | <deleteall>'],
    description: 'Membros/Servidores bloqueados do meu sistema',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let user = message.mentions.members.first()
        let razao = args.slice(2).join(" ")
        if (!razao) razao = 'Nenhum motivo especificado.'

        if (user.id === message.author.id) return BlacklistRanking()
        if (message.author.id !== config.ownerId) return message.reply(`${e.OwnerCrow} | Este é um comando restrito da classe: Owner/Desenvolvedor`)
        if (['adicionar', 'add', 'colocar'].includes(args[0]?.toLowerCase())) return BlacklistAdd()
        if (['addid', 'adicionarid'].includes(args[0]?.toLowerCase())) return BlacklistAddById()
        if (['remover', 'remove', 're', 'tirar'].includes(args[0]?.toLowerCase())) return BlacklistRemove()
        if (['delid', 'removerid', 'removeid', 'reid', 'tirarid'].includes(args[0]?.toLowerCase())) BlacklistRemoveById()

        return message.repy(`${e.Obs} | Opções: adicionar | addid | remover | removerid | addserver | addserverid | removeserver | removerserverid`)

        function BlacklistRemoveById() {

            let id = args[1]
            if (!id) return message.reply(`${e.Deny} | \`${prefix}bl removeid id\``)
            if (id.length < 17) { return message.reply(`${e.Deny} | Isso não é um ID`) }
            if (isNaN(id)) { return message.reply(`${e.Deny} | Isso não é um número.`) }

            db.delete(`Blacklist_${id}`)
            db.delete(`Blacklist.${id}`)
            return message.reply(`${e.Check} O usuário "<@${id}> *\`${id}\`*" foi removido da Blacklist.`)
        }

        function BlacklistAddById() {

            let id = args[1]
            if (!id) return message.reply(`${e.Deny} | \`${prefix}bl addid id Razão\``)
            if (id.length < 17) { return message.reply(`${e.Deny} | Isso não é um ID`) }
            if (isNaN(id)) { return message.reply(`${e.Deny} | Isso não é um número.`) }

            db.set(`Blacklist_${id}`, id)
            db.set(`Blacklist.${id}`, razao)
            return message.reply(`${e.Check} O usuário "<@${id}> *\`${id}\`*" foi adicionado a Blacklist.`)
        }

        function BlacklistRemove() {

            if (!user) return message.reply(`${e.Deny} | \`${prefix}bl remove @user\``)

            db.delete(`Blacklist_${user.id}`)
            db.delete(`Blacklist.${user.id}`)
            return message.reply(`O usuário "${user} *\`${user.id}\`*" foi removido da Blacklist.`)
        }

        function BlacklistAdd() {

            if (args[1] !== user) {

                let id = args[1]
                if (!id) id = message.guild.id
                if (id.length < 17) { return message.reply(`${e.Deny} | Isso não é um ID`) }
                if (isNaN(id)) { return message.reply(`${e.Deny} | Isso não é um número.`) }

                db.set(`blacklistServers_${id}`, id)
                db.set(`blacklistServers.${id}`, razao)
                return message.reply(`${e.Check} O servidor *\`${id}\`*" foi adicionado a Blacklist.`)
            } else {

                if (!user) return message.reply(`${e.Deny} | \`${prefix}bl add @user razão\``)

                db.set(`Blacklist_${user.id}`, user.id)
                db.set(`Blacklist.${user.id}`, razao)
                return message.reply(`O usuário "${user} *\`${user.id}\`*" foi adicionado a Blacklist.`)
            }
        }

        async function BlacklistRanking() {
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
        }

    }
}