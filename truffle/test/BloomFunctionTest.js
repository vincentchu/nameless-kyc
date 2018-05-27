const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const { addressHashes, keccak256, bitPosition } = require('../utils/bloom')

const Address = '0x4e4e5b3585d8ed9a3954389b85574800260a04cf'

contract('NamelessKYC - Bloom functions', () => {
  it('should properly hash', async () => {
    const contract = await NamelessKYC.deployed()
    const hashes = await contract.addressHashes(Address)

    assert.deepEqual(hashes, addressHashes(Address))
  })

  it('should properly compute bitposition', async () => {
    const someHash = keccak256('hello')
    const contract = await NamelessKYC.deployed()
    const bitPos = await contract.bitPosition(someHash)

    assert.deepEqual(bitPos.toString(16), bitPosition(someHash).toString(16))
  })
})