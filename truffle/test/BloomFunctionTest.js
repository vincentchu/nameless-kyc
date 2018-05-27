const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const { addressHashes, keccak256, bitPosition, bitPositions } = require('../utils/bloom')

const Address = '0x4e4e5b3585d8ed9a3954389b85574800260a04cf'

const toHex = (n) => n.toString(16)

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
      const isFlipped = await contract.bloomFilter('0x' + toHex(pos))

      assert(isFlipped, `Position ${pos} was not flipped`)
    })
  })
})