const Discord = require(`discord.js`);
const fs = require(`fs`)

const modules = require(`../modules.js`)

module.exports.run = async(bot, message, args, coreMessage, prefix) => {
    let guild = await modules.fetchGuild(coreMessage)
    if (!guild) return message.channel.send(`I couldn't find a guild matching **'${coreMessage}'** :(`)

    let guildInfo = {
        name: guild.name,
        channels: {},
        roles: {},
        emojis: {},
        afkChannelID: guild.afkChannelID,
        afkTimeout: guild.afkTimeout,
        explicitContentFilter: guild.explicitContentFilter,
        features: guild.features,
        icon: guild.icon,
        iconURL: guild.iconURL,
        region: guild.region,
        systemChannelID: guild.systemChannelID,
        verificationLevel: guild.verificationLevel
    }

    await guild.channels.forEach(async channel => {
        guildInfo["channels"][channel.name] = {
            name: channel.name,
            topic: channel.topic,
            type: channel.type,
            position: channel.position,
            calculatedPosition: channel.calculatedPosition,
            permissionOverwrites: [],
            nsfw: channel.nsfw,
            bitrate: channel.bitrate,
            messages: []
        }

        if (channel.parent) guildInfo["channels"][channel.name].parent = channel.parent.name

        if (channel.type == `text`) {
            await channel.messages.fetchs({limit: 2})
            .then(msgs => {
                msgs.forEach(msg => {
                    if (msg.system) { 
                        console.log({
                            authorID: msg.author.id,
                            authorTag: msg.author.tag,
                            content: msg.content,
                            createdAt: msg.createdAt,
                            system: msg.system
                        })
                        guildInfo["channels"][channel.name].messages.push({
                            content: msg.content,
                            // createdAt: msg.createdAt,
                            // system: msg.system
                        })
                    }
                    else {
                        console.log({
                            authorID: msg.author.id,
                            authorTag: msg.author.tag,
                            content: msg.content,
                            createdAt: msg.createdAt,
                            system: msg.system
                        })
                        guildInfo["channels"][channel.name].messages.push({
                            // authorID: msg.author.id,
                            // authorTag: msg.author.tag,
                            content: msg.content,
                            // createdAt: msg.createdAt,
                            // system: msg.system
                        })
                    }
                })
            })
        }

        channel.permissionOverwrites.forEach(permission => {
            if (guild.roles.get(permission.id) == guild.defaultRole) return;

            if (guild.members.get(permission.id)) {
                let user = bot.users.cache.get(permission.id)
                guildInfo["channels"][channel.name]["permissionOverwrites"].push({
                    user: user.tag,
                    id: permission.id,
                    type: "user",
                    allow: permission.allow,
                    deny: permission.deny
                })
            }
            else {
                let role = guild.roles.get(permission.id)
                guildInfo["channels"][channel.name].permissionOverwrites.push({
                    role: role.name,
                    id: permission.id,
                    type: "role",
                    allow: permission.allow,
                    deny: permission.deny
                })
            }
        })
    })

    guild.roles.forEach(role => {
        guildInfo["roles"][role.id] = {
            name: role.name,
            color: role.color,
            position: role.position,
            calculatedPosition: role.calculatedPosition,
            hexColor: role.hexColor,
            mentionable: role.mentionable,
            permissions: role.permissions,
        }
    })

    guild.emojis.forEach(emoji => {
        guildInfo["emojis"][emoji.id] = {
            name: emoji.name,
            animated: emoji.animated,
            url: emoji.url
        }
    })

    await fs.writeFile(`../Backup/Guilds/${guild.id}.json`, JSON.stringify(guildInfo, null, 4), err => { if (err) throw err; });

    message.channel.send(`Saved ${guild.name} to files.`)
}

module.exports.info = {
    name: `saveGuild`,
    aliases: [`save`],
    developer: true
}