const Discord = require(`discord.js`)

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!coreMessage) {
        let description = String()
        message.guild.roles.cache.get.forEach(x => {
            if (isNaN(Number(x.name))) description += `${x.name}\n${x.id}\n\n`
        })

        let embed = new Discord.MessageEmbed()
            .setColor(`#5d10e9`)
            .setTitle(`Total Roles List`)
            .setDescription(description)
            .setFooter(`Total Roles - ${message.guild.roles.cache.get.size}`)
        return message.channel.send({embed})
    }
    let role = modules.findRole(message.guild, coreMessage)
    if (!role) return message.channel.send(`Couldn't find a role matching '${coreMessage}'`)
    if (Array.isArray(role)) {
        return message.channel.send(`Too many roles found. :confused:`)
    }
    
    let embed = new Discord.MessageEmbed()
        .setColor(`#5d10e9`)
        .setTitle(role.name)
        .setFooter(`ID: ${role.id}`)
    message.channel.send({embed})
}

module.exports.info = {
    name: `roleinfo`,
    type: `info`,
    usage: `<role OR roleID>`,
    summary: `Gives infomation on a role.`
}