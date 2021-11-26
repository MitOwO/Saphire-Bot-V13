const { sdb, ServerDb } = require("../functions/database")

class GiveawayManager {
    constructor(guild) {
        this.Channel = () => guild.channels.cache.get(ServerDb.get(`Servers.${guild.id}.Giveaways.Channel`)) || false
    }

    GiveawaysOpen(GuildId) {

        let GiveawaysOpen = [],
            GwOpenDB = ServerDb.get(`Servers.${GuildId}.Giveaways.Open`)

        for (const code of GwOpenDB)
            GiveawaysOpen.push(code)

        return GiveawaysOpen
    }

    SetChannel(GuildId, ChannelId) {
        ServerDb.set(`Servers.${GuildId}.Giveaways.Channel`, ChannelId)
    }

    DeleteGiveaway(GuildId, GiveawayId) {
        if (!ServerDb.get(`Servers.${GuildId}.Giveaways.Open.${GiveawayId}`))
            return false

        ServerDb.delete(`Servers.${GuildId}.Giveaways.Open.${GiveawayId}`)
        return true
    }

}

module.exports = GiveawayManager