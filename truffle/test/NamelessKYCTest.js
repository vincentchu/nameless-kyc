const NamelessKYC = artifacts.require('./NamelessKYC.sol')

contract('NamelessKYC', () => {
  it('should be deployed with base state', async () => {
    const contract = await NamelessKYC.deployed()
    const bloomState = await contract.bloomState()

    assert.deepEqual(bloomState.toNumber(), 0)
  })
})