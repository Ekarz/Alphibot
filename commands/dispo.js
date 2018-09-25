const { raid } = require('./raid')
const { days } = require('../properties.json')

module.exports = {
    name: 'dispo',
    args: true,
    usage: '[date] [time] | Exemple : jeudi 21h',
    guildOnly: true,
    description: 'Donne une dispo pour l\'organisation du raid.',
    execute(message, args) {
        const playerAdded = addPlayer(message.author, args[0], args [1])
        playerAdded ? message.react('✅') : message.react('🚫')
    },
}

const addPlayer = (playerName, day, hour) => {
    const index = days.indexOf(day.toLowerCase())
    if (index >= 0 && hour.match(/^([01]?[0-9]|2[0-3])[h:]([0-5][0-9])?$/)) {
        raid[index].players[playerName] = hour
        return true
    } else return false
}
