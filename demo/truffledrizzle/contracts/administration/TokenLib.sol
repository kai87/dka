pragma solidity >=0.4.21 <0.6.0;

import "../conference/ConferenceToken.sol";

library TokenLib {
    struct TokenStruct {
        uint index;
        ConferenceToken token;
    }


    struct Data {
        mapping(bytes32 => TokenStruct) tokenMap;
        bytes32[] tokenArray;
    }


    function add(
        Data storage self,
        bytes32 _tokenSymbol
    )
    public
    {
        require(!contains(self, _tokenSymbol), 'Token already exists');
        self.tokenMap[_tokenSymbol].index = self.tokenArray.push(_tokenSymbol) - 1;
        self.tokenMap[_tokenSymbol].token = new ConferenceToken(_tokenSymbol);
    }


    function remove(
        Data storage self,
        bytes32 _tokenSymbol
    )
    public
    {
        require(contains(self, _tokenSymbol), 'Token does not exist');
        uint _index = self.tokenMap[_tokenSymbol].index;
        bytes32 _tokenToMove = self.tokenArray[self.tokenArray.length - 1];
        self.tokenArray[_index] = _tokenToMove;
        self.tokenMap[_tokenToMove].index = _index;
        self.tokenArray.length--;
    }


    function contains(
        Data storage self,
        bytes32 _tokenSymbol
    )
    public
    view
    returns (
        bool _result
    )
    {
        if (self.tokenArray.length == 0) return false;
        _result = self.tokenArray[self.tokenMap[_tokenSymbol].index] == _tokenSymbol;
    }


    function get(
        Data storage self,
        bytes32 _tokenSymbol
    )
    public
    view
    returns (
        ConferenceToken _conferenceToken
    ) {
        require(contains(self, _tokenSymbol), 'Token does not exist');
        _conferenceToken = self.tokenMap[_tokenSymbol].token;
    }


    function getAll(
        Data storage self
    )
    public
    view
    returns (
        bytes32[] memory _tokenArray
    )
    {
        _tokenArray = self.tokenArray;
    }
}