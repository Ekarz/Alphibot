const { raid } = require('./raid')
const { days } = require('../config.json')

module.exports = {
    name: 'dispo',
    args: true,
    usage: '[date] [time] | Exemple : jeudi 21h',
    guildOnly: true,
    raiderOnly: true,
    description: 'Donne une dispo pour l\'organisation du raid.',
    execute(message, args) {
        let OK = true
        for (let i = 0; i < args.length; i += 2) {
            const playerAdded = addPlayer(message.author, args[i], args [i+1])
            if (!playerAdded) {
                message.reply(`La date "${args[i]} ${args[i+1]}" est mauvaise, mais j'ai pu traiter les dates d'avant s'il y en avait.`)
                OK = false
                break
            }
        }
        message.react(OK ? '✅' : '🚫')
    },
}

const addPlayer = (playerName, day, hour) => {
    const index = days.indexOf(day.toLowerCase())
    if (index >= 0 && hour.match(/^([01]?[0-9]|2[0-3])[Hh:]([0-5][0-9])?$/)) {
        raid[index].players[playerName] = hour.toLowerCase().replace(':', 'h')
        return true
    } else return false
}
