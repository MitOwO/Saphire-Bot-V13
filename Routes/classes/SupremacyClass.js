const UserManager = require('./UserManager')
const ServerManager = require('./ServerManager')
const SaphireClient = require('./SaphireClient')
const GiveawayManager = require('./GiveawayManager')
const Error = require('../functions/errors')
const { Message, MessageEmbed, Permissions, Collection } = require('discord.js')
const { f } = require('../../database/frases.json')
const { RegisterUser, RegisterServer, UpdateUserName } = require('../functions/register')
const { sdb, db, CommandsLog, BgLevel, BgWall, conf, emojis, nomes, lotery } = require('../functions/database')
const { BlockCommandsBot } = require('../functions/blockcommands')
const { RateLimiter } = require('discord.js-rate-limiter')
const AfkSystem = require('../functions/AfkSystem')
const xp = require('../functions/experience')
const React = require('../functions/reacts')
const Notify = require('../functions/notify')
const ms = require('ms')
const parsems = require('parse-ms')
const RequestAutoDelete = require('../functions/Request')
const Blacklisted = require('../functions/blacklist')
const ServerBlocked = require('../functions/blacklistserver')
const client = require('../../index')

const DatabaseObj = {
    LevelWallpapers: BgLevel.get('LevelWallpapers'),
    Wallpapers: BgWall.get('Wallpapers'),
    Loteria: lotery.get('Loteria'),
    config: conf.get('config'),
    e: emojis.get('e'),
    N: nomes.get('N'),
}

const SaphireClientConfiguration = {
    intents: 1815,
    disableMentions: { parse: ['everyone'] },
    partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION']
}

/**
 * @param { Message } message
 */

class RodyBrozy {
    constructor(options) {
        this.client = client
        this.UserManager = UserManager
        this.ServerManager = ServerManager
        this.GiveawayManager = GiveawayManager
        this.MessageEmbed = MessageEmbed
        this.Permissions = Permissions
        this.Collection = new Collection()
        this.rateLimiter = new RateLimiter(2, 1500)
        this.f = f
        this.DatabaseObj = DatabaseObj
        this.sdb = sdb
        this.db = db
        this.CommandsLog = CommandsLog
        this.Discord = require('discord.js')
    }

    ServerBlocked(message) {
        return ServerBlocked(message)
    }

    Blacklisted(message) {
        return Blacklisted(message)
    }

    RequestAutoDelete(message) {
        return RequestAutoDelete(message)
    }

    Notify(serverid, type, msg) {
        return Notify(serverid, type, msg)
    }

    React(message) {
        return React(message)
    }

    AfkSystem(message) {
        return AfkSystem(message)
    }

    BlockCommandsBot(message) {
        return BlockCommandsBot(message)
    }

    xp(message) {
        return xp(message)
    }

    ms(time) {
        return ms(time)
    }

    parsems(number) {
        return parsems(number)
    }

    Error(message, err) {
        return Error(message, err)
    }

    RegisterServer(guild) {
        return RegisterServer(guild)
    }

    RegisterUser(message) {
        return RegisterUser(message)
    }

    UpdateUserName(message) {
        return UpdateUserName(message)
    }

}

const Super = new RodyBrozy()
module.exports = Super