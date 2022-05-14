pragma solidity ^0.5.0;

import "../math/SafeMath.sol";

contract EthereumLedger {
    using SafeMath for uint256;
    mapping(address => uint256) internal ethereumLedger;
    uint256 internal frozenAmount;

    function withdrawEther()
    external
    {
        address payable receiver = msg.sender;
        uint _amount = ethereumLedger[receiver];
        receiver.transfer(_amount);
        ethereumLedger[receiver] = ethereumLedger[receiver].sub(_amount);
    }

    function getBalance()
    external view
    returns (uint256 _amount) {
        _amount = ethereumLedger[msg.sender];
    }
}