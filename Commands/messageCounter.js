const modules = require(`../modules.js`)
const fs = require(`fs`)


module.exports.run = async (bot, message, args, coreMessage, prefix) => {

    if (!["449932895919013900", "97238312355364864"].includes(message.author.id)) return message.channel.send(`This command is restricted to like, one person but technically three people, and you're not one of them, sooooooooooooo`)

    if (!coreMessage) return message.channel.send("You need to enter something that I can search the categories for.")

    if (message.guild.id == "804356806503563284" && !["811733077436006483", "804356806503563290"].includes(message.channel.id)) return message.channel.send("<a:doggo:838093145991938048> why you always run this command in private channels Katie? :c It's a work of art")

    // Fetch category channels
    // guild1 = bot.guilds.cache.get("804356806503563284");
    // guild2 = bot.guilds.cache.get("814320533344092181");

    let categories = message.guild.channels.cache.filter(x => {return x.name.toLowerCase().startsWith(coreMessage.toLowerCase()) && x.type == "category"})
    //let categories = (guild1.channels.cache).concat(guild2.channels.cache).filter(x => {return x.name.toLowerCase().startsWith(coreMessage.toLowerCase()) && x.type == "category"})
    channels = []
    list = ""
    categories.forEach(x => {
        list += `\`${x.name}\` - ${x.children.size} channels\n`
        channels = channels.concat(x.children.filter(c => c.type == "text").array())
    })

    if (!categories.size) return message.channel.send(`Couldn't find any categories starting with '${coreMessage}'`)

    let answer = await modules.sendQuestion(message.author, message.channel, `This will count all messages on all channels in the categories below, and post a leaderboard of the ones with the most.\nConfirm you are ok with this by sending "confirm", or just say "ok krystalboo", idc.\n***(They're probably out of order, it'd be a waste of CPU power to sort them c:)***\n\n${list}`, (m) => {return ["confirm", "ok krystalboo"].includes(m.content.toLowerCase())}, 60000)
    if (!answer) return;

    let length = channels.length,
    msg = await message.channel.send(`Ok, I've got ${length} more channels to go.`),
    start = Date.now()
    num = Math.round(length / 30),
    messages = {},
    messageNum = 0
    for (let i in channels) {
        let c = channels[i],

        array = await modules.fetchMessages(c, 0)
        messageNum += array.length
        messages[c.id] = array.length

        if (i % num == 0) await msg.edit(`Ok, I've got ${length - i} more channels to go.\nFound ${messageNum.toLocaleString()} messages.\n<a:loveparrot:460507059780321281> Progress bar brought to you courtesy of Rubìx:tm:\n\n${modules.progressBar(i, length, 60)}`)
    }
    let IDs = Object.keys(messages).sort((a, b) => {return messages[b] - messages[a]}),
    s = "",
    fullS = ""
    IDs.forEach((id, i) => {
        let c = bot.channels.cache.get(id);

        if (i > 10) fullS += `[${i+1}] #${c.name} - ${messages[id].toLocaleString()} messages.\n`
        else {
            s += `[${i+1}] ${c} - ${messages[id].toLocaleString()} messages.\n`
            fullS += `[${i+1}] #${c.name} - ${messages[id].toLocaleString()} messages.\n`
        }
    })
    await msg.edit(`Found ${messageNum.toLocaleString()} messages in ${length} channels in ${modules.getTimeString(Date.now() - start)}.\n\n${s}`)
    fs.writeFileSync("./JSON/messages-colDipA2.txt", fullS, 'utf-8');
    return true
}

module.exports.info = {
    name: `messagecounter`,
    type: `krystal`,
    aliases: [`messagecount`, `messages`],
    summary: `Mass count messages in all channels in like, a lot of categories`,
    usage: ``,
    developer: true
}