const Discord = require(`discord.js`)

const settings = require(`../config.json`)
const modules = require(`../modules.js`)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!["466706137614647307", "97238312355364864"].includes(message.author.id)) return message.channel.send(`You don't have permission to use this command.`)

    if (!coreMessage) user = message.author
    else user = modules.fetchUser(coreMessage)

    modules.levelUp(user, 0)
}

module.exports.info = {
    name: `leveldown`,
    type: `krystal`,
    aliases: [`downlevel`, `ld`],
    summary: `Remove someone's level :(`,
    usage: `(user)`,
    bypassRestrictions: true
}