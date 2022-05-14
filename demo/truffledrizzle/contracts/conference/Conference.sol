pragma solidity >=0.4.21 <0.6.0;

import "./ConferenceToken.sol";
import "./ConferenceConfig.sol";
import "../paper/Paper.sol";
import "../ownership/Secondary.sol";

/// @dev there is no unique identifier for paper. Authors can always submit new papers (and pay money)
contract Conference is Secondary, ConferenceConfig {

    using SafeMath for uint256;
    Paper[] private paperArray;

    constructor (
        bytes32 _conferenceName,
        address _ownerAddress,
        ConferenceToken _conferenceToken,
        uint256 _exchangeRate,
        uint256 _paperFee,
        uint256 _constructiveReviewFee,
        uint256 _criticalReviewReward
    )
    ConferenceConfig(
        _conferenceName,
        _ownerAddress,
        _conferenceToken,
        _exchangeRate,
        _paperFee,
        _constructiveReviewFee,
        _criticalReviewReward
    )
    public
    {}

    function closeReview()
    external
    {
        require(msg.sender == getOwnerAddress());
        for(uint i = 0; i < paperArray.length; i ++) {
            paperArray[i].distributeTokens();
        }
    }

    function insertPaper(
        bytes32 _title,
        bytes32 _digest,
        uint8 _hashFunction,
        uint8 _size
    )
    public
    {
        Paper _paper = new Paper(this, msg.sender);
        getToken().transferFrom(
            msg.sender,
            address(_paper),
            getPaperFee()
        );
        _paper.transferPrimary(primary());
        _paper.insertPaperContent(_title, _digest, _hashFunction, _size);
        uint _index = paperArray.push(_paper) - 1;
        _paper.setIndex(_index);
    }

    function payConstructiveReviewFee(
        uint _index,
        address _reviewer
    )
    public
    {
        require(msg.sender == address(paperArray[_index]), "Only paper contract can call this method");
        getToken().transferFrom(
            _reviewer, address(paperArray[_index]), getConstructiveReviewFee()
        );

    }

    function getTotalNumberOfPapers()
    public view
    returns (uint _size) {
        _size = paperArray.length;
    }

    function getPaper(uint _index)
    public view
    returns (Paper _paper)
    {
        _paper = paperArray[_index];
    }

    function convertEtherToToken(uint256 _etherValue)
    public view onlyPrimary
    returns (uint256 _result) {
        _result = _etherValue.mul(getExchangeRate()).div(uint256(10 ** 18));
    }
}