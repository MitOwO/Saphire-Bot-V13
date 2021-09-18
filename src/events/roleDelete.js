const client = require('../../index')
const db = require('quick.db')

client.on('roleDelete', async (role) => {
    role.id === db.get(`Servers.${role.guild.id}.Autorole1`) ? Autorole1() : ''
    role.id === db.get(`Servers.${role.guild.id}.Autorole2`) ? Autorole2() : ''

    function Autorole2() {
        db.delete(`Servers.${role.guild.id}.Autorole2`);
        let Msg = `🛰️ | **Global System Notification** | Autorole Desabilitado\n \nO cargo **${role.name}** configurado como **Autorole 2** foi deletado.`
        Notify(Msg)
    }

    function Autorole1() {
        db.delete(`Servers.${role.guild.id}.Autorole1`);
        let Msg = `🛰️ | **Global System Notification** | Autorole Desabilitado\n \nO cargo **${role.name}** configurado como **Autorole 1** foi deletado.`
        Notify(Msg)
    }

    async function Notify(Msg) {
        const canal = await client.channels.cache.get(db.get(`Servers.${role.guild.id}.LogChannel`))
        canal ? canal.send(Msg).catch(() => { }) : ''
    }
})