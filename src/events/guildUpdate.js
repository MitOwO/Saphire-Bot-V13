const client = require('../../index')
const { sdb } = require('../../Routes/functions/database')
const Notify = require('../../Routes/functions/notify')
const { UpdateServerName, RegisterServer } = require('../../Routes/functions/register')

client.on('guildUpdate', async (oldGuild, newGuild) => {

    if (!sdb.has(`Servers.${newGuild.id}`))
        return RegisterServer(newGuild)

    const GuildObj = {
        Owner: sdb.get(`Servers.${newGuild.id}.Owner`),
        OwnerId: sdb.get(`Servers.${newGuild.id}.OwnerId`),
        Name: sdb.get(`Servers.${newGuild.id}.Name`),
    }

    const { Owner, OwnerId, Name } = GuildObj
    let owner = await newGuild.members.cache.get(newGuild.ownerId).user

    if (Owner?.Owner !== owner.tag || OwnerId !== owner.id) {
        sdb.set(`Servers.${newGuild.id}.OwnerId`, owner.id)
        sdb.set(`Servers.${newGuild.id}.Owner`, owner.tag)
        Notify(newGuild.id, 'Atualização', `Os dados do*(a)* dono*(a)* do servidor foi alterado e atualizado no meu banco de dados.`)
    }

    if (Name !== newGuild.name)
        return UpdateServerName(oldGuild, newGuild)
})