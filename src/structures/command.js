const { readdirSync } = require('fs')
require("dotenv").config()
const db = require('quick.db')

module.exports = (client) => {
    readdirSync('./src/commands/').forEach(dir => {
        const commands = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.js'))
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`)
            if (pull.name) {
                client.commands.set(pull.name, pull)
            } else {
                continue
            } if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        }
    })
    console.log('Command Handler | ON')
    // db.set('Client.Status.Command', true)
    // db.set('Client.Status.Shard', true)
    // db.set('Client.Status.Index', true)
}