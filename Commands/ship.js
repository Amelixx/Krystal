const Discord = require(`discord.js`)

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (message.author.id == `537710575720071189`) return message.channel.send(`SUCICD- sorry I mean I hate you lma0`)
    if (!["97238312355364864", "635572357217648643"].includes(message.author.id)) return message.channel.send(`Yeah ew, why would I have a ship including you?`)

    let embed = new Discord.MessageEmbed()
        .setColor(`#e60580`)
        .setTitle(`A R I N A`)
        .setDescription(`Best Ship Ever!!`)
        .setThumbnail(`https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png`)
        .addField(`Main`, `Alinaabooo 🥺`, true)
        .addField(`Other`, `Arun`, true)
        .addField(`Level`, 9999999, true)
        .addField(`xp`, `666/666`, true)
        .addField(`Set Sail`, `26th April 2020 <3`)

    message.channel.send({embed})
}   

module.exports.info = {
    name: `ship`
}