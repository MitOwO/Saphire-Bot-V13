const client = require('../../index'),
    { Giveaway } = require('../../Routes/functions/database')

client.on('messageDelete', async message => {

    if (Giveaway.get(`Giveaways.${message.guild.id}.${message.id}`))
        return Giveaway.delete(`Giveaways.${message.guild.id}.${message.id}`)

    // ToDo: Adicionar função Notify pra avisar que o sorteio foi deletado

    return

})