const Web3 = require('web3')

const _web3 = new Web3()
const keccak256 = _web3.utils.keccak256

const NHashes = 4
const BitMask = _web3.utils.toBN('0xffffffff')

const addressHashes = (addr) => {
  hashes = Array(NHashes)

  hashes[0] = keccak256(addr.toLowerCase())

  for (let k = 1; k < NHashes; k++) {
    hashes[k] = keccak256(hashes[k-1])
  }

  return hashes
}

const bitPosition = (hash) => {
  const num = _web3.utils.toBN(hash)

  return num.and(BitMask)
}

const bitPositions = (addr) => {
  const hashes = addressHashes(addr)

  return hashes.map(bitPosition)
}

module.exports = {
  keccak256,
  addressHashes,
  bitPosition,
  bitPositions,
}