const { e } = require('../../database/emojis.json')
const { MessageEmbed } = require('discord.js')
const { config } = require('../../database/config.json')
const client = require('../../index')

process.on('unhandledRejection', async (reason) => {
    
    await client.users.cache.get(`${config.ownerId}`)?.send({
        embeds: [
            new MessageEmbed()
                .setColor('RED')
                .setTitle(`${e.Loud} Report de Erro | unhandledRejection`)
                .setDescription(`\`\`\`js\n${reason.stack.slice(0, 2000)}\`\`\``)
                .setFooter(`Error Code: ${reason.code || 0}`)
        ]
    }).catch(() => { console.log(reason) })

})

process.on('uncaughtExceptionMonitor', async (error, origin) => {

    await client.users.cache.get(`${config.ownerId}`)?.send({
        embeds: [
            new MessageEmbed()
                .setColor('RED').setTitle(`${e.Loud} Report de Erro | uncaughtExceptionMonitor`)
                .setDescription(`\`\`\`js\n${error.stack.slice(0, 2000)}\`\`\``)
                .setFooter(`Error Code: ${error.code || 0}`),
            new MessageEmbed()
                .setColor('RED')
                .setDescription(`\`\`\`js\n${origin}\`\`\``)
        ]
    }).catch(() => { console.log(reason); console.log(origin) })

})