const pasdispo = require('../commands/pasdispo')
const { raid } = require('../commands/raid')

const message = {
    author: 'Ekar',
    react: jest.fn()
}

test('adds player to unavailablePlayers', () => {
    pasdispo.execute(message)
    expect(pasdispo.unavailablePlayers).toContain('Ekar')
    expect(message.react).toHaveBeenCalled()
})

test('removes player from dispo', () => {
    raid.push({
        date: "testDate",
        players: {'Ekar': '22h', 'Kristine': '21h'}
    })
    pasdispo.execute(message)
    expect(raid[0].players.Ekar).toBeUndefined()
    expect(raid[0].players.Kristine).toBeTruthy()
    expect(message.react).toHaveBeenCalled()
})

test('does not add same player twice', () => {
    pasdispo.execute(message)
    pasdispo.execute(message)
    expect(pasdispo.unavailablePlayers).toHaveLength(1)
    expect(message.react).toHaveBeenCalled()
})
