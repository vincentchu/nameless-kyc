const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const TPLToken = artifacts.require('./TPLToken.sol')

const DeployerAddr = '0x72a851337f76e375ae34adeb72e2997919a10aef'
const ApprovedAddr = '0x1319edc6faa2f662f131d46890fc74c6a30c2e2a'
const ForbiddenAddr = '0x44324672590c33e41a6291de552da54290f56886'

const RevertMessage = 'VM Exception while processing transaction: revert'

contract('TPLToken', () => {
  it('should have the right token balance / supply', async () => {
    const token = await TPLToken.deployed()
    const totalSupply = await token.totalSupply()
    const deployerBalance = await token.balanceOf(DeployerAddr)

    assert(totalSupply.toNumber() === 1000000, 'Incorrect supply')
    assert(deployerBalance.toNumber() === 1000000, 'Incorrect balance')
  })

  it('should forbid transfers before KYC', async () => {
    const token = await TPLToken.deployed()

    try {
      await token.transfer(ApprovedAddr, 1)
    } catch (err) {
      assert(err.message === RevertMessage, 'Unexpected error')
    }
  })

  it('should allow an address to be KYCed', async () => {
    const kyc = await NamelessKYC.deployed()
    await kyc.add(DeployerAddr)
    await kyc.add(ApprovedAddr)
    const isApproved = await kyc.isMember(ApprovedAddr)

    assert(isApproved, `Addr ${ApprovedAddr} expected to be KYC'ed`)
  })

  it('should allow KYCed address to receive funds', async () => {
    const token = await TPLToken.deployed()
    await token.transfer(ApprovedAddr, 1)

    const balance = await token.balanceOf(ApprovedAddr)

    assert.deepEqual(balance.toNumber(), 1, `Balance: ${balance.toString()} is wrong`)
  })

  it('should not allow un-KYCed address to receive funds', async () => {
    const token = await TPLToken.deployed()

    try {
      await token.transfer(ForbiddenAddr, 1)
      assert(false, 'Should have thrown exception, but did not')
    } catch (err) {
      assert(err.message === RevertMessage, 'Unexpected error')
    }
  })
})
