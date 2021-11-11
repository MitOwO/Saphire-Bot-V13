const { Message, MessageEmbed, Permissions, Collection } = require('discord.js')
const { f } = require('../../database/frases.json')
const { RegisterUser, RegisterServer, UpdateUserName } = require('../functions/register')
const { sdb, db, CommandsLog, BgLevel, BgWall, conf, emojis, nomes, lotery } = require('../functions/database')
const { RateLimiter } = require('discord.js-rate-limiter')

// const UserManager = require('./UserManager')
// const ServerManager = require('./ServerManager')
// const SaphireClient = require('./SaphireClient')
// const Error = require('../functions/errors')
// const { Message, MessageEmbed, Permissions, Collection } = require('discord.js')
// const { f } = require('../../database/frases.json')
// const { RegisterUser, RegisterServer, UpdateUserName } = require('../functions/register')
// const { sdb, db, CommandsLog, BgLevel, BgWall, conf, emojis, nomes, lotery } = require('../functions/database')
// const BlockCommandsBot = require('../functions/blockcommands')
// const { RateLimiter } = require('discord.js-rate-limiter')
// const AfkSystem = require('../functions/AfkSystem')
// const xp = require('../functions/experience')
// const React = require('../functions/reacts')
// const Notify = require('../functions/notify')
// const ms = require('ms')
// const parsems = require('parse-ms')
// const RequestAutoDelete = require('../functions/Request')
// const Blacklisted = require('../functions/blacklist')
// const ServerBlocked = require('../functions/blacklistserver')

/**
 * @param { Message } message
 */

class RodyBrozy {
    // constructor(options) {
    //     this.UserManager = UserManager
    //     this.ServerManager = ServerManager
    //     this.GiveawayManager = GiveawayManager
    //     this.MessageEmbed = new MessageEmbed()
    //     this.Permissions = Permissions
    //     this.rateLimiter = new RateLimiter(2, 1500)
    //     this.f = f
    //     this.sdb = sdb
    //     this.db = db
    //     this.CommandsLog = CommandsLog
    //     this.Discord = require('discord.js')
    // }

    UserManager = require('./UserManager')
    // ServerManager = require('./ServerManager')
    // GiveawayManager = GiveawayManager
    SaphireClient = require('./SaphireClient')
    MessageEmbed = new MessageEmbed()
    Permissions = Permissions
    rateLimiter = new RateLimiter(2, 1500)
    f = f
    sdb = sdb
    db = db
    CommandsLog = CommandsLog
    Discord = require('discord.js')
    client = require('../../index')
    Collection = new Collection()
    GiveawayManager = require('./GiveawayManager')
    Error = require('../functions/errors')
    BlockCommandsBot = require('../functions/blockcommands')
    AfkSystem = require('../functions/AfkSystem')
    xp = require('../functions/experience')
    React = require('../functions/reacts')
    Notify = require('../functions/notify')
    ms = require('ms')
    parsems = require('parse-ms')
    RequestAutoDelete = require('../functions/Request')
    Blacklisted = require('../functions/blacklist')
    ServerBlocked = require('../functions/blacklistserver')

    SaphireClientConfiguration = {
        intents: 1815,
        disableMentions: { parse: ['everyone'] },
        partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION']
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

    // xp(message) {
    //     return xp(message)
    // }

    // ms(time) {
    //     return ms(time)
    // }

    parsems(number) {
        return parsems(number)
    }

    // Error(message, err) {
    //     return Error(message, err)
    // }

    // RegisterServer(guild) {
    //     return RegisterServer(guild)
    // }

    // RegisterUser(message) {
    //     return RegisterUser(message)
    // }

    // UpdateUserName(message) {
    //     return UpdateUserName(message)
    // }

}

RodyBrozy.prototype.UpdateUserName = (message) => {
    return UpdateUserName(message)
}

RodyBrozy.prototype.RegisterUser = (message) => {
    return RegisterUser(message)
}

RodyBrozy.prototype.xp = (message) => {
    return xp(message)
}

RodyBrozy.prototype.ms = (time) => {
    return ms(time)
}

RodyBrozy.prototype.RegisterServer = (guild) => {
    return RegisterServer(guild)
}

RodyBrozy.prototype.Error = (message, err) => {
    return Error(message, err)
}

RodyBrozy.prototype.DatabaseObj = {
    LevelWallpapers: BgLevel.get('LevelWallpapers'),
    Wallpapers: BgWall.get('Wallpapers'),
    Loteria: lotery.get('Loteria'),
    config: conf.get('config'),
    e: emojis.get('e'),
    N: nomes.get('N'),
}

RodyBrozy.prototype.ServerManager = require('./ServerManager')

const Super = new RodyBrozy()
module.exports = Super