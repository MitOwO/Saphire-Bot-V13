const client = require('../../index')
const { ServerDb } = require('../../Routes/functions/database')
const Notify = require('../../Routes/functions/notify')
const { UpdateServerName, RegisterServer } = require('../../Routes/functions/register')

client.on('guildUpdate', async (oldGuild, newGuild) => {

    if (!ServerDb.has(`Servers.${newGuild.id}`))
        return RegisterServer(newGuild)

    const { Owner, OwnerId, Name } = {
        Owner: ServerDb.get(`Servers.${newGuild.id}.Owner`),
        OwnerId: ServerDb.get(`Servers.${newGuild.id}.OwnerId`),
        Name: ServerDb.get(`Servers.${newGuild.id}.Name`),
    }

    let owner = await newGuild.members.cache.get(`${newGuild.ownerId}`)

    if (Owner !== owner?.user?.tag || OwnerId !== newGuild.ownerId) {
        ServerDb.set(`Servers.${newGuild.id}.OwnerId`, newGuild.ownerId)
        ServerDb.set(`Servers.${newGuild.id}.Owner`, owner?.user?.tag)
        Notify(newGuild.id, 'Atualização', `Os dados do*(a)* dono*(a)* do servidor foi alterado e atualizado no meu banco de dados.`)
    }

    if (Name !== newGuild.name)
        return UpdateServerName(oldGuild, newGuild)
})