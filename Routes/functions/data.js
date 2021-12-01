function Data(DateInMs = 0) {
    return new Date(DateInMs + Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
}

module.exports = Data