const { db, sdb, Reminders, lotery, Transactions } = require('./database'),
    LoteriaUsers = lotery.get('Loteria.Users') || [],
    RemindersUsers = Reminders.get('Reminders'),
    UsersDatabase = sdb.get('Users')

async function DeleteUser(UserId) {

    if (LoteriaUsers.includes(UserId))
        lotery.pull('Loteria.Users', UserId)

    if (RemindersUsers[UserId])
        Reminders.delete(`Reminders.${UserId}`)

    if (UsersDatabase[UserId])
        sdb.delete(`Users.${UserId}`)

    db.delete(`${UserId}`)
    db.delete(`Bitcoin_${UserId}`)

    return true

}

module.exports = DeleteUser