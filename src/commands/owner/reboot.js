const { e } = require('../../../database/emojis.json')
const { lotery } = require('../../../Routes/functions/database')
const glob = require("glob")
const Error = require('../../../Routes/functions/errors')

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

        function RebootLock(x) {
            sdb.set('Client.Rebooting', { ON: true, Features: x || 'Nenhum dado fornecido.' })
            lotery.set('Loteria.Close', true)
            message.channel.send(`${e.Check} Accepted!\n${e.Loading} Rebooting starting...`)
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

            let keys, i = 0

            try {
                keys = Object.keys(sdb.get('Users'))
            } catch (err) {
                Error(message, err)
            }

            return message.channel.send(`${e.Loading} | Atualizando os usuários no banco de dados...`).then(async msg => {
                sdb.set('Client.Rebooting', { ON: true, Features: 'Relogando usuários no banco de dados...' })
                lotery.set('Loteria.Close', true)

                for (const id of keys) {
                    if (!await client.users.cache.get(id)) {
                        i++
                        sdb.delete(`Users.${id}`)
                    }
                }

                sdb.delete('Client.Rebooting')
                lotery.set('Loteria.Close', false)
                return msg.edit(`${e.Check} | ${i} usuários foram deletados da minha database.`).catch(() => { })
            }).catch(err => { Error(message, err) })
        }

        async function RebootGuild() {

            let keys, i = 0

            try {
                keys = Object.keys(sdb.get('Servers'))
            } catch (err) {
                Error(message, err)
            }

            return message.channel.send(`${e.Loading} | Atualizando os servidores no banco de dados...`).then(async msg => {
                sdb.set('Client.Rebooting', { ON: true, Features: 'Relodango usuários no banco de dados...' })
                lotery.set('Loteria.Close', true)

                for (const id of keys) {
                    if (!await client.guilds.cache.get(id)) {
                        i++
                        sdb.delete(`Servers.${id}`)
                    }
                }

                sdb.delete('Client.Rebooting')
                lotery.set('Loteria.Close', false)
                return msg.edit(`${e.Check} | ${i} servidores foram deletados da minha database.`).catch(() => { })
            }).catch(err => { Error(message, err) })
        }
    }
}