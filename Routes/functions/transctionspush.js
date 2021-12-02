const data = require('./data')
const { Transactions } = require('./database')

function TransactionsPush(UserOrMemberId, MessageAuthorId, FraseUser, FraseAuthor) {

    let UserData, AuthorData
    Transactions.get(`Transactions.${UserOrMemberId}`)?.length > 0
        ? UserData = [{ time: data(), data: `${FraseUser}` }, ...Transactions.get(`Transactions.${UserOrMemberId}`)]
        : UserData = [{ time: data(), data: `${FraseUser}` }]

    Transactions.get(`Transactions.${MessageAuthorId}`)?.length > 0
        ? AuthorData = [{ time: data(), data: `${FraseAuthor}` }, ...Transactions.get(`Transactions.${MessageAuthorId}`)]
        : AuthorData = [{ time: data(), data: `${FraseAuthor}` }]

    Transactions.set(`Transactions.${UserOrMemberId}`, UserData)
    Transactions.set(`Transactions.${MessageAuthorId}`, AuthorData)

}

function PushTransaction(UserId, Frase) {

    let Data
    Transactions.get(`Transactions.${UserId}`)?.length > 0
        ? Data = [{ time: data(), data: `${Frase}` }, ...Transactions.get(`Transactions.${UserId}`)]
        : Data = [{ time: data(), data: `${Frase}` }]

    Transactions.set(`Transactions.${UserId}`, Data)
}

module.exports = { TransactionsPush, PushTransaction }