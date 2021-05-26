const Discord = require(`discord.js`);

const ytdl = require(`ytdl-core`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let channel = bot.channels.cache.get("609552033598537730")

    try {
    channel.join().then(x => {
        stream = ytdl(args[1], {filter: "audioonly"});
        x.playStream(stream, {seek: 0, volume: 1})
        message.channel.send(`Playing...`)
    })
    } catch (e) {message.channel.send(`***OOF!***\nSomething went wrong:\n${e}`)}
}

module.exports.info = {
    name: `play`
}