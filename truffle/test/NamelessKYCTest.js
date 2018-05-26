const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const { keccak256 } = require('../utils/bloom')

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
    console.log('ff', evtArgs)

    assert.deepEqual(evtArgs.addr, addr)
    assert.deepEqual(evtArgs.keccakHash, keccak256(addr))
  })

  // it('should allow bloomState to be updated', async () => {
  //   console.log('hi')
  //   const contract = await NamelessKYC.deployed()
  //   await contract.testHash().then((x) => {
  //     console.log(x.logs[0].args)
  //   })
  // })
})