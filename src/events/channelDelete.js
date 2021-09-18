const client = require('../../index')
const db = require('quick.db')

client.on('channelDelete', async (channel) => {
    channel.id === db.get(`Servers.${channel.guild.id}.IdeiaChannel`) ? IdeiaChannelDeleted() : ''
    channel.id === db.get(`Servers.${channel.guild.id}.LeaveChannel`) ? LeaveChannelDeleted() : ''
    channel.id === db.get(`Servers.${channel.guild.id}.XPChannel`) ? XPChannelDeleted() : ''
    channel.id === db.get(`Servers.${channel.guild.id}.ReportChannel`) ? ReportChannelDeleted() : ''
    channel.id === db.get(`Servers.${channel.guild.id}.LogChannel`) ? LogChannelDeleted() : ''
    channel.id === db.get(`Servers.${channel.guild.id}.WelcomeChannel`) ? WelcomeChannelDeleted() : ''

    function IdeiaChannelDeleted() {
        db.delete(`Servers.${channel.guild.id}.IdeiaChannel`)
        let Msg = `🛰️ | **Global System Notification** | Recurso Desabilitado\n \nO canal **${channel.name}** configurado como **Canal de Ideias/Sugestões** foi deletado.`
        Notify(Msg)
    }

    function LeaveChannelDeleted() {
        db.delete(`Servers.${channel.guild.id}.LeaveChannel`)
        let Msg = `🛰️ | **Global System Notification** | Recurso Desabilitado\n \nO canal **${channel.name}** configurado como **Canal de Saída** foi deletado.`
        Notify(Msg)
    }

    function XPChannelDeleted() {
        db.delete(`Servers.${channel.guild.id}.XPChannel`)
        let Msg = `🛰️ | **Global System Notification** | Recurso Desabilitado\n \nO canal **${channel.name}** configurado como **Canal de Level Up** foi deletado.`
        Notify(Msg)
    }

    function ReportChannelDeleted() {
        db.delete(`Servers.${channel.guild.id}.ReportChannel`)
        let Msg = `🛰️ | **Global System Notification** | Recurso Desabilitado\n \nO canal **${channel.name}** configurado como **Canal de Reporte/Denúncia** foi deletado.`
        Notify(Msg)
    }

    function LogChannelDeleted() { db.delete(`Servers.${channel.guild.id}.LogChannel`) }

    function WelcomeChannelDeleted() {
        db.delete(`Servers.${channel.guild.id}.WelcomeChannel`)
        let Msg = `🛰️ | **Global System Notification** | Recurso Desabilitado\n \nO canal **${channel.name}** configurado como **Canal de Boas-Vindas** foi deletado.`
        Notify(Msg)
    }

    async function Notify(Msg) {
        const canal = await client.channels.cache.get(db.get(`Servers.${channel.guild.id}.LogChannel`))
        canal ? canal.send(Msg).catch(() => { }) : ''
    }
})