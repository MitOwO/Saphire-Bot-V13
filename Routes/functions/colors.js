const { Message } = require('discord.js')
const db = require('quick.db')
const Error = require('./errors')

/**
 * @param { Message } message
 */

function Colors(user) {

    try {
        let RoleColor = user.displayHexColor
        if (RoleColor === '#000000' || !RoleColor) RoleColor = '#246FE0'
        let color = db.get(`${user.id}.Color.Set`) || RoleColor

        return color
    } catch (err) { Error(message, err) }
}

module.exports = Colors