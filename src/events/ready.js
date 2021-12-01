const
    { db, DatabaseObj, sdb, CommandsLog, lotery } = require('../../Routes/functions/database'),
    { e, config } = DatabaseObj,
    client = require('../../index'),
    Data = require('../../Routes/functions/data'),
    MuteSystem = require('../../Routes/functions/mutesystem'),
    ReminderSystem = require('../../Routes/functions/remindersystem'),
    GiveawaySystem = require('../../Routes/functions/giveawaysystem')

client.on("ready", async () => {

    sdb.delete('Client.Rebooting')
    sdb.delete('Request')
    sdb.delete('BetRequest')
    db.delete('Aposta')
    lotery.delete('Buying')

    CommandsLog.clear()

    let Array2 = ['Procurando Nemo', 'Vingadores', 'Bob Esponja', 'Barbie Girl'],
        ActivityRandom = Array2[Math.floor(Math.random() * Array2.length)],
        Activity = sdb.get('Client.Status.SetActivity') || ActivityRandom,
        Action = sdb.get('Client.Status.SetAction') || 'WATCHING',
        Status = sdb.get('Client.Status.setStatus') || 'idle'

    client.user.setActivity(`${Activity}`, { type: `${Action}` })
    client.user.setStatus(`${Status}`)

    console.log('Event Ready | OK!')
    const msg = await client.channels.cache.get(config.LogChannelId)?.send(`⏱️ Initial Ping: \`${client.ws.ping}ms\`\n${e.Check} Login: \`${Data()}\``)

    setTimeout(() => {
        msg.delete().catch(() => { })
    }, 5000)

    setInterval(() => {

        let UsersID = Object.keys(sdb.get('Users') || {}),
            likesarray = [],
            dbarray = [],
            xparray = []

        if (UsersID.length === 0)
            return

        for (const id of UsersID) {

            let XpUser = sdb.get(`Users.${id}.Level`) || 0,
                likes = sdb.get(`Users.${id}.Likes`) || 0,
                amount = (sdb.get(`Users.${id}.Bank`) || 0) + (sdb.get(`Users.${id}.Balance`) || 0) + ((sdb.get(`Users.${id}.Cache.Resgate`) || 0))

            if (amount > 0)
                dbarray.push({ id: id, amount: amount })

            if (XpUser > 0)
                xparray.push({ id: id, amount: XpUser })

            if (likes > 0)
                likesarray.push({ id: id, amount: likes })

        }

        let RankingLevel = xparray.sort((a, b) => b.amount - a.amount),
            RankingLikes = likesarray.sort((a, b) => b.amount - a.amount),
            RankingMoney = dbarray.sort((a, b) => b.amount - a.amount)

        sdb.set('Client.TopGlobalLevel', RankingLevel[0].id)
        sdb.set('Client.TopGlobalLikes', RankingLikes[0].id)
        sdb.set('Client.TopGlobalMoney', RankingMoney[0].id)

    }, 300000)

    setInterval(() => {
        MuteSystem()
        ReminderSystem()
        GiveawaySystem()
    }, 3000)

})