const Discord = require(`discord.js`);

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (![`233301442738257920`, `97238312355364864`].includes(message.author.id)) return;

    let user = await modules.fetchUser(args[1])
    if (!user) return message.channel.send(`Couldn't find a user matching '${args[1]}'`)
    let messageToSend = args.splice(2).join(" ")
    if (!messageToSend) return message.channel.send(`Give me something to send to ${user.tag}..`)
   
    if (message.deletable) message.delete()

    user.send(messageToSend)
    message.channel.send(`Sent **"${messageToSend}"** to **${user.tag}**`)
}

module.exports.info = {
    name: `send`
}