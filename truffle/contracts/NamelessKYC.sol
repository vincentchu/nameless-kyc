pragma solidity ^0.4.23;

contract NamelessKYC {
    event BloomArgs(address addr, bytes32 keccakHash);

    uint32 public bloomState;

    function updateBloomState(uint32 newBloomState) public {
        bloomState = newBloomState;
    }

    function isPermitted(address addr) public view returns (bool _isPermitted) {
        _isPermitted = true;
        return _isPermitted;
    }

    function testBloomState(address addr) public {
        bytes32 keccakHash = keccak256(abi.encodePacked(addr));

        emit BloomArgs(addr, keccakHash);
    }
}
