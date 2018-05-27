const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const { addressHashes } = require('../utils/bloom')

const Address = '0x4e4e5b3585d8ed9a3954389b85574800260a04cf'

contract('NamelessKYC - Bloom functions', () => {
  it('should properly hash', async () => {
    const contract = await NamelessKYC.deployed()
    const hashes = await contract.addressHashes(Address)

    assert.deepEqual(hashes, addressHashes(Address))
  })
})