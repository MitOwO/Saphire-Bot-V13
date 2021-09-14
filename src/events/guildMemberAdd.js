const { e } = require('../../Routes/emojis.json')
const client = require('../../index')
const db = require('quick.db')
const { Permissions } = require('discord.js')
const { config } = require('../../Routes/config.json')

client.on('guildMemberAdd', async (member) => {

    if (!member.guild.available) return
    if (!member.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return

    let role1 = member.guild.roles.cache.get(db.get(`Servers.${member.guild.id}.Autorole1`))
    if (role1) { member.roles.add(role1).catch(err => { member.guild.channels.cache.get(config.ownerId).send(`${e.Attention} | Erro no evento "guildMemberAdd" (Linha Emit: 13)\n\`${err}\``) }) }
})

client.on('guildMemberAdd', async (member) => {

    if (!member.guild.available) return
    if (!member.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return

    let role2 = member.guild.roles.cache.get(db.get(`Servers.${member.guild.id}.Autorole2`))
    if (role2) { member.roles.add(role2).catch(err => { member.guild.channels.cache.get(config.ownerId).send(`${e.Attention} | Erro no evento "guildMemberAdd" (Linha Emit: 22)\n\`${err}\``) }) }
})

client.on('guildMemberAdd', async (member) => {
    let WelcomeChannel = db.get(`Servers.${member.guild.id}.WelcomeChannel`)
    if (!WelcomeChannel || WelcomeChannel === null || WelcomeChannel === undefined) return
    const canal = await member.guild.channels.cache.get(WelcomeChannel)
    if (!canal) return
    canal.send(`${e.NezukoJump} | ${member.user.username} entrou no servidor.`).catch(err => { member.guild.channels.cache.get(config.ownerId).send(`${e.Attention} | Erro no evento "guildMemberAdd" (Linha Emit: 29)\n\`${err}\``) })
})