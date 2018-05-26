pragma solidity ^0.4.23;

contract NamelessKYC {
    uint32 private M = 32;
    uint32 private K = 4;
    uint32 private Mask = uint32(2)**M - 1;

    event BloomArgs(address addr, bytes32 keccakHash, uint256 number);

    uint32 public bloomState;

    function updateBloomState(uint32 newBloomState) public {
        bloomState = newBloomState;
    }

    function isPermitted(address addr) public view returns (bool _isPermitted) {
        _isPermitted = false;

        uint32 state = 0;
        bytes32 addrHash = keccak256(abi.encodePacked(addr));
        uint256 addrBn = uint256(addrHash);

        for (uint8 k = 0; k < K; k++) {
            uint32 lowBits = uint32((addrBn / (uint256(2) ** (k * M))) & Mask);
            uint32 bitPos = lowBits % M;
            uint32 shifted = 1 * uint32(2)**bitPos;

            state = state | shifted;
        }

        return (state & bloomState) == state;
    }

    function testBloomState(address addr) public {
        bytes32 keccakHash = keccak256(abi.encodePacked(addr));

        emit BloomArgs(addr, keccakHash, uint256(keccakHash));
    }
}
