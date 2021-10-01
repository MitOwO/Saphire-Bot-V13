const client = require('../../index')
const db = require('quick.db')

client.on('channelDelete', async (channel) => {

    if (client.users.cache.get(channel.topic))
        db.delete(`${channel.topic}.Cache.ComprovanteOpen`)

    switch (channel.id) {
        case db.get(`Servers.${channel.guild.id}.IdeiaChannel`): DeletedChannel('IdeiaChannel', 'Canal de Ideias/Sugestões'); break;
        case db.get(`Servers.${channel.guild.id}.LeaveChannel`): DeletedChannel('LeaveChannel', 'Canal de Saída'); break;
        case db.get(`Servers.${channel.guild.id}.XPChannel`): DeletedChannel('XPChannel', 'Canal de Level Up'); break;
        case db.get(`Servers.${channel.guild.id}.ReportChannel`): DeletedChannel('ReportChannel', 'Canal de Reportes'); break;
        case db.get(`Servers.${channel.guild.id}.LogChannel`): db.delete(`Servers.${channel.guild.id}.LogChannel`); break;
        case db.get(`Servers.${channel.guild.id}.WelcomeChannel.Canal`): DeletedChannel('WelcomeChannel', 'Canal de Boas-Vindas'); break;
        case db.get(`Servers.${channel.guild.id}.BuscaChannel`): DeletedChannel('BuscaChannel', 'Farming Floresta Cammum'); break;
        case db.get(`Servers.${channel.guild.id}.PescaChannel`): DeletedChannel('PescaChannel', 'Farming Pesca'); break;
        case db.get(`Servers.${channel.guild.id}.MineChannel`): DeletedChannel('MineChannel', 'Farming Mineração'); break;
        case db.get(`Servers.${channel.guild.id}.Blockchannels`): DeletedChannel('Blockchannels', 'Bloqueio de Comandos'); break;
        default: break;
    }

    function DeletedChannel(ChannelDB, CanalFunction) {
        db.delete(`Servers.${channel.guild.id}.${ChannelDB}`)
        Notify(`🛰️ | **Global System Notification** | Recurso Desabilitado\n \nO canal **${channel.name}** configurado como **${CanalFunction}** foi deletado.`)
    }

    async function Notify(Msg) {
        const canal = await client.channels.cache.get(db.get(`Servers.${channel.guild.id}.LogChannel`))
        canal ? canal.send(Msg).catch(() => { }) : ''
    }
})