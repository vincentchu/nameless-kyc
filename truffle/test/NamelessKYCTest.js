const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const { keccak256, bloomStateFor } = require('../utils/bloom')

const Addresses = [
  '0x4e4e5b3585d8ed9a3954389b85574800260a04cf',
  '0xed33763cb19622abeec69f1bd2c7579dd0b0fe34',
]

contract('NamelessKYC', () => {
  it('should be deployed with base state', async () => {
    const contract = await NamelessKYC.deployed()
    const bloomState = await contract.bloomState()

    assert.deepEqual(bloomState.toNumber(), 0)
  })

  it('should produce a bloom state that is consistent with computed one', async () => {
    const addr = Addresses[0]
    const contract = await NamelessKYC.deployed()
    const evtArgs = await contract.testBloomState(addr).then((rcpt) => {
      const [ { args } ] = rcpt.logs

      return args
    })

    assert.deepEqual(evtArgs.addr, addr)
    assert.deepEqual(evtArgs.keccakHash, keccak256(addr))
  })

  it('should allow bloomState to be updated', async () => {
    const contract = await NamelessKYC.deployed()

    await contract.updateBloomState(999)
    const bloomState = await contract.bloomState()

    assert.equal(999, bloomState)
  })

  it('should kyc allowed addresses', async () => {
    const contract = await NamelessKYC.deployed()
    console.log('***************')
    const bloomState = web3.toBigNumber(bloomStateFor(Addresses).toString())
    console.log('***************')
    await contract.updateBloomState(bloomState)

    Addresses.forEach(async (addr) => {
      const isPermitted = await contract.isPermitted(addr)
      assert(isPermitted, `Address: ${addr} was not permitted, but should have been`)
    })
  })

  it('should forbid non-KYCed addresses', async () => {
    const contract = await NamelessKYC.deployed()
    const addr = '0x59863C940e11F63550bb338F01c1E78EAa5698a7'
    const isPermitted = await contract.isPermitted(addr)

    assert(!isPermitted, `Address: ${addr} was permitted, should not have been`)
  })
})