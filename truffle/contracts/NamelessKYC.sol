pragma solidity ^0.4.23;

contract NamelessKYC {
    uint32 private Mask = 2**32-1;
    mapping(uint32 => bool) public bloomFilter;

    function add(address addr) public {
        uint32[4] memory positions = bitPositions(addr);

        for (uint8 k = 0; k < 4; k++) {
            bloomFilter[positions[k]] = true;
        }
    }

    function madd(uint32[] positions) public {
        for (uint32 k = 0; k < positions.length; k++) {
            bloomFilter[positions[k]] = true;
        }
    }

    function isMember(address addr) public view returns (bool) {
        uint32[4] memory positions = bitPositions(addr);

        for (uint8 k; k < 4; k++) {
            if (!bloomFilter[positions[k]]) {
                return false;
            }
        }

        return true;
    }

    function addressHashes(address addr) public pure returns (bytes32[4] hashes) {
        hashes[0] = keccak256(abi.encodePacked(addr));

        for (uint32 k = 1; k < 4; k++) {
            hashes[k] = keccak256(abi.encodePacked(hashes[k-1]));
        }

        return hashes;
    }

    function bitPosition(bytes32 hash) public view returns (uint32 pos) {
        uint256 num = uint256(hash);
        pos = uint32(num & Mask);

        return pos;
    }

    function bitPositions(address addr) public view returns (uint32[4] positions) {
        bytes32[4] memory hashes = addressHashes(addr);

        for (uint8 k = 0; k < 4; k++) {
            positions[k] = bitPosition(hashes[k]);
        }

        return positions;
    }



    // uint32 private M = 32;
    // uint32 private K = 4;
    // uint32 private Mask = uint32(2)**M - 1;

    // event BloomArgs(address addr, bytes32 keccakHash, uint256 number);

    // uint32 public bloomState;

    // function updateBloomState(uint32 newBloomState) public {
    //     bloomState = newBloomState;
    // }

    // function isPermitted(address addr) public view returns (bool) {
    //     uint32 state = 0;
    //     bytes32 addrHash = keccak256(abi.encodePacked(addr));
    //     uint256 addrBn = uint256(addrHash);

    //     for (uint8 k = 0; k < K; k++) {
    //         uint32 lowBits = uint32((addrBn / (uint256(2) ** (k * M))) & Mask);
    //         uint32 bitPos = lowBits % M;
    //         uint32 shifted = 1 * uint32(2)**bitPos;

    //         state = state | shifted;
    //     }

    //     return (state & bloomState) == state;
    // }

    // function testBloomState(address addr) public {
    //     bytes32 keccakHash = keccak256(abi.encodePacked(addr));

    //     emit BloomArgs(addr, keccakHash, uint256(keccakHash));
    // }
}
