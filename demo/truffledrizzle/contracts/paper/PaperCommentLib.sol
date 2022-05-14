pragma solidity ^0.5.0;

/// @dev store IPFS into multi hash, instead of bytes, for efficiency.
library PaperCommentLib {
    struct CommentStructure {
        uint index;
        address commenter;
        uint blockTimestamp;

        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }

    struct Data {
        mapping(address => CommentStructure) commentMap;
        address [] addressArray;
    }

    function contains(
        Data storage self,
        address _address
    )
    view public
    returns (bool _result) {
        if (self.addressArray.length == 0) return false;
        _result = self.addressArray[self.commentMap[_address].index] == _address;
    }

    function insert(
        Data storage self,
        address _commenter,
        bytes32 _digest,
        uint8 _hashFunction,
        uint8 _size
    )
    public
    {
        require(!contains(self, _commenter));
        self.commentMap[_commenter].index = self.addressArray.push(_commenter) - 1;
        self.commentMap[_commenter].commenter = _commenter;
        self.commentMap[_commenter].blockTimestamp = block.timestamp;
        self.commentMap[_commenter].digest = _digest;
        self.commentMap[_commenter].hashFunction = _hashFunction;
        self.commentMap[_commenter].size = _size;
    }

    function get(Data storage self, address _commenter)
    public view
    returns (uint _blockTimestamp, bytes32 _digest, uint8 _hashFunction, uint8 _size)
    {
        _blockTimestamp = self.commentMap[_commenter].blockTimestamp;
        _digest = self.commentMap[_commenter].digest;
        _hashFunction = self.commentMap[_commenter].hashFunction;
        _size = self.commentMap[_commenter].size;
    }

    function getAllCommenter(Data storage self)
    public view
    returns (address[] memory _result)
    {
        _result = self.addressArray;
    }

    function getAllReviews(Data storage self)
    public view
    returns (
        address[] memory,
        uint[] memory,
        bytes32[] memory,
        uint8[] memory,
        uint8[] memory
    )
    {
        uint _numberOfComments = self.addressArray.length;
        address[] memory _addressArray = new address[](_numberOfComments);
        uint[] memory _blockTimestampArray = new uint[](_numberOfComments);
        bytes32[] memory _digestArray = new bytes32[](_numberOfComments);
        uint8[] memory _hashFunctionArray = new uint8[](_numberOfComments);
        uint8[] memory _sizeArray = new uint8[](_numberOfComments);
        for (uint i = 0; i < _numberOfComments; i++) {
            _addressArray[i] = self.addressArray[i];
            _blockTimestampArray[i] = self.commentMap[self.addressArray[i]].blockTimestamp;
            _digestArray[i] = self.commentMap[self.addressArray[i]].digest;
            _hashFunctionArray[i] = self.commentMap[self.addressArray[i]].hashFunction;
            _sizeArray[i] = self.commentMap[self.addressArray[i]].size;
        }
        return (_addressArray, _blockTimestampArray, _digestArray, _hashFunctionArray, _sizeArray);
    }
}