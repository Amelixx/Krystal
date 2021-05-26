const Discord = require(`discord.js`)

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    channel = bot.channels.cache.get(args[1])
    if (!channel) return message.channel.send(`:x: Couldn't find that channel.`)
    else channel.send(coreMessage.replace(`${args[1]} `, ``))

    return `Sent '${coreMessage.replace(`${args[1]} `, ``)}' to ${channel.guild.name}, #${channel.name}.`
}   

module.exports.info = {
    name: `sendchannel`,
    developer: true
}