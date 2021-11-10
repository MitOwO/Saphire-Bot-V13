const { e } = require('../../database/emojis.json')
const { sdb, db } = require('./database')

async function React(message) {

    if (message.author.bot)
        return

    if (sdb.get('Client.Timeouts.React') !== null && 120000 - (Date.now() - sdb.get('Client.Timeouts.React')) > 0)
        return

    return NewReactInteraction()

    function NewReactInteraction() {
        sdb.set('Client.Timeouts.React', Date.now())

        db.add(`Balance_${message.author.id}`, 100)

        return message.react(e.Coin).catch(() => {
            db.subtract(`Balance_${message.author.id}`, 100)
            sdb.delete('Client.Timeouts.React')
            return
        })
    }
}

module.exports = React