const data = require('./data')
const { sdb } = require('./database')

function TransactionsPush(UserOrMemberId, MessageAuthorId, FraseUser, FraseAuthor) {

    let UserData, AuthorData
    sdb.get(`Users.${UserOrMemberId}.Transactions`)?.length > 0
        ? UserData = [{ time: data(), data: `${FraseUser}` }, ...sdb.get(`Users.${UserOrMemberId}.Transactions`)]
        : UserData = [{ time: data(), data: `${FraseUser}` }]

    sdb.get(`Users.${MessageAuthorId}.Transactions`)?.length > 0
        ? AuthorData = [{ time: data(), data: `${FraseAuthor}` }, ...sdb.get(`Users.${MessageAuthorId}.Transactions`)]
        : AuthorData = [{ time: data(), data: `${FraseAuthor}` }]

    sdb.set(`Users.${UserOrMemberId}.Transactions`, UserData)
    sdb.set(`Users.${MessageAuthorId}.Transactions`, AuthorData)

}

function PushTrasaction(UserId, Frase) {

    let Data
    sdb.get(`Users.${UserId}.Transactions`)?.length > 0
        ? Data = [{ time: data(), data: `${Frase}` }, ...sdb.get(`Users.${UserId}.Transactions`)]
        : Data = [{ time: data(), data: `${Frase}` }]

    sdb.set(`Users.${UserId}.Transactions`, Data)
}

module.exports = { TransactionsPush, PushTrasaction }