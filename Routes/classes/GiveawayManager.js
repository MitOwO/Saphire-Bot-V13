const { sdb } = require("../functions/database")

class GiveawayManager {
    constructor(guild) {
        this.Channel = async () => { return guild.channels.cache.get(sdb.get(`Servers.${guild.id}.GiveawayChannel`)) }
    }

    openGiveaways() {
        const GiveawaysOpen = []

        const GwOpenDB = sdb.get(`Servers.${guild.id}.Sorteios.Open`)

        for (const code of GwOpenDB) {
            GiveawaysOpen.push(code)
        }

        return GiveawaysOpen
    }

}

module.exports = GiveawayManager