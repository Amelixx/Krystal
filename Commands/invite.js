const Discord = require(`discord.js`);

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    const Krystal = modules.Krystal()

    onlineMembers = Krystal.members.cache.filter(x => x.user.presence.status != "offline").array().length

    if (args[1] && (args[1].toLowerCase() == `mobile` || args[1].toLowerCase() == `noembed`)) {
        message.channel.send(`**Invitation to Krystal**\nhttps://discord.gg/AFN56Cn\n<:greendot:473129691625029633>${onlineMembers} Online` +
                             `<:purpledot:473129722088390666>${Krystal.memberCount} Members`)
    }
    else {
        let embed = new Discord.MessageEmbed()
        .setColor(`5d10e9`)
        .setTitle(`Invitation to ${Krystal.name}`)
        .setThumbnail(Krystal.iconURL)
        .setDescription(`:comet:[Join Krystal](https://discord.gg/AFN56Cn):comet:\n<:greendot:473129691625029633>${onlineMembers} Online <:purpledot:473129722088390666>${Krystal.memberCount} Members`)
        .setFooter(`On mobile? Try ${prefix}invite mobile for a mobile friendly version!`)
        message.channel.send({embed})
    }
}

module.exports.info = {
    name: `invite`,
    type: `info`,
    summary: `Provides an invite to Krystal.`
}