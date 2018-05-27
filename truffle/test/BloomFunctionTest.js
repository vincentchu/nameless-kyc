const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const { addressHashes, keccak256, bitPosition, bitPositions } = require('../utils/bloom')

const Address = '0x4e4e5b3585d8ed9a3954389b85574800260a04cf'

const BulkAddresses = [
  '0x4e4e5b3585d8ed9a3954389b85574800260a04cf',
  '0xed33763cb19622abeec69f1bd2c7579dd0b0fe34',
]

const toHex = (n) => n.toString(16)
const toEthHex = (n) => '0x' + toHex(n)

contract('NamelessKYC - Bloom functions', () => {
  it('should properly hash', async () => {
    const contract = await NamelessKYC.deployed()
    const hashes = await contract.addressHashes(Address)

    assert.deepEqual(hashes, addressHashes(Address))
  })

  it('should properly compute bit position', async () => {
    const someHash = keccak256('hello')
    const contract = await NamelessKYC.deployed()
    const bitPos = await contract.bitPosition(someHash)

    assert.deepEqual(bitPos.toString(16), bitPosition(someHash).toString(16))
  })

  it('should properly compute bit positions for an address', async () => {
    const contract = await NamelessKYC.deployed()
    const bitIdxs = await contract.bitPositions(Address)

    assert.deepEqual(bitIdxs.map(toHex), bitPositions(Address).map(toHex))
  })

  it('should properly add an address', async () => {
    const contract = await NamelessKYC.deployed()
    await contract.add(Address)

    bitPositions(Address).map(async (pos) => {
      const isFlipped = await contract.bloomFilter(toEthHex(pos))

      assert(isFlipped, `Position ${pos} was not flipped`)
    })
  })

  it('should properly check presence of an address', async () => {
    const contract = await NamelessKYC.deployed()
    const isMember = await contract.isMember(Address)

    assert(isMember, `Address ${Address} was not found!`)
  })

  it('should properly check presence of an address that does not exist', async () => {
    const contract = await NamelessKYC.deployed()
    const missingAddr = '0xa49760620489677e09dfc9c7d3562dc54afa4beb'
    const isMember = await contract.isMember(missingAddr)

    assert(!isMember, `Address ${missingAddr} was not found!`)
  })

  it('should allow bulk addresses to be added directly', async () => {
    const contract = await NamelessKYC.deployed()
    const positions = []
    BulkAddresses.forEach((addr) => {
      bitPositions(addr).forEach((pos) => positions.push(toEthHex(pos)))
    })


    await contract.madd(positions)
  })

  it('should appropriately track bulk-added addresses', async () => {
    const contract = await NamelessKYC.deployed()

    const outcomes = await Promise.all(BulkAddresses.map((addr) => contract.isMember(addr)))

    outcomes.forEach((outcome) => assert(outcome, 'Address not tracked properly'))
  })
})