const NamelessKYC = artifacts.require('./NamelessKYC.sol')
const { bitPositions } = require('../utils/bloom')

const NumAddrs = 100
const GroupSize = 50

const Chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']

const randChar = () => {
  const i = Math.floor(Math.random() * 16)

  return Chars[i]
}

const randAddr = () => {
  const addr = Array(40).fill(0).map(randChar).join('')

  return '0x' + addr
}

const countTrue = (outcomes) => {
  let n = 0

  outcomes.forEach((outcome) => {
    if (outcome) {
      n++
    }
  })

  return n
}

const genAddrs = (n) => Array(n).fill(0).map(randAddr)

contract('NamelessKYC - Bulk KYC', () => {
  const kycedAddrs = genAddrs(NumAddrs)
  const unKycedAddrs = genAddrs(NumAddrs)

  it('should successfully add all addresses', async () => {
    const contract = await NamelessKYC.deployed()

    for (let i = 0; i < (NumAddrs / GroupSize); i++) {
      let positions = []
      kycedAddrs.slice(i * GroupSize, (i + 1) * GroupSize).forEach((addr) => {
        bitPositions(addr).forEach((pos) => {
          positions.push('0x' + pos.toString(16))
        })
      })

      await contract.madd(positions)
    }
  })

  it('should have true positives', async () => {
    const contract = await NamelessKYC.deployed()
    const outcomes = await Promise.all(kycedAddrs.map((addr) => contract.isMember(addr)))
    const nTrue = countTrue(outcomes)

    assert(nTrue === NumAddrs, 'Unexpected false negative')
  })

  it('should not have any false positives', async () => {
    const contract = await NamelessKYC.deployed()
    const outcomes = await Promise.all(unKycedAddrs.map((addr) => contract.isMember(addr)))
    const nTrue = countTrue(outcomes)

    assert(nTrue === 0, 'Unexpected false positive')
  })
})
