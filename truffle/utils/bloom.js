const BigNumber = require('big.js')
const Web3 = require('web3')

const _web3 = new Web3()

module.exports = {
  keccak256: _web3.utils.keccak256
}