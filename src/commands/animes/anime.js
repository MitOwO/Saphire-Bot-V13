const Kitsu = require('kitsu.js')
const kitsu = new Kitsu()
const translate = require('@iamtraction/google-translate')
const { e } = require('../../../Routes/emojis.json')

module.exports = {
    name: 'anime',
    aliases: ['search', 'searchanime', 'animes'],
    category: 'animes',
    UserPermissions: '',
    ClientPermissions: 'EMBED_LINKS',
    emoji: `🔍`,
    usage: '<nome do anime>',
    description: 'Pesquisa de Animes',

    run: async (client, message, args, prefix, db, MessageEmbed, request) => {

        const EmbedApresetation = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('🔍 Pesquise Animes')
            .setDescription('Eu posso buscar informações sobre qualquer anime, quer tentar?')
            .addField('Comando', '`' + prefix + 'anime Nome Do Anime`')

        let search = args.join(" ")
        if (!search) { return message.reply({ embeds: [EmbedApresetation] }) }
        if (search.length > 100) { return message.reply(`${e.Deny} | Por favor, tente algo com menos de **100 caracteres**, pelo bem do meu sistema ${e.Itachi}`) }
        if (search.length < 4) { return message.reply(`${e.Deny} | Por favor, tente algo com mais de **4 caracteres**, pelo bem do meu sistema ${e.SadPanda}`) }

        kitsu.searchAnime(search).then(async result => {
            if (result.length === 0) { return msg.edit(`${e.Deny} | Nenhum resultado obtido para: **${search}**`).catch(err => { return }) }

            let anime = result[0]

            let text = `${anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0]}`
            let pt = 'pt'
            translate(`${anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0]}`, { to: pt }).then(res => {

                let Nome = `${anime.titles.english ? anime.titles.english : search}`
                if (Nome === 'null') { Nome = 'Sem resposta' }

                let Status = `${anime.showType}`
                if (Status === 'movie') { Status = 'Filme' }

                let Sinopse = `${res.text}`
                if (Sinopse.length > 1000) { Sinopse = 'A sinopse ultrapassou o limite de **1000 caracteres**' }
                if (Sinopse === 'null') { Sinopse = 'Sem resposta' }

                let NomeJapones = `${anime.titles.romaji}`
                if (NomeJapones === 'null') { NomeJapones = 'Sem resposta' }

                let IdadeRating = `${anime.ageRating}`
                if (IdadeRating === 'G') { IdadeRating = 'Livre' }
                if (IdadeRating === 'PG') { IdadeRating = '+10' }
                if (IdadeRating === 'PG-13') { IdadeRating = '+15' }
                if (IdadeRating === 'R') { IdadeRating = '+18' }
                if (IdadeRating === 'null') { IdadeRating = 'Sem resposta' }

                let NSFW = `${anime.nsfw ? 'Sim' : 'Não'}`
                if (NSFW === 'null') { NSFW = 'Sem resposta' }

                let Nota = `${anime.averageRating}`
                if (Nota === 'null') { Nota = 'Sem resposta' }

                let AnimeRanking = `${anime.ratingRank}`
                if (AnimeRanking === 'null') { AnimeRanking = 'Sem resposta' }

                let AnimePop = `${anime.popularityRank}`
                if (AnimePop === 'null') { AnimePop = 'Sem resposta' }

                let Epsodios = `${anime.episodeCount ? anime.episodeCount : 'N/A'}`
                if (Epsodios === 'null') { Epsodios = 'Sem resposta' }

                let Lancamento = `${anime.startDate}`
                if (Lancamento) { Lancamento = `${new Date(Lancamento).toLocaleDateString("pt-br")}` }

                let Termino = `${anime.endDate ? anime.endDate : "Ainda no ar"}`
                if (Termino === "Ainda no ar") {

                    const AnimeSearchEmbed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`🔍 Pesquisa Requisitada: ${search}`)
                        .setDescription(`**📑 Sinopse**\n${Sinopse}`)
                        .addField('🗂️ Informações', `Nome Japonês: ${NomeJapones}\Faixa Etária: ${IdadeRating}\nNSFW: ${NSFW}\NTipo: ${Status}`)
                        .addField('📊 Status', `Nota Média: ${Nota}\nRank: ${AnimeRanking}\nPopularidade: ${AnimePop}\nEpisódios: ${Epsodios}\nLancamento: ${Lancamento}\nTérmino: ${Termino}`)
                        .setImage(anime.posterImage.original)

                    return message.reply({ embeds: [AnimeSearchEmbed] }).catch(err => { return message.reply('Ocorreu um erro no comando "anime"\n`' + err + '`') })

                } else {

                    const AnimeSearchEmbed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`🔍 Pesquisa Requisitada: ${search}`)
                        .setDescription(`**📑 Sinopse**\n${Sinopse}`)
                        .addField('🗂️ Informações', `Nome Japonês: ${NomeJapones}\nIdade: ${IdadeRating}\nNSFW: ${NSFW}\nTipo: ${Status}`)
                        .addField('📊 Status', `Nota Média: ${Nota}\nRank: ${AnimeRanking}\nPopularidade: ${AnimePop}\nEpisódios: ${Epsodios}\nLancamento: ${Lancamento}\nTérmino: ${new Date(Termino).toLocaleDateString("pt-br")}`)
                        .setImage(anime.posterImage.original)

                    return message.reply({ embeds: [AnimeSearchEmbed] }).catch(err => { return message.reply('Ocorreu um erro no comando "anime"\n`' + err + '`') })
                }
            }).catch(err => {
                return message.reply(`${e.Attention} | Houve um erro ao executar este comando.\n\`${err}\``)
            })
        }).catch(err => {
            message.reply(`${e.Attention} **ERROR ANIME SEARCH**\n~CONSOLE LOG: "${err}"`)
            return message.reply(`${e.Deny} | Nenhum resultado obtido para: **${search}**`).catch(err => { return message.reply('Ocorreu um erro no comando "anime"\n`' + err + '`') })
        })
    }
}