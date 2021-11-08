const client = require('../../index')
const { sdb } = require('../../Routes/functions/database')

client.on('roleDelete', async (role) => {
    role.id === sdb.get(`Servers.${role.guild.id}.Autorole.First`) ? Autorole1() : ''
    role.id === sdb.get(`Servers.${role.guild.id}.Autorole.Second`) ? Autorole2() : ''

    function Autorole2() {
        sdb.set(`Servers.${role.guild.id}.Autorole.First`, null)
        let Msg = `🛰️ | **Global System Notification** | Autorole Desabilitado\n \nO cargo **${role.name}** configurado como **Autorole 2** foi deletado.`
        Notify(Msg)
    }

    function Autorole1() {
        sdb.set(`Servers.${role.guild.id}.Autorole.First`, null)
        let Msg = `🛰️ | **Global System Notification** | Autorole Desabilitado\n \nO cargo **${role.name}** configurado como **Autorole 1** foi deletado.`
        Notify(Msg)
    }

    async function Notify(Msg) {
        const canal = await role.guild.channels.cache.get(sdb.get(`Servers.${role.guild.id}.LogChannel`))
        canal ? canal.send(Msg).catch(() => { }) : ''
    }
})