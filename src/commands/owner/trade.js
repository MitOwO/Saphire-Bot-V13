const { e } = require('../../../database/emojis.json')

module.exports = {
    name: 'trade',
    category: 'owner',
    emoji: 'T',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        const msg = await message.reply(`${e.Loading} | Sincronizando databases...`)

        client.users.cache.forEach(user => {

            const Money = db.get(`Balance_${user.id}`) || 0
            const Bank = db.get(`Bank_${user.id}`) || 0
            const Likes = db.get(`Likes_${user.id}`) || 0
            db.delete(`Balance_${user.id}`)
            db.delete(`Bank_${user.id}`)
            db.delete(`Likes_${user.id}`)

            if (!sdb.get(`Users.${user.id}.Balance`))
                sdb.set(`Users.${user.id}.Balance`, Money)

            if (!sdb.get(`Users.${user.id}.Bank`))
                sdb.set(`Users.${user.id}.Bank`, Bank)

            if (!sdb.get(`Users.${user.id}.Likes`))
                sdb.set(`Users.${user.id}.Likes`, Likes)

        })

        return msg.edit(`${e.Check} | Sincronização de database concluida!`).catch()

    }
}