// const { sdb } = require('./database')

// function transactions(user) {

//     const Data = []

//     const TransactionsData = [sdb.get(`${user.id}`)]
   
//     for (const dt of TransactionsData) {
//         Data.push(dt)
//     }

//     const DataFormat = Data.slice(0, 50)

//     DataFormat.length <= 0
//         ? 'Nenhuma transação efetuada até o momento'
//         : DataFormat.map((a, b) => `${a}: \`${b}\`\n`).join('\n')

//     return DataFormat

// }

// module.exports = transactions