const { e } = require('../../../database/emojis.json')
const { Clan } = require('../../../Routes/functions/database')
const Moeda = require('../../../Routes/functions/moeda')
const PassCode = require('../../../Routes/functions/PassCode')
const Vip = require('../../../Routes/functions/vip')
const color = require('../../../Routes/functions/colors')
const { PushTrasaction } = require('../../../Routes/functions/transctionspush')

module.exports = {
    name: 'clan',
    aliases: ['team', 'clã'],
    category: 'vip',
    emoji: '🛡️',
    usage: '<clan> <info>',
    description: 'Saphire\'s Clan System',

    run: async (client, message, args, prefix, db, MessageEmbed, request, sdb) => {

        let { Clans, AtualClan, user } = {
            Clans: Clan.get('Clans') || {},
            AtualClan: sdb.get(`Users.${message.author.id}.Clan`),
            user: message.mentions.members.first() || message.guild.members.cache.get(args[1]),
        }

        let keys = Object.keys(Clans)

        let key

        for (const i of keys) {
            if (AtualClan === Clans[i].Name) {
                key = i
                break
            }
        }

        const Admin = Clan.get(`Clans.${key}.Admins`)?.includes(message.author.id)
        const Owner = Clan.get(`Clans.${key}.Owner`) === message.author.id

        let Argument = args[0] || 'NoArgs'

        if (!args[1] && user) {

            let ClanKey

            for (const k of keys) {

                if (Clan.get(`Clans.${k}.Name`) === sdb.get(`Users.${user.id}.Clan`)) {
                    ClanKey = k
                    break;
                }

            }

            const UserClan = sdb.get(`Users.${user.id}.Clan`) ? `**${sdb.get(`Users.${user.id}.Clan`)}** | \`${ClanKey}\`` : 'Não possui'
            return message.reply(`${e.Info} | ${user.user.tag} Clan Status: ${UserClan}`)
        }

        switch (Argument.toLowerCase()) {
            case 'create': case 'criar': NewClan(); break;
            case 'invite': case 'convidar': case 'convite': NewClanInvitation(); break;
            case 'expulsar': case 'kick': case 'banir': case 'ban': KickMember(); break;
            case 'list': case 'membros': case 'members': case 'lista': MemberList(); break;
            case 'staff': case 'mod': case 'adm': case 'admin': AddOrRemoveStaff(); break;
            case 'delete': case 'apagar': case 'deletar': DeleteClan(); break;
            case 'doar': case 'donate': NewDonate(); break;
            case 'status': case 'perfil': ClanStatus(); break;
            case 'leave': case 'sair': LeaveClan(); break;
            case 'transferirposse': NewClanOwner(); break;
            case 'editname': EditClanName(); break;
            case 'rank': ClanRanking(); break;
            case 'info': case 'help': case 'help': ClanInfo(); break;
            default:
                message.reply(`${e.Info} | Caso tenha alguma dúvida de como usar este comando, use \`${prefix}clan info\``)
                break;
        }

        function NewClan() {

            if (!Vip(message.author.id))
                return message.reply(`${e.Deny} | Apenas membros vips podem criar um clan.`)

            if (AtualClan)
                return message.reply(`${e.Deny} | Você já pertence a um clan.`)

            let ClanName = args.slice(1).join(' ')
            let Money = db.get(`Balance_${message.author.id}`) || 0
            let ID = Pass()

            function Pass() {
                const code = PassCode(10)
                return Clan.get(`Clans.${code}`) ? Pass() : code
            }

            if (Money < 5000000)
                return message.reply(`${e.Deny} | Você precisa ter pelo menos **5000000 ${Moeda(message)}** na carteira para criar um clan.`)

            if (!ClanName)
                return message.reply(`${e.Info} | Você precisa fornecer um nome para a criação do seu clan.`)

            const reg = /^[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/i
            if (!reg.test(ClanName))
                return message.reply(`${e.Deny} | O nome do clan aceita apenas **letras, letras com acento e números**`)

            if (ClanName.length > 30)
                return message.reply(`${e.Deny} | O nome do clan não pode ultrapassar **30 caracteres.**`)

            for (const id of keys) {
                if (Clans[id].Name === ClanName)
                    return message.reply(`${e.Deny} | Já existe um clan com este nome.`)
            }

            Clan.set(`Clans.${ID}`, {
                Name: `${ClanName}`,
                Owner: `${message.author.id}`,
                Admins: [`${message.author.id}`],
                Members: [`${message.author.id}`],
                Donation: 0
            })

            sdb.set(`Users.${message.author.id}.Clan`, `${ClanName}`)
            db.subtract(`Balance_${message.author.id}`, 5000000)

            PushTrasaction(
                message.author.id,
                `🛡️ Gastou 5000000 Moedas para criar o clan ${ClanName}`
            )

            return message.channel.send(`${e.Check} | Você criou o clan **${ClanName}** \`${ID}\` com sucesso!`)

        }

        async function NewClanInvitation() {

            if (!AtualClan)
                return message.reply(`${e.Deny} | Você precisa de um clan para poder convidar alguém.`)

            if (!Admin)
                return message.reply(`${e.Deny} | Você precisa ser um*(a)* administrador*(a)* do clan para convidar outras pessoas.`)

            if (Clan.get(`Clans.${key}.Members`).length >= 40)
                return message.reply(`${e.Deny} | O clan atingiu o número máximo de membros.`)

            if (user.user.bot || user.id === message.author.id || sdb.get(`Users.${user.id}.Clan`))
                return message.reply(`${e.Deny} | Este usuário não pode ser convidado para o seu clan por ser um bot ou por já possuir um clan.`)

            const msg = await message.channel.send(`${e.QuestionMark} | ${user}, você está sendo convidado por ${message.author.tag} para entrar no clan **${AtualClan}**.\nVocê aceita o convite?`)

            msg.react('✅').catch()
            msg.react('❌').catch()

            const collector = msg.createReactionCollector({
                filter: (reaction, u) => { return ['✅', '❌'].includes(reaction.emoji.name) && u.id === user.id },
                time: 30000,
                errors: ['time']
            });

            collector.on('collect', (reaction, u) => {

                if (reaction.emoji.name === '✅') {

                    Clan.push(`Clans.${key}.Members`, user.id)
                    sdb.set(`Users.${user.id}.Clan`, AtualClan)
                    msg.edit(`${e.Check} | ${user.user.tag} entrou para o Clan **${AtualClan}**`)
                    collector.stop()
                }

                if (reaction.emoji.name === '❌') {

                    msg.edit(`${e.Deny} | Pedido recusado.`)
                    collector.stop()

                }

            });

        }

        async function KickMember() {

            const User = message.mentions.users.first() || client.users.cache.get(args[1])

            if (!AtualClan)
                return message.reply(`${e.Deny} | Você não possui clan.`)

            if (!Admin)
                return message.reply(`${e.Deny} | Você precisa ser um*(a)* administrador*(a)* do clan para expulsar membros.`)

            if (!User)
                return message.reply(`${e.Info} | Você precisar mencionar ou dizer o ID do membro que deseja expulsar.`)

            if (!Clan.get(`Clans.${key}.Members`).includes(User.id))
                return message.reply(`${e.Deny} | Este usuário não faz parte do clan.`)

            if (Clan.get(`Clans.${key}.Admins`)?.includes(User.id) && Clan.get(`Clans.${key}.Owner`) !== message.author.id)
                return message.reply(`${e.Deny} | Este usuário é um administrador e apenas o criado*(a)* do clan pode expulsa-lo*(a)*.`)

            const msg = await message.reply(`${e.QuestionMark} | **Clan: ${AtualClan}** | Você confirma a expulsão do membro **${User.tag}**?`)

            msg.react('✅').catch()
            msg.react('❌').catch()

            const collector = msg.createReactionCollector({
                filter: (reaction, u) => { return ['✅', '❌'].includes(reaction.emoji.name) && u.id === message.author.id },
                time: 30000,
                errors: ['time']
            });

            collector.on('collect', (reaction, u) => {

                if (reaction.emoji.name === '✅') {

                    Clan.pull(`Clans.${key}.Members`, User.id)
                    Clan.pull(`Clans.${key}.Admins`, User.id)
                    sdb.delete(`Users.${User.id}.Clan`)
                    msg.edit(`${e.Check} | ${User.tag} foi expulso do Clan **${AtualClan}** pelo Admin \`${message.author.tag}\``).catch()
                    collector.stop()

                }

                if (reaction.emoji.name === '❌') {

                    msg.edit(`${e.Deny} | Pedido recusado.`)
                    collector.stop()

                }

            });


        }

        async function MemberList() {

            if (!AtualClan)
                return message.reply(`${e.Deny} | Você não possui clan.`)

            let membros = Clan.get(`Clans.${key}.Members`)

            function EmbedGenerator() {
                let amount = 10
                let Page = 1
                const embeds = [];
                let length = parseInt(membros.length / 10) + 1

                for (let i = 0; i < membros.length; i += 10) {

                    const current = membros.slice(i, amount)
                    const description = current.map((member) => `${Clan.get(`Clans.${key}.Owner`) === member ? e.OwnerCrow : ''}${Clan.get(`Clans.${key}.Admins`).includes(member) && Clan.get(`Clans.${key}.Owner`) !== member ? e.ModShield : ''}${client.users.cache.get(member)?.tag || "Membro não encontrado"} \`${client.users.cache.get(member)?.id || "N/A"}\``).join("\n")

                    embeds.push({
                        color: color(message.member),
                        title: `🛡️ Membros do Clan ${AtualClan} | ${Page}/${length}`,
                        description: `${description}`,
                        footer: {
                            text: `${membros?.length || 0}/40 Membros`
                        }
                    })

                    Page++
                    amount += 10

                }

                return embeds;
            }

            const embeds = EmbedGenerator()
            const msg = await message.reply({ embeds: [embeds[0]] })

            if (embeds.length > 1) {
                for (const emoji of ['◀️', '▶️', '❌']) {
                    msg.react(emoji).catch()
                }
            }

            const collector = msg.createReactionCollector({
                filter: (reaction, user) => { return ['◀️', '▶️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id },
                idle: 30000,
                errors: ['idle']
            });

            collector.on('collect', (reaction, user) => {

                if (reaction.emoji.name === '◀️') {
                    control--
                    embeds[control] ? msg.edit({ embeds: [embeds[control]] }).catch() : control++
                }

                if (reaction.emoji.anme === '▶️') {
                    control++
                    embeds[control] ? msg.edit({ embeds: [embeds[control]] }).catch() : control--
                }

                if (reaction.emoji.name === '❌') {
                    collector.stop()
                }

            });

            collector.on('end', () => {
                msg.reactions.removeAll().catch(() => { })
            })

        }

        function AddOrRemoveStaff() {

            if (!AtualClan)
                return message.reply(`${e.Deny} | Você precisa estar em um clan para usar este comando.`)

            if (!Owner)
                return message.reply(`${e.Deny} | Apenas o dono do clan pode promover admins.`)

            if (['add', 'new'].includes(args[1]?.toLowerCase())) return AddAdmin()
            if (['remove', 'del'].includes(args[1]?.toLowerCase())) return RemoveAdmin()
            return message.reply(`${e.Info} | Você precisa usar o comando de forma correta. \n\`${prefix}clan staff <add/remove> <@user>\``)

            function AddAdmin() {

                if (Clan.get(`Clans.${key}.Admins`).length >= 5)
                    return message.reply(`${e.Deny} | O clan atingiu o número máximo de administradores.`)

                if (!user)
                    return message.reply(`${e.Info} | Mencione o usuário que deseja promover para Administrador*(a)*`)

                if (!Clan.get(`Clans.${key}.Members`)?.includes(user.id))
                    return message.reply(`${e.Deny} | Este usuário não é membro do clan.`)

                if (Clan.get(`Clans.${key}.Admins`)?.includes(user.id))
                    return message.reply(`${e.Deny} | Este usuário já é um administrador.`)

                Clan.push(`Clans.${key}.Admins`, user.id)
                return message.reply(`${e.Check} | ${user.user.tag} foi promovido para ${e.ModShield} **Administrador*(a)*** no clan **${AtualClan}**`)

            }

            function RemoveAdmin() {

                if (!user)
                    return message.reply(`${e.Info} | Mencione o usuário que deseja remover do cargo Administrador*(a)*`)

                if (!Clan.get(`Clans.${key}.Members`)?.includes(user.id))
                    return message.reply(`${e.Deny} | Este usuário não é membro do clan.`)

                if (!Clan.get(`Clans.${key}.Admins`)?.includes(user.id))
                    return message.reply(`${e.Deny} | Este usuário não é um administrador.`)

                Clan.pull(`Clans.${key}.Admins`, user.id)
                return message.reply(`${e.Info} | ${user.user.tag} foi removido do cargo ${e.ModShield} **Administrador*(a)*** no clan **${AtualClan}**`)

            }

        }

        async function DeleteClan() {

            if (!AtualClan)
                return message.reply(`${e.Deny} | Você precisa estar em um clan para usar este comando.`)

            if (!Owner)
                return message.reply(`${e.Deny} | Apenas o dono do clan pode apagar o clan.`)

            const msg = await message.reply(`${e.QuestionMark} | Você confirma deletar o clan **${AtualClan}**?`)

            msg.react('✅').catch()
            msg.react('❌').catch()

            const collector = msg.createReactionCollector({
                filter: (reaction, u) => { return ['✅', '❌'].includes(reaction.emoji.name) && u.id === message.author.id },
                time: 30000,
                errors: ['time']
            });

            collector.on('collect', (reaction, u) => {

                if (reaction.emoji.name === '✅') {

                    let membros = Clan.get(`Clans.${key}.Members`)

                    for (const id of membros) {
                        sdb.delete(`Users.${id}.Clan`)
                    }

                    Clan.delete(`Clans.${key}`)
                    msg.edit(`${e.Check} | O Clan **${AtualClan}** foi deletado com sucesso!`).catch()
                    collector.stop()

                }

                if (reaction.emoji.name === '❌') {

                    msg.edit(`${e.Deny} | Pedido recusado.`)
                    collector.stop()

                }

            });

        }

        function NewDonate() {

            if (!AtualClan)
                return message.reply(`${e.Deny} | Você precisa estar em um clan para usar este comando.`)

            let amount = parseInt(args[1]?.replace(/k/g, '000'))
            let money = db.get(`Balance_${message.author.id}`) || 0

            if (['all', 'tudo'].includes(args[0]?.toLowerCase()))
                amount = money

            if (!amount || isNaN(amount))
                return message.reply(`${e.Deny} | Você precisa dizer uma quantia para doar ao clan.`)

            if (amount > money)
                return message.reply(`${e.Deny} | Você não possui todo este direito na carteira.`)

            if (amount < 1)
                return message.reply(`${e.Deny} | Você pode doar no mínimo 1 ${Moeda(message)}`)

            Clan.add(`Clans.${key}.Donation`, amount)
            db.subtract(`Balance_${message.author.id}`, amount)

            PushTrasaction(
                message.author.id,
                `🛡️ Doou ${amount} Moedas para o Clan ${AtualClan}`
            )

            return message.reply(`${e.Check} | Você doou **${amount} ${Moeda(message)}** para o Clan **${AtualClan}**`)

        }

        async function ClanStatus() {

            let KeyArgs = args[1] || key || 'Indefinido'

            if (!Clan.get(`Clans.${KeyArgs}`))
                return message.reply(`${e.Deny} | Você não possui clan ou o clan requisitado não existe.`)

            let { Name, Owner, Admins, Members, Donation } = {
                Name: Clan.get(`Clans.${KeyArgs}.Name`),
                Owner: await client.users.cache.get(Clan.get(`Clans.${KeyArgs}.Owner`))?.tag || 'Indefinido',
                Admins: Clan.get(`Clans.${KeyArgs}.Admins`)?.length || 0,
                Members: Clan.get(`Clans.${KeyArgs}.Members`)?.length || 0,
                Donation: Clan.get(`Clans.${KeyArgs}.Donation`) || 0
            }

            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(color(message.member))
                        .setTitle(`🛡️ Informações do Clan: ${Name}`)
                        .addFields(
                            {
                                name: `${e.Gear} Clan Key`,
                                value: `> ${KeyArgs}`
                            },
                            {
                                name: '📝 Nome',
                                value: `> ${Name}`
                            },
                            {
                                name: `${e.OwnerCrow} Dono*(a)*`,
                                value: `> ${Owner}`
                            },
                            {
                                name: `${e.ModShield} Administradores`,
                                value: `> ${Admins}/5`
                            },
                            {
                                name: '👥 Membros',
                                value: `> ${Members}/40`
                            },
                            {
                                name: `${e.MoneyWings} Doações`,
                                value: `> ${Donation}`
                            }
                        )
                ]
            })

        }

        async function LeaveClan() {

            if (!AtualClan)
                return message.reply(`${e.Deny} | Você não possui clan.`)

            if (Owner)
                return message.reply(`${e.Deny} | Você precisa passar a liderança do clan para outro membro primeiro. \`${prefix}clan transferirposse <@user>\``)

            const msg = await message.reply(`${e.QuestionMark} | Você confirma sair do clan **${AtualClan}**?`)

            msg.react('✅').catch()
            msg.react('❌').catch()

            const collector = msg.createReactionCollector({
                filter: (reaction, u) => { return ['✅', '❌'].includes(reaction.emoji.name) && u.id === message.author.id },
                time: 30000,
                errors: ['time']
            });

            collector.on('collect', (reaction, u) => {

                if (reaction.emoji.name === '✅') {

                    Clan.pull(`Clans.${key}.Members`, message.author.id)
                    Clan.pull(`Clans.${key}.Admins`, message.author.id)
                    sdb.delete(`Users.${message.author.id}.Clan`)
                    msg.edit(`${e.Check} | Você saiu do Clan **${AtualClan}**!`).catch()
                    collector.stop()

                }

                if (reaction.emoji.name === '❌') {

                    msg.edit(`${e.Deny} | Pedido recusado.`)
                    collector.stop()

                }

            });

        }

        async function NewClanOwner() {

            if (!AtualClan)
                return message.reply(`${e.Deny} | Você precisa ter um clan para usar este comando.`)

            if (!Owner)
                return message.reply(`${e.Deny} | Apenas o dono do clan pode usar este comando.`)

            if (!user)
                return message.reply(`${e.Info} | @Mencione o membro que você deseja transferir a posse do clan`)

            if (!Clan.get(`Clans.${key}.Members`).includes(user.id))
                return message.reply(`${e.Deny} | Este usuário não faz parte do clan.`)

            const msg = await message.reply(`${e.QuestionMark} | Você confirma transferir a posso do clan **${AtualClan}** para **${user.user.tag}**?`)

            msg.react('✅').catch()
            msg.react('❌').catch()

            const collector = msg.createReactionCollector({
                filter: (reaction, u) => { return ['✅', '❌'].includes(reaction.emoji.name) && u.id === message.author.id },
                time: 30000,
                errors: ['time']
            });

            collector.on('collect', (reaction, u) => {

                if (reaction.emoji.name === '✅') {

                    Clan.set(`Clans.${key}.Owner`, user.id)
                    Clan.push(`Clans.${key}.Admins`, message.author.id)
                    msg.edit(`${e.Check} | Você transferiu a posse do Clan **${AtualClan}** para ${user.user.tag} com sucesso! Por padrão, você ainda é um administrador.`).catch()
                    collector.stop()

                }

                if (reaction.emoji.name === '❌') {

                    msg.edit(`${e.Deny} | Pedido recusado.`)
                    collector.stop()

                }

            });

        }

        async function EditClanName() {

            if (!AtualClan)
                return message.reply(`${e.Deny} | Você precisa ter um clan para usar este comando.`)

            if (!Owner)
                return message.reply(`${e.Deny} | Apenas o dono do clan pode usar este comando.`)

            let NewName = args.slice(1).join(' ')
            let money = db.get(`Balance_${message.author.id}`) || 0

            if (money < 1000000)
                return message.reply(`${e.Info} | Você precisa de pelo menos 1 Milhão de ${Moeda(message)} para trocar o nome do clan.`)

            if (!NewName)
                return message.reply(`${e.Info} | Você precisa fornecer um nome para a criação do seu clan.`)

            const reg = /^[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/i
            if (!reg.test(NewName))
                return message.reply(`${e.Deny} | O nome do clan aceita apenas **letras, letras com acento e números**`)

            if (AtualClan === NewName)
                return message.reply(`${e.Deny} | Este já é o nome atual do seu clan.`)

            for (const id of keys) {
                if (Clans[id].Name === NewName)
                    return message.reply(`${e.Deny} | Já existe um clan com este nome.`)
            }

            if (NewName.length > 30)
                return message.reply(`${e.Deny} | O nome do clan não pode ultrapassar **30 caracteres.**`)


            const msg = await message.reply(`${e.QuestionMark} | Você confirma trocar o nome do clan de **${AtualClan}** para **${NewName}**?`)

            msg.react('✅').catch()
            msg.react('❌').catch()

            const collector = msg.createReactionCollector({
                filter: (reaction, u) => { return ['✅', '❌'].includes(reaction.emoji.name) && u.id === message.author.id },
                time: 30000,
                errors: ['time']
            });

            collector.on('collect', (reaction, u) => {

                if (reaction.emoji.name === '✅') {

                    for (const m of Clan.get(`Clans.${key}.Members`)) {
                        sdb.set(`Users.${m}.Clan`, NewName)
                    }

                    Clan.set(`Clans.${key}.Name`, NewName)

                    db.subtract(`Balance_${message.author.id}`, 1000000)
                    msg.edit(`${e.Check} | Você trocou o nome do seu Clan com sucesso!`).catch()
                    collector.stop()

                }

                if (reaction.emoji.name === '❌') {

                    msg.edit(`${e.Deny} | Pedido recusado.`)
                    collector.stop()

                }

            });

        }

        function ClanRanking() {

            const ClansArray = []

            for (const key of keys) {
                if (Clan.get(`Clans.${key}.Donation`) > 0) {
                    ClansArray.push({ key: key, name: Clan.get(`Clans.${key}.Name`), donation: Clan.get(`Clans.${key}.Donation`) })
                }
            }

            if (ClansArray.length < 1) return message.reply(`${e.Info} | Não tem nenhum ranking por enquanto.`)

            const rank = ClansArray.slice(0, 10).sort((a, b) => b.donation - a.donation).map((clan, i) => ` \n> ${Medals(i)} **${clan.name}** - \`${clan.key}\`\n> ${clan.donation} ${Moeda(message)}\n`).join('\n')
            let MyClanRank = ClansArray.findIndex(clans => clans.name === AtualClan) + 1 || 'N/A'

            function Medals(i) {
                const Medals = {
                    1: '🥇',
                    2: '🥈',
                    3: '🥉'
                }

                return Medals[i + 1] || `${i + 1}.`
            }

            return message.reply(
                {
                    embeds: [
                        new MessageEmbed()
                            .setColor(color(message.member))
                            .setTitle(`👑 Top 10 Clans`)
                            .setDescription(`O clan é baseado nas doações\n \n${rank}`)
                            .setFooter(`Meu Clan: ${MyClanRank}`)
                    ]
                }
            )

        }

        function ClanInfo() {
            return message.reply(
                {
                    embeds: [
                        {
                            color: color(message.member),
                            title: `🛡️ ${client.user.username}'s Clan System`,
                            description: `No sistema de clans, você pode fazer parte dos clans ou até criar o seu. Presente em rankings globais, você pode competir para ver qual é o maior clan!`,
                            fields: [
                                {
                                    name: `👀 Veja o clan de alguém, ou o seu`,
                                    value: `\`${prefix}clan <@user>\` ou \`${prefix}clan status <KeyCode>\``
                                },
                                {
                                    name: `${e.Stonks} Crie o seu clan`,
                                    value: `\`${prefix}clan create <Nome do Clan>\``
                                },
                                {
                                    name: `${e.Join} Convite membros para o seu clan`,
                                    value: `\`${prefix}clan invite <@user>\` - Apenas donos e administradores podem convidar`
                                },
                                {
                                    name: `${e.Leave} Expulse pessoas do clan`,
                                    value: `\`${prefix}clan kick <@user>\` - Apenas donos e administradores podem expulsar`
                                },
                                {
                                    name: `${e.Commands} Veja quem está no clan`,
                                    value: `\`${prefix}clan list\``
                                },
                                {
                                    name: `${e.ModShield} Adicione ou remova administradores`,
                                    value: `\`${prefix}clan adm add/remove <@user>\` - Apenas donos podem adicionar ou remover adms`
                                },
                                {
                                    name: `${e.Deny} Delete o clan`,
                                    value: `\`${prefix}clan delete\` - Apenas donos podem deletar o clan`
                                },
                                {
                                    name: `${e.MoneyWithWings} Doe ao clan`,
                                    value: `\`${prefix}clan donate <valor>\``
                                },
                                {
                                    name: `${e.Download} Veja como está o seu clan`,
                                    value: `\`${prefix}clan status\``
                                },
                                {
                                    name: `${e.PandaBag} Saia do clan`,
                                    value: `\`${prefix}clan leave\``
                                },
                                {
                                    name: '🔄 Transfira a posse do clan',
                                    value: `\`${prefix}clan transferirposse <@user>\` - Apenas o dono pode dar a posse de dono`
                                },
                                {
                                    name: `🔄 Mude o nome do clan`,
                                    value: `\`${prefix}clan editname <Novo Nome>\` - Apenas o dono pode mudar o nome do clan`
                                },
                                {
                                    name: `${e.Upvote} Veja o ranking dos clans`,
                                    value: `\`${prefix}clan rank\``
                                }
                            ],
                            footer: {
                                text: `Este comando faz parte da categoria "${client.user.username} hiper commands"`
                            }
                        }
                    ]
                }
            )
        }

    }
}