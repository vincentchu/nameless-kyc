pragma solidity ^0.4.23;

contract NamelessKYC {
    uint32 private Mask = 2**32-1;
    mapping(uint32 => bool) public bloomFilter;

    function transferAllowed(address _from, address _to, uint256) public view returns (bool) {
        return isMember(_from) && isMember(_to);
    }

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
}
