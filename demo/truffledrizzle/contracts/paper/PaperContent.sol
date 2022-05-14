pragma solidity ^0.5.0;

/// @dev store IPFS into multi hash, instead of bytes, for efficiency.
contract PaperContent {
    struct PaperContentStructure {
        bytes32 title;
        uint blockTimestamp;
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }

    PaperContentStructure[] internal paperContentArray;

    // External Functions
    function displayPaperContent(uint index)
    external view
    returns (
        bytes32 _title,
        bytes32 _digest,
        uint8 _hashFunction,
        uint8 _size,
        uint _blockTimestamp
    )
    {
        PaperContentStructure memory _paperContent = paperContentArray[index];
        _title = _paperContent.title;
        _digest = _paperContent.digest;
        _hashFunction = _paperContent.hashFunction;
        _size = _paperContent.size;
        _blockTimestamp = _paperContent.blockTimestamp;
    }

    function displayLatestPaperContent()
    external view
    returns (
        bytes32 _title,
        bytes32 _digest,
        uint8 _hashFunction,
        uint8 _size,
        uint _blockTimestamp
    )
    {
        PaperContentStructure memory _paperContent = paperContentArray[paperContentArray.length - 1];
        _title = _paperContent.title;
        _digest = _paperContent.digest;
        _hashFunction = _paperContent.hashFunction;
        _size = _paperContent.size;
        _blockTimestamp = _paperContent.blockTimestamp;
    }

    function displayPaperContentHistory()
    external view
    returns (
        bytes32[] memory _titles,
        bytes32[] memory _digests,
        uint8[] memory _hashFunctions,
        uint8[] memory _sizes,
        uint[] memory _timestamp
    )
    {
        uint numberOfVersions = paperContentArray.length;
        _titles = new bytes32[](numberOfVersions);
        _digests = new bytes32[](numberOfVersions);
        _hashFunctions = new uint8[](numberOfVersions);
        _sizes = new uint8[](numberOfVersions);
        _timestamp = new uint[](numberOfVersions);

        for (uint i = 0; i < paperContentArray.length; i++) {
            _titles[i] = paperContentArray[i].title;
            _digests[i] = paperContentArray[i].digest;
            _hashFunctions[i] = paperContentArray[i].hashFunction;
            _sizes[i] = paperContentArray[i].size;
            _timestamp[i] = paperContentArray[i].blockTimestamp;
        }
    }
}