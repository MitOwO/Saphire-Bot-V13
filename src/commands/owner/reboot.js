const glob = require("glob")
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'reboot',
    aliases: ['reload', 'relogar'],
    category: 'owner',
    emoji: `${e.OwnerCrow}`,
    description: 'Permite meu criador relogar todos os comandos ou meu servidor',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        let features = ''
        args[0] ? features = args.join(' ') : features = 'Nenhum dado fornecido.'
        
        if (['commands', 'comandos'].includes(args[0]?.toLowerCase())){
            RebootCommands()
        } else {
            RebootLock(features)
        }

        function RebootLock(x) {
            db.set('Rebooting.ON', true)
            db.set('Lotery.Close', true)
            db.set('Rebooting.Features', `${x}`)
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
    }
}