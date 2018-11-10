const { raid } = require('./raid')

module.exports = {
    name: 'pasdispo',
    description: "Indique une absence de disponibilités pour ne pas être pris en compte lors des appels générés par " +
        "la commande spam.",
    guildOnly: true,
    raiderOnly: true,
    unavailablePlayers: [],
    execute(message, args) {
        emptyAvailabilities(message.author)
        if (!this.unavailablePlayers.includes(message.author)) this.unavailablePlayers.push(message.author)
        message.react('✅')
    },
}

const emptyAvailabilities = playerName => {
    for (raidDay of raid) {
        delete raidDay.players[playerName]
    }
}
