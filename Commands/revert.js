const Discord = require(`discord.js`);
const fs = require(`fs`)

const modules = require(`../modules.js`)

module.exports.run = async(bot, message, args, command, coreMessage, date) => {
    guild = bot.guilds.cache.get("446770975262900254")
    if (!guild.name.startsWith("Rubix's Apocalyptic")) return;

    let toSend = new String(`Reverting changes for ${guild.name}...\n`)

    guild.channels.forEach(channel => {
        if (channel.parentID == `447110830002143243` || channel.id == `447110830002143243` || !channel.guild.id == `446770975262900254`) toSend += `Didn't delete **${channel.type}** channel **${channel.name}** because it's special.\n`
        else {
            channel.delete()
            console.log(`Deleted **${channel.type}** channel - **${channel.name}**`)
            toSend += `Deleted **${channel.type}** channel - **${channel.name}\n**`
        }
    })
    toSend += "\nChannels reverted. :ok_hand:"

    message.channel.send(toSend)
}

module.exports.info = {
    name: `revert`,
    developer: true
}