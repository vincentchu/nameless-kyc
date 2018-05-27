const Web3 = require('web3')

const _web3 = new Web3()
const keccak256 = _web3.utils.keccak256

const M = 32
const K = 4
const Mask = _web3.utils.toBN(2**M-1) // m = 32 bits, 2**32 - 1

const bloomFn = (addr) => {
  let state = _web3.utils.toBN(0)
  const addrHash = keccak256(addr)
  const addrBn = _web3.utils.toBN(addrHash)

  for (let k = 0; k < K; k++) {
    const bitPos = addrBn.shrn(k * M).and(Mask).mod(_web3.utils.toBN(M)).toNumber(10)
    const shifted = _web3.utils.toBN(1).shln(bitPos)

    state = state.or(shifted)
  }

  return state
}

const bloomStateFor = (addrs) => {
  let bloomBn = _web3.utils.toBN(0)

  addrs.forEach((addr) => {
    bloomBn = bloomBn.or(bloomFn(addr))
  })

  return bloomBn
}

const displayBloomState = (bloomState) => {
  const bloomStateStr = bloomState.toString(2)

  const x =  _web3.utils.padLeft(bloomStateStr, M - bloomStateStr.length)

}

const NHashes = 4

const addressHashes = (addr) => {
  hashes = Array(NHashes)

  hashes[0] = keccak256(addr.toLowerCase())

  for (let k = 1; k < NHashes; k++) {
    hashes[k] = keccak256(hashes[k-1])
  }

  return hashes
}

const BitMask = _web3.utils.toBN('0xffffffff')

const bitPosition = (hash) => {
  const num = _web3.utils.toBN(hash)

  return num.and(BitMask)
}

const bitPositions = (addr) => {
  const hashes = addressHashes(addr)

  return hashes.map(bitPosition)
}

module.exports = {
  bloomStateFor,
  bloomFn,
  displayBloomState,

  // New stuff
  keccak256,
  addressHashes,
  bitPosition,
  bitPositions,
}