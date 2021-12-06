let Data = require('./data'),
    { Transactions } = require('./database'),
    UserData,
    AuthorData,
    DataToPush,
    data = Data(0, true)

function TransactionsPush(UserOrMemberId, MessageAuthorId, FraseUser, FraseAuthor) {

    Transactions.get(`Transactions.${UserOrMemberId}`)?.length > 0
        ? UserData = [{ time: data, data: `${FraseUser}` }, ...Transactions.get(`Transactions.${UserOrMemberId}`)]
        : UserData = [{ time: data, data: `${FraseUser}` }]

    Transactions.get(`Transactions.${MessageAuthorId}`)?.length > 0
        ? AuthorData = [{ time: data, data: `${FraseAuthor}` }, ...Transactions.get(`Transactions.${MessageAuthorId}`)]
        : AuthorData = [{ time: data, data: `${FraseAuthor}` }]

    Transactions.set(`Transactions.${UserOrMemberId}`, UserData)
    Transactions.set(`Transactions.${MessageAuthorId}`, AuthorData)

}

function PushTransaction(UserId, Frase) {

    Transactions.get(`Transactions.${UserId}`)?.length > 0
        ? DataToPush = [{ time: data, data: `${Frase}` }, ...Transactions.get(`Transactions.${UserId}`)]
        : DataToPush = [{ time: data, data: `${Frase}` }]

    Transactions.set(`Transactions.${UserId}`, DataToPush)
}

module.exports = { TransactionsPush, PushTransaction }