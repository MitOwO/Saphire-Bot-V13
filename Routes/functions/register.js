const sdb = require('./database')
const db = require('quick.db')
const { e } = require('../emojis.json')
const { config } = require('../config.json')

async function RegisterUser(message) {
    if (message.author.bot) return

    sdb.set(`Request.${message.author.id}`, db.get(`Request.${message.author.id}`) || undefined)

    sdb.set(`Users.${message.author.id}`, {
        Name: message.author.tag,
        Timeouts: {
            Preso: db.get(`${message.author.id}.Timeouts.Preso`) || undefined,
            Daily: db.get(`${message.author.id}.Timeouts.Daily`) || undefined,
            Monthly: db.get(`${message.author.id}.Timeouts.Monthly`) || undefined,
            Weekly: db.get(`${message.author.id}.Timeouts.Weekly`) || undefined,
            Cu: db.get(`${message.author.id}.Timeouts.Cu`) || undefined,
            Roleta: db.get(`${message.author.id}.Timeouts.Roleta`) || undefined,
            Duelo: db.get(`${message.author.id}.Timeouts.Duelo`) || undefined,
            Roubo: db.get(`${message.author.id}.Timeouts.Roubo`) || undefined,
            Bug: db.get(`${message.author.id}.Timeouts.Bug`) || undefined,
            Work: db.get(`${message.author.id}.Timeouts.Work`) || undefined,
            Gif: db.get(`${message.author.id}.Timeouts.Gif`) || undefined,
            Ideiasaphire: db.get(`${message.author.id}.Timeouts.Ideiasaphire`) || undefined,
            Cantada: db.get(`${message.author.id}.Timeouts.Cantada`) || undefined,
            Assalto: db.get(`${message.author.id}.Timeouts.Assalto`) || undefined,
            Bitcoin: db.get(`${message.author.id}.Timeouts.Bitcoin`) || undefined,
            Porquinho: db.get(`${message.author.id}.Timeouts.Porquinho`) || undefined,
            Rep: db.get(`${message.author.id}.Timeouts.Rep`) || undefined,
            Buscar: db.get(`${message.author.id}.Timeouts.Buscar`) || undefined,
            Crime: db.get(`${message.author.id}.Timeouts.Crime`) || undefined,
            Bolsa: db.get(`${message.author.id}.Timeouts.Bolsa`) || undefined,
        },
        Cache: {
            ComprovanteOpen: db.get(`${message.author.id}.Cache.ComprovanteOpen`) || undefined,
            Assalto: db.get(`${message.author.id}.Cache.Assalto`) || undefined,
            BetPrize: db.get(`${message.author.id}.BetPrize`) || undefined,
            BingoPrize: db.get(`${message.author.id}.BingoPrize`) || undefined,
            Resgate: db.get(`${message.author.id}.Cache.Resgate`) || undefined,
            Bolsa: db.get(`${message.author.id}.Cache.Bolsa`) || undefined,
            LancePrize: db.get(`${message.author.id}.Prize`) || undefined,
            Pay: db.get(`${message.author.id}.Cache.Pay`) || undefined,
            Pix: db.get(`${message.author.id}.Cache.Pix`) || undefined,
            ValueAll: db.get(`${message.author.id}.Cache.ValueAll`) || undefined,
            Roleta: db.get(`${message.author.id}.Cache.Roleta`) || undefined,
        },
        NoReact: db.get(`${message.author.id}.NoReact`) || undefined,
        Baka: db.get(`${message.author.id}.Baka`) || undefined,
        AfkSystem: db.get(`Client.AfkSystem.${message.author.id}`) || undefined,
        Bolsa: db.get(`${message.author.id}.Bolsa`) || undefined,
        Perfil: {
            Vip: db.delete(`Users.${message.author.id}.Vip`) || undefined,
            TitlePerm: db.get(`${message.author.id}.Perfil.TitlePerm`) || undefined,
            Titulo: db.get(`${message.author.id}.Perfil.Titulo`) || undefined,
            Status: db.get(`${message.author.id}.Perfil.Status`) || undefined,
            Sexo: db.get(`${message.author.id}.Perfil.Sexo`) || undefined,
            Signo: db.get(`${message.author.id}.Perfil.Signo`) || undefined,
            Aniversario: db.get(`${message.author.id}.Perfil.Aniversario`) || undefined,
            Trabalho: db.get(`${message.author.id}.Perfil.Trabalho`) || undefined,
            Family: {
                1: db.get(`${message.author.id}.Perfil.Family.1`) || undefined,
                2: db.get(`${message.author.id}.Perfil.Family.2`) || undefined,
                3: db.get(`${message.author.id}.Perfil.Family.3`) || undefined,
            },
            Medalha: db.get(`${message.author.id}.Perfil.Medalha`) || undefined,
            Marry: db.get(`${message.author.id}.Perfil.Marry`) || undefined,
            Bits: db.get(`${message.author.id}.Bits`) || undefined,
            Estrela: {
                1: db.get(`${message.author.id}.Perfil.Estrela.1`) || undefined,
                2: db.get(`${message.author.id}.Perfil.Estrela.2`) || undefined,
                3: db.get(`${message.author.id}.Perfil.Estrela.3`) || undefined,
                4: db.get(`${message.author.id}.Perfil.Estrela.4`) || undefined,
                5: db.get(`${message.author.id}.Perfil.Estrela.5`) || undefined,
                6: db.get(`${message.author.id}.Perfil.Estrela.6`) || undefined,
            },
        },
        Slot: {
            Medalha: {
                Medalha: db.get(`${message.author.id}.Slot.Medalha`) || undefined,
                Acess: db.get(`${message.author.id}.Slot.MedalhaAcess`) || undefined,
                Code1: db.get(`${message.author.id}.Slot.Medalha.Code1`) || undefined,
            },
            Machado: {
                Usos: db.get(`${message.author.id}.Slot.Machado.Usos`) || undefined,
            },
            Picareta: {
                Usos: db.get(`${message.author.id}.Slot.Picareta.Usos`) || undefined,
            },
            Arma: db.get(`${message.author.id}.Slot.Arma`) || undefined,
            DiamanteNegro: db.get(`${message.author.id}.Slot.DiamanteNegro`) || undefined,
            Cachorro: db.get(`${message.author.id}.Slot.Cachorro`) || undefined,
            Remedio: db.get(`${message.author.id}.Slot.Remedio`) || undefined,
            Helpier: db.get(`${message.author.id}.Slot.Helpier`) || undefined,
            Balaclava: db.get(`${message.author.id}.Slot.Balaclava`) || undefined,
            Dogname: db.get(`${message.author.id}.Slot.Dogname`) || undefined,
            Vara: db.get(`${message.author.id}.Slot.Vara`) || undefined,
            Anel: db.get(`${message.author.id}.Slot.Anel`) || undefined,
            Faca: db.get(`${message.author.id}.Slot.Faca`) || undefined,
            Loli: db.get(`${message.author.id}.Slot.Loli`) || undefined,
            Comidas: db.get(`${message.author.id}.Slot.Comidas`) || undefined,
            Bola: db.get(`${message.author.id}.Slot.Bola`) || undefined,
            Ossos: db.get(`${message.author.id}.Slot.Ossos`) || undefined,
            Fichas: db.get(`${message.author.id}.Slot.Fichas`) || undefined,
            Cartas: db.get(`${message.author.id}.Slot.Cartas`) || undefined,
            Iscas: db.get(`${message.author.id}.Slot.Iscas`) || undefined,
            Aguas: db.get(`${message.author.id}.Slot.Aguas`) || undefined,
            Minerios: db.get(`${message.author.id}.Slot.Minerios`) || undefined,
            Diamante: db.get(`${message.author.id}.Slot.Diamante`) || undefined,
            Fossil: db.get(`${message.author.id}.Slot.Fossil`) || undefined,
            Mamute: db.get(`${message.author.id}.Slot.Mamute`) || undefined,
            Apple: db.get(`${message.author.id}.Slot.Apple`) || undefined,
            Rosas: db.get(`${message.author.id}.Slot.Rosas`) || undefined,
            Peixes: db.get(`${message.author.id}.Slot.Peixes`) || undefined,
            Camarao: db.get(`${message.author.id}.Slot.Camarao`) || undefined,
        },
        Color: {
            Perm: db.get(`${message.author.id}.Color.Perm`) || undefined,
            Set: db.get(`${message.author.id}.Color.Set`) || undefined,
        }
    })

    // db.delete(`${message.author.id}`)
    // db.delete(`Client.AfkSystem.${message.author.id}`)
    // db.delete(`Vip_${message.author.id}`)
    // db.delete(`Request.${message.author.id}`)
}

