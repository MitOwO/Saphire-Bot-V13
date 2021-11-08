const { DatabaseObj } = require('../../../Routes/functions/database')
const { e, config } = DatabaseObj

module.exports = {
    name: 'blacklist',
    aliases: ['listanegra', 'bloqueados', 'bl'],
    emoji: `${e.OwnerCrow}`,
    usage: ['[Staff Private] <add/remove> [server/@user/id]'],
    description: 'Membros/Servidores bloqueados do meu sistema',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (!args[0]) return BlacklistRanking();
        if (['servers', 'server', 'servidores', 'servidor'].includes(args[0]?.toLowerCase())) return BlacklistRankingServer()

        if (message.author.id !== config.ownerId) {
            if (!sdb.get(`Moderadores.${message.author.id}`)) return message.reply(`${e.Deny} | Este é um comando da classe Moderador.`)
        }

        let u = message.mentions.members.first() || message.mentions.repliedUser || await client.users.cache.get(args[1]) || await client.guilds.cache.get(args[1])
        if (!u) return message.reply(`${e.SaphireObs} | Opções: \`add\` | \`remover\` | \`addserver\` | \`removeserver\``)
        let target = await client.users.cache.get(u.id) || await client.guilds.cache.get(u.id)
        if (!target) return message.reply(`${e.Deny} | Alvo não encontrado.`)
        if (sdb.get(`Moderadores.${target.id}`)) return message.reply(`${e.Deny} | Este usuário é um Moderador.`)

        let razao = args.slice(2).join(" ") || 'Nenhum motivo especificado.'

        if (['adicionar', 'add', 'colocar'].includes(args[0]?.toLowerCase())) return BlacklistAdd()
        if (['remover', 'remove', 're', 'tirar'].includes(args[0]?.toLowerCase())) return BlacklistRemove()
        if (['addserver', 'addservidor'].includes(args[0]?.toLowerCase())) return ServerBlacklistAdd()
        if (['removeserver', 'removerservidor'].includes(args[0]?.toLowerCase())) return ServerBlacklistRemove()
        return message.reply(`${e.SaphireObs} | Opções: \`add\` | \`remover\` | \`addserver\` | \`removeserver\``)

        async function ServerBlacklistAdd() {

            if (!target) return message.reply(`${e.Deny} | \`${prefix}bl addserver ServerId razão\``)
            if (await client.users.cache.get(args[1])) return message.reply(`${e.Info} | Este ID é de um membro.`)
            if (db.get(`BlacklistServers_${args[1]}`)) return message.reply(`${e.Info} | Este servidor já está bloqueado.`)
            if (!await client.guilds.cache.get(args[1])) return message.reply(`${e.Info} | Este servidor não existe ou eu não estou nele.`)

            db.set(`BlacklistServers_${await client.guilds.cache.get(args[1]).id}`, true)
            sdb.set(`BlacklistServer.${await client.guilds.cache.get(args[1]).id}`, razao)
            return message.reply(`${e.Check} O servidor "${target.name || 'Nome não encontrado'} *\`${target.id}\`*" foi adicionado a Blacklist.`)
        }

        async function ServerBlacklistRemove() {

            if (!target) return message.reply(`${e.Deny} | \`${prefix}bl remove ServerId\``)
            if (await client.users.cache.get(args[1])) return message.reply(`${e.Info} | Este ID é de um membro.`)
            if (!db.get(`BlacklistServers_${await client.guilds.cache.get(args[1]).id}`)) return message.reply(`${e.Info} | Este servidor não está bloqueado.`)

            db.delete(`BlacklistServers_${await client.guilds.cache.get(args[1]).id}`)
            sdb.delete(`BlacklistServer.${await client.guilds.cache.get(args[1]).id}`)
            return message.reply(`O servidor "${target.name || 'Nome não encontrado'} *\`${target.id}\`*" foi removido da Blacklist.`)
        }

        async function BlacklistAdd() {

            if (!target) return message.reply(`${e.Deny} | \`${prefix}bl add @user razão\``)
            if (await client.guilds.cache.get(args[1])) return message.reply(`${e.Info} | Este ID é de um servidor.`)
            if (db.get(`Blacklist_${target.id}`)) return message.reply(`${e.Info} | Este usuário já está bloqueado.`)

            if (target.id === config.ownerId) {
                sdb.delete(`Moderadores.${message.author.id}`)
                return message.reply(`${e.SaphireRaivaFogo} | Por tentar bloquear meu criador, você perdeu seu cargo de Moderador!`)
            }

            db.set(`Blacklist_${target.id}`, true)
            sdb.set(`Blacklist.${target.id}`, razao)
            return message.reply(`O usuário "${target.username} *\`${target.id}\`*" foi adicionado a Blacklist.`)
        }

        async function BlacklistRemove() {

            if (!target) return message.reply(`${e.Deny} | \`${prefix}bl removeserver @user\``)
            if (await client.guilds.cache.get(args[1])) return message.reply(`${e.Info} | Este ID é de um servidor.`)
            if (!db.get(`Blacklist_${target.id}`)) return message.reply(`${e.Info} | Este usuário não está bloqueado.`)

            db.delete(`Blacklist_${target.id}`)
            sdb.delete(`Blacklist.${target.id}`)
            return message.reply(`O usuário "${target.username} *\`${target.id}\`*" foi removido da Blacklist.`)
        }

        async function BlacklistRanking() {
            let data = db.all().filter(i => i.ID.startsWith("Blacklist_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply("Não há ninguém na blacklist por enquanto")

            data.length = 20
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let user = await client.users.cache.get(id) || `${id}`
                user = user ? user.tag : "Usuário não encontrado"
                let Blacklist_ = data[i].data
                let razao = sdb.get(`Blacklist.${id}`) || 'Sem razão definida'
                lb.push({ user: { id, tag: user }, Blacklist_, razao })
            }

            const embed = new MessageEmbed()
                .setColor("#8B0000")
                .setTitle("🚫 Blacklist System")
            lb.forEach(d => {
                embed.addField(`🆔 ${d.user.tag} \`${d.user.id}\``, `📝 ${d.razao}`)
            })
            message.reply({ embeds: [embed] })
        }

        async function BlacklistRankingServer() {
            let data = db.all().filter(i => i.ID.startsWith("BlacklistServers_")).sort((a, b) => b.data - a.data)
            if (data.length < 1) return message.reply("Não há nenhum servidor na blacklist por enquanto")

            data.length = 20
            let lb = []
            for (let i in data) {
                let id = data[i].ID.split("_")[1]
                let server = await client.guilds.cache.get(id) || `${id}`
                server = server ? server.name : "Servidor não encontrado"
                let BlacklistServers_ = data[i].data
                let razao = sdb.get(`BlacklistServers.${id}`) || 'Sem razão definida'
                lb.push({ server: { id, name: server }, BlacklistServers_, razao })
            }

            const embed = new MessageEmbed()
                .setColor("#8B0000")
                .setTitle("🚫 Blacklist System Servidores")
            lb.forEach(d => {
                embed.addField(`🆔 ${d.server.name} \`${d.server.id}\``, `📝 ${d.razao}`)
            })
            message.reply({ embeds: [embed] })
        }

    }
}