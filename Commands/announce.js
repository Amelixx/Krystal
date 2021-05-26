const Discord = require(`discord.js`)
const modules = require(`../modules.js`)
const fs = require(`fs`)

const globalStats = require(`../JSON/Stats/globalStats.json`)
const cooldowns = require(`../JSON/cooldowns.json`)
const config = require(`../config.json`)

const capitalise = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = {
    run: async (bot, message, args, content, prefix) => {
        // !update (TYPE: fix/change/add/remove) (details)
        let channels = config.serverChannels
        if (!content || !args[2]) return message.channel.send(`Not enough parameters provided. Run \`${prefix}updatehelp\` for more help.`)
        if (channels[args[1].toLowerCase()]) channel = bot.channels.cache.get(channels[args[1].toLowerCase()].channel)
        else channel = undefined

        if (!channel) return message.channel.send(`**Posting channel (First Parameter) invalid.**\nI can't get a channel out of '${args[1]}'. Valid channel keywords are:\n${Object.keys(channels).join(` | `)}\nRun \`${prefix}updatehelp\` for more help.`)

        let x = 0, i = 0
        while (x < 3 && message.content[i]) {
            if (message.content[i] == " ") x ++
            i ++
        }
        let description = message.content.slice(i), 
        
        type = args[2].toLowerCase(),
        title, defaultTitle = `New Commit to ${channels[args[1].toLowerCase()].title || `'${type}'`}`,
        cutOff;

        x = 0, i = 0
        while (x < 4 && description[i]) {
            if (description[i] == '"' && description[i - 1] != "\\") x ++
            if (x < 2) cutOff = new Number(i + 2); 
            i ++
        }
        if ([0,1].includes(x)) title = defaultTitle
        else {
            title = description.slice(1, cutOff - 1)
            if (x != 2) description = description.slice(cutOff + 2, description.length - 1)
            else description = description.slice(cutOff + 1, description.length)
            if (!description) {description = title, title = defaultTitle}
        }

        if (!Object.keys(types).includes(type)) return message.channel.send(`**Type (Second Parameter) invalid.**\n'${args[2]}' is not a valid type. Valid types are:\n*${Object.keys(types).join(` | `)}*\nRun \`${prefix}updatehelp\` for more help.`)
        if (!description) return message.channel.send(`You didn't include a description. This is what will be displayed in the embed.\nRun \`${prefix}updatehelp\` for more help.`)

        if (!channel.permissionsFor(channel.guild.me).has(`SEND_MESSAGES`) || !channel.permissionsFor(channel.guild.me).has(`EMBED_LINKS`)) return message.channel.send(`I don't have the right permissions to send to that channel, and if I do, then I don't have the "embed links" permission (I need this to make fancy embeds).`)

        let id = 0
        while (updates[id]) { id += 1 }
        

        let embed = new Discord.MessageEmbed()
            .setColor(types[type].colour)
            .setTitle(types[type].title || capitalise(type))
            .setDescription(`**${title}**\n${description}\n\nUpdate ID - ${id}\nUser: ${message.author}`)
            .setTimestamp(Date.now())
            .setFooter(`Commit by ${message.author.tag}`, message.author.displayAvatarURL)
        let msg = await channel.send({embed})
        message.react(`✔`)

        globalStats.updatesPublished ++
        modules.setGame()

        updates[id] = msg.id
        cooldowns[module.exports.info.name] = Date.now() + 5000
        fs.writeFileSync(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4))
        fs.writeFileSync(`./JSON/cooldowns.json`, JSON.stringify(cooldowns, null, 4))
        fs.writeFileSync(`./JSON/updates.json`, JSON.stringify(updates, null, 4))
    },
    info: {
        name: `announce`,
        developer: true,
    }
}