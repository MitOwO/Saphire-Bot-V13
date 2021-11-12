const { DatabaseObj, ServerDb, db } = require('../../Routes/functions/database')
const { e, config } = DatabaseObj
const client = require('../../index')
const { MessageEmbed } = require('discord.js')

client.on("guildDelete", async (guild) => {

    ServerDb.delete(`Servers.${guild.id}`)
    let owner = await guild.fetchOwner()

    const Embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${e.Loud} Um servidor me removeu`)
        .setDescription('Todos os dados deste servidor foram apagados.')
        .addField('Servidor', `${guild.name} *\`(${guild.id})\`*`)
        .addField('Status', `**Dono:** ${owner.user.tag} *\`(${owner.user.id})\`*\n**Membros:** ${guild.memberCount}`)


    await client.channels.cache.get(config.LogChannelId)?.send(`${e.Deny} | O servidor **${guild.name}** foi excluído com sucesso!`).catch(() => { })
    await client.channels.cache.get(config.guildDeleteChannelId)?.send({ embeds: [Embed] }).catch(() => { })
})