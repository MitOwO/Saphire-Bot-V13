const { Message } = require('discord.js')
const { db, sdb } = require('../functions/database')
const Error = require('../functions/errors')
const Vip = require('../functions/vip')

/**
 * @param { Message } message
 */

class UserManager {
    constructor(message, user) {
        this.message = message
        this.user = user
        this.name = user.username
        this.id = user.id
        this.tag = user.tag
        this.avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 })
        this.bot = user.bot
        this.createdAt = user.createdAt
        this.dataFormatada = this.createdAt.getDate() + "/" + (this.createdAt.getMonth() + 1) + "/" + this.createdAt.getFullYear() + " ás " + this.createdAt.getHours() + "h " + this.createdAt.getMinutes() + 'm e ' + this.createdAt.getSeconds() + 's'
        this.vip = Vip(this.id)
        this.permissions = () => message.member.permissions.toArray() || []
        this.request = sdb.get(`Request.${this.id}`)
        this.baka = sdb.get(`Users.${this.id}.Baka`)
        this.blacklist = db.get(`Blacklist_${this.id}`)
        this.balance = {
            bal: db.get(`Balance_${this.id}`) || 0,
            bank: db.get(`Bank_${this.id}`) || 0,
            resgate: sdb.get(`Users.${this.id}.Cache.Resgate`) || 0
        }
    }

    addBalance(value) {
        try {
            db.add(`Balance_${this.id}`, value)
        } catch (err) {
            Error(this.message, err)
        }
    }

    subtractBalance(value) {
        try {
            db.subtract(`Balance_${this.id}`, value)
        } catch (err) {
            Error(this.message, err)
        }
    }

    addBank(value) {
        try {
            db.add(`Bank_${this.id}`, value)
        } catch (err) {
            Error(this.message, err)
        }
    }

    subtractBank(value) {
        try {
            db.subtract(`Bank_${this.id}`, value)
        } catch (err) {
            Error(this.message, err)
        }
    }
}

module.exports = UserManager