const dispo = require('../commands/dispo')
const raid = require('../commands/raid')
const { unavailablePlayers } = require('../commands/pasdispo')

const message = {
    author: 'Ekar',
    react: jest.fn(),
    channel: {send: jest.fn()}
}

const args = ['mardi', 'jeudi', '21h', 'mercredi', '20h', 'we', '23h']

beforeEach(() => {
    raid.execute(message)
});

test('removes player from unavailable', () => {
    unavailablePlayers.push('Ekar')
    dispo.execute(message, args)
    expect(unavailablePlayers).toHaveLength(0)
})

test("adds player's availabilities", () => {
    dispo.execute(message, args)
    expect(raid.raid[0].players.Ekar).toBe('21h')
    expect(raid.raid[1].players.Ekar).toBe('20h')
    expect(raid.raid[2].players.Ekar).toBe('21h')
    expect(raid.raid[4].players.Ekar).toBe('23h')
    expect(raid.raid[5].players.Ekar).toBe('23h')
})
