const client = require('../../index')
const { MessageEmbed, Permissions } = require('discord.js')
const { e } = require('../../Routes/emojis.json')
const db = require('quick.db')
const sdb = require('../../Routes/functions/database')
const { config } = require('../../Routes/config.json')

client.on("guildCreate", async (guild) => {

    let blacklistServers = db.get(`BlacklistServers_${guild.id}`)
    if (db.get(`BlacklistServers_${guild.id}`)) guild.leave().catch(err => {
        return client.users.cache.get(config.owner).send(`${e.Deny} | Não foi possível sair da ${guild.id} \`${guild.id}\`.\n\`${err}\``).catch(() => { })
    })

    sdb.set(`Servers.${guild.id}`, {
        Name: guild.name || undefined,
        Owner: guild.members.cache.get(guild.ownerId).user.tag || undefined,
        OwnerId: guild.ownerId || undefined,
    })

    db.set(`Servers.${guild.id}`, guild.name)

    Hello();
    WarnGuildCreate()

    async function Hello() {
        let FirstMessageChannel = await guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has(Permissions.FLAGS.SEND_MESSAGES))
        FirstMessageChannel ? FirstMessageChannel.send(`${e.NezukoDance} | Oooie, eu sou a ${client.user.username}.\n${e.SaphireObs} | Meu prefiro padrão é \`-\`, mas pode muda-lo usando \`-prefix NewPrefix\`\n${e.Menhera} | Dá uma olhadinha no \`-help\``).catch(() => { }) : ''
    }

    async function WarnGuildCreate() {
        let owner = await guild.fetchOwner()
        let CanalDeConvite = await guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE))

        const Embed = new MessageEmbed().setColor('GREEN').setTitle(`${e.Loud} Um servidor me adicionou`).setDescription('Registro no banco de dados concluido!').addField('Status', `**Dono:** ${owner.user.tag} *\`(${owner.user.id})\`*\n**Membros:** ${guild.memberCount}`)

        function WithChannel() {
            CanalDeConvite.createInvite({ maxAge: 0 }).then(ChannelInvite => {
                Embed.addField('Servidor', `[${guild.name}](${ChannelInvite.url}) *\`(${guild.id})\`*`)
                client.channels.cache.get(`${config.guildCreateChannelId}`).send({ embeds: [Embed] }).catch(err => {
                    return client.users.cache.get(`${config.owner}`).send(`${e.Deny} | Erro ao registrar um servidor no canal definido. Servidor: ${guild.id} \`${guild.id}\`.\n\`${err}\`\nLinha Code: 34`).catch(() => { })
                })
            }).catch(() => { WithoutChannel() })
        }

        function WithoutChannel() {
            Embed.addField('Servidor', `${guild.name} *\`(${guild.id})\`*`)
            client.channels.cache.get(`${config.guildCreateChannelId}`).send({ embeds: [Embed] }).catch(err => {
                return client.users.cache.get(`${config.owner}`).send(`${e.Deny} | Erro ao registrar um servidor no canal definido. Servidor: ${guild.id} \`${guild.id}\`.\n\`${err}\`Linha Code: 42`).catch(err => { })
            })
        }

        CanalDeConvite ? WithChannel() : WithoutChannel()
    }
})