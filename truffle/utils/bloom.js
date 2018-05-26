const Web3 = require('web3')

const _web3 = new Web3()
const keccak256 = _web3.utils.keccak256

const bloomFn = (addr) => {
  const addrHash = keccak256(addr)

  return _web3.utils.toBN(0)
}

const bloomStateFor = (addrs) => {
  let bloomBn = _web3.utils.toBN(0)

  addrs.forEach((addr) => {
    bloomBn = bloomBn | bloomFn(addr)
  })

  return bloomBn
}

module.exports = {
  keccak256,
  bloomStateFor,
}