async function RegisterServer(message) {

    sdb.set(`Servers.${message.guild.id}`, {
        Name: message.guild.name,
        Owner: message.guild.members.cache.get(message.guild.ownerId).user.tag || undefined,
        OwnerId: message.guild.ownerId || undefined,
        Prefix: db.get(`Servers.${message.guild.id}.Prefix`) || undefined,
        Tsundere: db.get(`Server.${message.guild.id}.Tsundere`) || undefined,
        LogChannel: db.get(`Servers.${message.guild.id}.LogChannel`) || undefined,
        IdeiaChannel: db.get(`Servers.${message.guild.id}.IdeiaChannel`) || undefined,
        Moeda: db.get(`Servers.${message.guild.id}.Moeda`) || undefined,
        XPChanel: db.get(`Servers.${message.guild.id}.XPChannel`) || undefined,
        ReportChannel: db.get(`Servers.${message.guild.id}.ReportChannel`) || undefined,
        Roles: {
            1: db.get(`${message.guild.id}.Roles.1`) || undefined,
            2: db.get(`${message.guild.id}.Roles.2`) || undefined,
            3: db.get(`${message.guild.id}.Roles.3`) || undefined,
            4: db.get(`${message.guild.id}.Roles.4`) || undefined,
            5: db.get(`${message.guild.id}.Roles.5`) || undefined,
        },
        Farm: {
            BuscaChannel: db.get(`Servers.${message.guild.id}.BuscaChannel`) || undefined,
            PescaChannel: db.get(`Servers.${message.guild.id}.PescaChannel`) || undefined,
            MineChannel: db.get(`Servers.${message.guild.id}.MineChannel`) || undefined,
        },
        LeaveChannel: {
            Canal: db.get(`Servers.${message.guild.id}.LeaveChannel`) || undefined,
            Emoji: db.get(`Servers.${message.guild.id}.LeaveChannel.Emoji`) || undefined,
            Mensagem: db.get(`Servers.${message.guild.id}.LeaveChannel.Mensagem`) || undefined,
        },
        WelcomeChannel: {
            Canal: db.get(`Servers.${message.guild.id}.WelcomeChannel.Canal`) || undefined,
            Emoji: db.get(`Servers.${message.guild.id}.WelcomeChannel.Emoji`) || undefined,
            Mensagem: db.get(`Servers.${message.guild.id}.WelcomeChannel.Mensagem`) || undefined,
        },
        Autorole: {
            First: db.get(`Servers.${message.guild.id}.Autorole1`) || undefined,
            Second: db.get(`Servers.${message.guild.id}.Autorole2`) || undefined,
        },
    })

    // message.channel.send(`${e.Check} | Troca de database concluída!`)

    // db.delete(`Servers.${message.guild.id}`)
}

module.exports = { RegisterUser, RegisterServer }