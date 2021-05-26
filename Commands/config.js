const Discord = require(`discord.js`);
const fs = require(`fs`)

const settings = require(`../config.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!coreMessage) return;

    if (args[1].toLowerCase() == `welcomemessage`) {
        settings.welcomeMessage = args.splice(2).join(" ")
        fs.writeFile(`./config.json`, JSON.stringify(settings, null, 4), err => {if (err) throw err})
        return message.channel.send(`Set the welcome message to:\n\n${settings.welcomeMessage}`)
    } 
}

module.exports.info = {
    name: `config`,
    type: `admin`,
    summary: `Configuration for Krystal.`,
    aliases: [`configuration`, `cfg`],
    developer: true
}