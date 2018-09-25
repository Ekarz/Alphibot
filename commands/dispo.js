const { raid } = require('./raid')

module.exports = {
    name: 'dispo',
    args: true,
    usage: '[date] [time] | Exemple : jeudi 21h',
    guildOnly: true,
    description: 'Donne une dispo pour l\'organisation du raid.',
    execute(message, args) {
        const playerAdded = addPlayer(message.author.name, args[0], args [1])
        playerAdded ? message.react('✅') : message.react('🚫')
    },
}

const addPlayer = (playerName, day, hour) => {
    const index = days.indexOf(day)
    if (index >= 0 && hour.match(/([01]?[0-9]|2[0-3])[h:]([0-5][0-9])?/)) {
        raid[index].players.push({ playerName, hour })
        return true
    } else return false
}
