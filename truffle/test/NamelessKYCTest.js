const NamelessKYC = artifacts.require('./NamelessKYC.sol')

contract('NamelessKYC', () => {
  it('should be deployed', async () => {
    const contract = await NamelessKYC.deployed()
  })
})