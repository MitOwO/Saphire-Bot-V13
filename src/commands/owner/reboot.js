const { e } = require('../../../database/emojis.json')
const { lotery, ServerDb, Transactions, Reminders } = require('../../../Routes/functions/database')
const glob = require("glob")

module.exports = {
    name: 'reboot',
    aliases: ['reload', 'relogar'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    description: 'Permite meu criador relogar todos os comandos ou meu servidor',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        if (['commands', 'comandos'].includes(args[0]?.toLowerCase()))
            return RebootCommands()

        if (['users', 'user', 'usuários'].includes(args[0]?.toLowerCase()))
            return RebootUsers()

        if (['servers', 'server', 'servidores', 'guild', 'guilds'].includes(args[0]?.toLowerCase()))
            return RebootGuild()

        return RebootLock(args?.join(' '))

        async function RebootLock(x) {

            const msg = await message.reply(`${e.QuestionMark} | Iniciar o reboot?`)
            for (const emoji of ['✅', '❌']) {
                msg.react(emoji).catch(() => { })
            }

            const collector = msg.createReactionCollector({
                filter: (reaction, user) => { return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id },
                time: 30000,
                errors: ['time']
            });

            collector.on('collect', (reaction, user) => {

                if (reaction.emoji.name === '✅') {

                    sdb.set('Client.Rebooting', { ON: true, Features: x || 'Nenhum dado fornecido.' })
                    lotery.set('Loteria.Close', true)
                    return msg.edit(`${e.Check} Accepted!\n${e.Loading} Rebooting starting...`)

                } else {
                    return msg.edit(`${e.Deny} | Comando cancelado.`)
                }

            });
        }

        function RebootCommands() {
            client.commands.sweep(() => true)
            glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
                if (err) return
                filePaths.forEach((file) => {
                    delete require.cache[require.resolve(file)]

                    const pull = require(file)
                    if (pull.name) {
                        message.channel.send({ content: `Comando Relogado: \`${prefix}${pull.name}\`` })
                        client.commands.set(pull.name, pull)
                    }
                })
            })
        }

        async function RebootUsers() {

            let keys = Object.keys(sdb.get('Users') || {}),
                i = 0,
                array = ["Timeouts", "Cache", "Color", "Perfil.Family", "Perfil.Marry", "Perfil.Estrela", "Perfil", "Slot.Medalha", "Slot.Machado", "Slot.Picareta", "Slot"]

            if (keys.length === 0)
                return message.reply(`${e.Info} | Nenhum usuário na database.`)

            const msg = await message.channel.send(`${e.Loading} | Atualizando os usuários no banco de dados...`)

            for (const id of keys) {

                const user = client.users.cache.get(`${id}`)

                if (!user) {

                    i++
                    sdb.delete(`Users.${id}`)
                    Transactions.delete(`Transactions.${id}`)
                    Reminders.delete(`Reminders.${id}`)

                    if (sdb.get(`Titulos.Halloween`).includes(id))
                        sdb.pull(`Titulos.Halloween`, id)

                } else {

                    for (const item of array) {

                        if (!sdb.get(`Users.${id}.${item}`))
                            sdb.delete(`Users.${id}.${item}`)

                        const keys = Object.keys(sdb.get(`Users.${id}.${item}`) || {})

                        if (keys?.length < 1)
                            sdb.delete(`Users.${id}.${item}`)

                    }
                }

            }

            return msg.edit(`${e.Check} | Todos os usuários foram atualizados na database.\n${e.Info} | ${i} usuários foram deletados da minha database`).catch(() => { })

        }

        async function RebootGuild() {

            let keys, i = 0

            try {
                keys = Object.keys(ServerDb.get('Servers') || {})
            } catch (err) {
                return message.reply(`${e.Deny} | Não há servidores na database.`)
            }

            const msg = await message.channel.send(`${e.Loading} | Atualizando os servidores no banco de dados...`)
            sdb.set('Client.Rebooting', { ON: true, Features: 'Relogando servidores no banco de dados...' })
            lotery.set('Loteria.Close', true)

            for (const id of keys) {

                const array = ["Farm", "LeaveChannel", "WelcomeChannel", "Autorole", "AfkSystem", "Moeda", "Prefix"]

                try {

                    if (!await client.guilds.cache.get(id)) {
                        i++
                        ServerDb.delete(`Servers.${id}`)
                    }

                    if (ServerDb.get(`Servers.${id}`)) {

                        const guild = await client.guilds.cache.get(id)
                        const owner = guild.members.cache.get(guild?.ownerId)?.user

                        ServerDb.set(`Servers.${id}.Name`, guild?.name || undefined)
                        if (owner?.user.tag !== ServerDb.get(`Servers.${id}.Owner`)) {
                            ServerDb.set(`Servers.${id}.Owner`, owner?.tag || undefined)
                            ServerDb.set(`Servers.${id}.OwnerId`, owner?.id || undefined)
                        }

                        for (const item of array) {

                            try {

                                if (!ServerDb.get(`Servers.${id}.${item}`))
                                    ServerDb.delete(`Servers.${id}.${item}`)

                                const keys = Object.keys(ServerDb.get(`Servers.${id}.${item}`) || {})

                                if (keys?.length < 1)
                                    ServerDb.delete(`Servers.${id}.${item}`)

                            } catch (err) { }

                        }

                    }

                } catch (err) { }

            }

            sdb.delete('Client.Rebooting')
            lotery.set('Loteria.Close', false)
            return msg.edit(`${e.Check} | Todos os servidores foram atualizados com sucesso!\n${e.Info} | ${i} servidores foram deletados da minha database.`).catch(() => { })

        }
    }
}