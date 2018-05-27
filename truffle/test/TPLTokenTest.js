const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const TPLToken = artifacts.require('./TPLToken.sol')

const DeployerAddr = '0x72a851337f76e375ae34adeb72e2997919a10aef'
const ApprovedAddr = '0x1319edc6faa2f662f131d46890fc74c6a30c2e2a'
const ForbiddenAddr = '0x44324672590c33e41a6291de552da54290f56886'

contract('TPLToken', () => {
  it('should have the right token balance / supply', async () => {
    const token = await TPLToken.deployed()
    const totalSupply = await token.totalSupply()
    const deployerBalance = await token.balanceOf(DeployerAddr)

    assert(totalSupply.toNumber() === 1000000, 'Incorrect supply')
    assert(deployerBalance.toNumber() === 1000000, 'Incorrect balance')
  })
})
