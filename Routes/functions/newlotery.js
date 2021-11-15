const { sdb, db, lotery, DatabaseObj } = require('./database')
const { Message, MessageEmbed } = require('discord.js')
const { e, config, Loteria } = DatabaseObj
const client = require('../../index')
const Moeda = require('./moeda')
const { PushTrasaction } = require('./transctionspush')

/**
 * @param { Message } message 
 */

async function NewLoteryGiveaway(LoteriaUsers, message) {

    let TicketsCompradosAoTodo = LoteriaUsers.length || 0
    let TicketPremiado = LoteriaUsers[Math.floor(Math.random() * LoteriaUsers.length)]
    let TicketsComprados = 0
    let Prize = Loteria.Prize?.toFixed(0) || 0

    if (LoteriaUsers.length <= 0) {
        return message.channel.send(`${e.Deny} | Sorteio da loteria cancelado por falta de participantes.`).then(() => { NewLotery() }).catch(err => { Error(message, err) })
    }

    let tag = await client.users.cache.get(TicketPremiado)

    return message.channel.send(`${e.Loading} | Iniciando um novo sorteio da loteria...`).then(msg => {

        if (!tag) {
            setTimeout(() => {
                return msg.edit(`${e.Loading} | O usuário prêmiado não está em nenhum servidor junto comigo. Deletando usuário do meu banco de dados...`).then(msg => {
                    setTimeout(() => {
                        sdb.delete(`Users.${TicketPremiado}`); db.delete(`${TicketPremiado}`); db.delete(`Bank_${TicketPremiado}`); db.delete(`Balance_${TicketPremiado}`); db.delete(`Xp_${TicketPremiado}`); db.delete(`level_${TicketPremiado}`); db.delete(`Likes_${TicketPremiado}`); db.delete(`Bitcoin_${TicketPremiado}`);
                        msg.edit(`${e.Check} | Usuário deletado com sucesso!\n${e.Loading} | Removendo todos os tickets do usuário para realizar um novo sorteio...`).then(() => {
                            setTimeout(() => {
                                lotery.pull(`Loteria.Users`, `${TicketPremiado}`)
                                msg.edit(`${e.Check} | Usuário deletado com sucesso!\n${e.Check} | Todos os tickets deste usuário foram apagados!`)
                                NewLoteryGiveaway(Loteria.Users, message)
                            }, 3500)
                        })
                    }, 3000)
                })
            }, 4500)

        } else {

            for (const TicketUser of LoteriaUsers) {
                if (TicketUser === TicketPremiado)
                    TicketsComprados++
            }

            const WinEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`💸 | Loteria ${client.user.username}`)
                .setDescription(`🎉 Vencedor*(a)*: ${tag.tag}\n:id: *\`${TicketPremiado}\`*\n💸 Prêmio: ${Prize} ${Moeda(message)}\n${tag.username} comprou 🎫 ${TicketsComprados} Tickets e tinha ${parseInt(((TicketsComprados / LoteriaUsers?.length) * 100) || 0).toFixed(2)}% de chance de ganhar`)
                .setFooter(`${TicketsCompradosAoTodo} Tickets foram comprados nesta loteria.`)

            setTimeout(() => { NewTicketAwarded(msg, tag, WinEmbed) }, 4500)
        }
    })

    async function NewTicketAwarded(msg, winner, WinEmbed) {

        msg.edit({ content: `${e.Check} | Sorteio finalizado com sucesso!`, embeds: [WinEmbed] })
        let LoteriaChannel = await client.channels.cache.get(config.LoteriaChannel)
        LoteriaChannel ? LoteriaChannel.send({ embeds: [WinEmbed] }) : ''
        sdb.add(`Users.${winner.id}.Cache.Resgate`, (Loteria.Prize || 0))
        PushTrasaction(
            winner.id,
            `💰 Recebeu ${Loteria.Prize || 0} Moedas na loteria`
        )
        try {
            winner.send(`${e.PandaProfit} | Oi oi, estou passando aqui para te falar que você foi o ganhador*(a)* da Loteria.\n${e.MoneyWings} | Você ganhou o prêmio de ${Prize} ${e.Coin} Moedas.\n${e.SaphireObs} | Você pode resgata-lo a qualquer momento usando \`-resgate\``)
        } catch (err) {
            if (err.code === 50007) {
                return message.channel.send(`${e.Deny} | Não foi possível contactar o vencedor(a).`)
            } else { Error(message, err) }

        }
        message.channel.send(`${e.Loading} | Alocando prêmio ao vencedor*(a)* e deletando todos os dados da Loteria...`).then(msg => {
            setTimeout(() => {
                msg.edit(`${e.Check} | Prêmio entregue com sucesso ao cache do vencedor*(a)* e todos os dados da Loteria foram apagados!`).catch(() => { });
                NewLotery(`${winner.tag} *\`${winner.id}\`* | ${parseInt(Loteria.Prize)?.toFixed(0) || 'Buguinho de Valores'}`)
            }, 3500)
        })
    }

    function NewLotery(LastWinner) {
        message.channel.send(`${e.Loading} | Iniciando uma nova loteria...`).then(msg => {
            setTimeout(() => {
                lotery.set('Loteria', { Close: false, Prize: 0, Users: [], LastWinner: LastWinner })
                return msg.edit(`${e.Check} | Uma nova loteria foi iniciada com sucesso!`)
            }, 4000)
        })
    }
}

module.exports = NewLoteryGiveaway