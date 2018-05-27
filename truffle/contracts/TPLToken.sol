pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "./NamelessKYC.sol";

contract TPLToken is StandardToken {
    NamelessKYC validator;

    constructor(NamelessKYC _validator) public {
        validator = _validator;
        totalSupply_ = 1000000;
        balances[msg.sender] = 1000000;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(validator.transferAllowed(msg.sender, _to, _value));
        super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(validator.transferAllowed(_from, _to, _value));
        super.transferFrom(_from, _to, _value);
    }
}