const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const TPLToken = artifacts.require('./TPLToken.sol')

module.exports = (deployer) => deployer.deploy(NamelessKYC)
  .then((namelessKYC) => deployer.deploy(TPLToken, namelessKYC.address))