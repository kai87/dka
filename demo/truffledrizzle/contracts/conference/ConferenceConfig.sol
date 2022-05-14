pragma solidity ^0.5.0;

import "./ConferenceToken.sol";

/// @dev All values are private/immutable
contract ConferenceConfig {
    bytes32 private conferenceName;
    address private ownerAddress;
    ConferenceToken private conferenceToken;
    uint256 private exchangeRate;
    uint256 private paperFee;
    uint256 private constructiveReviewFee;
    uint256 private criticalReviewReward;

    constructor(
        bytes32 _conferenceName,
        address _ownerAddress,
        ConferenceToken _conferenceToken,
        uint256 _exchangeRate,
        uint256 _paperFee,
        uint256 _constructiveReviewFee,
        uint256 _criticalReviewReward
    )
    public
    {
        conferenceName = _conferenceName;
        ownerAddress = _ownerAddress;
        conferenceToken = _conferenceToken;
        exchangeRate = _exchangeRate;
        paperFee = _paperFee;
        constructiveReviewFee = _constructiveReviewFee;
        criticalReviewReward = _criticalReviewReward;
    }

    function getConferenceName() public view returns (bytes32 _conferenceName) {
        _conferenceName = conferenceName;
    }

    function getOwnerAddress() public view returns (address _ownerAddress) {
        _ownerAddress = ownerAddress;
    }

    function getToken() public view returns (ConferenceToken _conferenceToken) {
        _conferenceToken = conferenceToken;
    }

    function getExchangeRate() public view returns (uint256 _exchangeRate){
        _exchangeRate = exchangeRate;
    }

    function getPaperFee() public view returns (uint256 _paperFee) {
        _paperFee = paperFee;
    }

    function getConstructiveReviewFee() public view returns (uint256 _constructiveReviewFee) {
        _constructiveReviewFee = constructiveReviewFee;
    }

    function getCriticalReviewReward() public view returns (uint256 _criticalReviewReward) {
        _criticalReviewReward = criticalReviewReward;
    }
}