const Discord = require(`discord.js`)

const chalk = require(`chalk`)

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let guildToPaste = await modules.fetchGuild(coreMessage) || require(`../../Backup/Guilds/${coreMessage}.json`)
    if (!guildToPaste) return message.channel.send(`I can't find a guild matching that.`)

    let guildInfo = require(`../../Backup/Guilds/${guildToPaste.id}.json`)

    if (!guildInfo) return message.channel.send(`I haven't saved that guild to the database.`)
    guild = guildInfo

    message.channel.delete()
    
    let categories = new Array()
    for (let channel in guild.channels) {
        channel = guild.channels[channel]
        overWrites = new Array()
        for (let overWrite in channel.permissionOverwrites) {
            overWrite = channel.permissionOverwrites[overWrite]
            overWrites.push({id: overWrite.id, type: overWrite.type, channel: channel})
        }
        let newChannel = await message.guild.createChannel(channel.name, channel.type, overWrites)

        newChannel.edit({
            topic: channel.topic,
            bitrate: channel.bitrate
        })

        if (newChannel.type == `category`) categories.push(newChannel)
    }

    message.guild.channels.forEach(newChannel => {
            correspondingChannel = guild.channels[newChannel.name]
            for (let category in categories) {
                category = categories[category]
                if (category.name === correspondingChannel.parent) {
                    console.log(chalk.greenBright(`Set the parent of `) + chalk.green(newChannel.name) + chalk.greenBright(` to `) + chalk.green(category.name))
                    newChannel.setParent(category)
                    break;
                }
            }

            for (let channel in guild.channels) {
                if (correspondingChannel == guild.channels[channel]) {
                    newChannel.edit({position: correspondingChannel.position})
                    console.log(`Edited the position of ${newChannel.name} to ${correspondingChannel.position}`)
                }
            }
    })
}

module.exports.info = {
    name: `pasteguild`,
    aliases: [`paste`],
    developer: true
}