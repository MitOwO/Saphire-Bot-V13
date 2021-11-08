function Data() { 
    return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) 
}
module.exports = Data