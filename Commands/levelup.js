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
    name: `levelup`,
    type: `krystal`,
    aliases: [`level`, `lu`],
    summary: `Literally just level up someone for free.`,
    usage: `(user)`,
    bypassRestrictions: true
}