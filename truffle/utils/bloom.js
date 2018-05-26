const BigNumber = require('big.js')
const Web3 = require('web3')

const _web3 = new Web3()

const keccak256 = _web3.utils.keccak256

const bloomStateFor = (addrs) => {
  const bloomBn = BigNumber(0)

  return bloomBn
}

module.exports = {
  keccak256,
  bloomStateFor,
}