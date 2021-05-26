const Discord = require(`discord.js`);

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!args[1]) return message.channel.send(`Invalid Usage.\nUsage: \`${prefix}${this.info.name} ("accept"/"deny") (user)`)



    switch(args[1].toLowerCase()) {
        case "accept": 
            break;
        case "deny":
            break;
        default:
            break;
    }
}

module.exports.info = {
    name: `application`,
    developer: true
}