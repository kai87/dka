pragma solidity ^0.5.0;

import "../token/ERC20/ERC20.sol";
import "../token/ERC20/ERC20Detailed.sol";
import "../token/ERC20/ERC20Mintable.sol";
import "../utils/ConversionLib.sol";

/// @dev All our coins have a decimal of 18 (just like Ethereum)
contract ConferenceToken is ERC20, ERC20Detailed, ERC20Mintable {
    using ConversionLib for bytes32;

    uint8 constant DECIMAL = 18;

    constructor(bytes32 _tokenSymbol)
    ERC20Detailed(
        _tokenSymbol.bytes32ToString(),
        _tokenSymbol.bytes32ToString(),
        DECIMAL
    )
    public{}
}