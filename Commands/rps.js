const Discord = require(`discord.js`)

const userinfo = require(`../JSON/userinfo.json`)
const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, content, prefix) => {
    let options = ['rock', 'paper', 'scissors'],
    counters = ['paper', 'scissors', 'rock']

    options.forEach(option => {
        if (option.startsWith(args[1].toLowerCase()) && args[1] != "") args[1] = option
    })
    if (!options.includes(args[1])) return message.channel.send(`That's not "rock", "paper", or "scissors" is it?`)

    let computerChoice = options[modules.randomInt(0, options.length - 1)],
    string = `You throw ${capitalise(args[1])}.`,
    msg = await message.channel.send(string)
    await modules.delay(1)
    msg.edit(string += `\n${capitalise(computerChoice)}! `)
    await modules.delay(0.5)
 
    if (args[1] == computerChoice) {
        msg.edit(string += `\nOh.`)
        await modules.delay(0.5)
        msg.edit(string += `\nA draw.`)
    }
    else if (computerChoice == counters[options.indexOf(args[1])]) {
        msg.edit(string += `Yay!! I win!`)
    }
    else {
        msg.edit(string += `Shit..`)
        await modules.delay(0.5)
        msg.edit(string += `\nRubix rigged it.`)
    }
}

module.exports.info = {
    name: `rps`,
    type: `fun`,
    usage: `<"rock", "paper" or "scissors">`,
    summary: `Play Rock, Paper, Scissors!`
}

const capitalise = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }