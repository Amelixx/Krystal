const Discord = require(`discord.js`)

//const colorRoles = require(`../../Kuro/JSON/Storage/colorRoles.json`)
const colorRoles = require(`../JSON/newColorRoles.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    description = new String()
    
    count = 0
    for (let role in colorRoles) {


        guildRole = await message.guild.roles.cache.get.find(r => r.name == colorRoles[role].name)

        if (!guildRole) continue
        if (count < 5) {description += `${guildRole}  `}
        else {description += `${guildRole}\n`; count = 0}
        count ++
    }
    
    embed = new Discord.MessageEmbed()
    .setColor(`5d10e9`)
    .setTitle(`Colour Roles List`)
    .setDescription(description)

    message.channel.send({embed})
}

module.exports.info = {
    name: `colorroles`,
    type: `krystal`,
    aliases: [`colourroles`],
    summary: `Displays all of the colour roles, and their appropiate colour. For reference.`,
    inKrystal: true
}