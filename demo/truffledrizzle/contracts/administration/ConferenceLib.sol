pragma solidity >=0.4.21 <0.6.0;

import "../conference/Conference.sol";

library ConferenceLib {
    struct ConferenceStruct {
        uint index;
        Conference conference;
    }

    struct Data {
        mapping(bytes32 => ConferenceStruct) conferenceMap;
        bytes32[] conferenceArray;
    }

    function add(
        Data storage _self,
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
        require(!contains(_self, _conferenceName), 'Conference already exists');
        Conference _conference = new Conference(
            _conferenceName,
            _ownerAddress,
            _conferenceToken,
            _exchangeRate,
            _paperFee,
            _constructiveReviewFee,
            _criticalReviewReward
        );
        _self.conferenceMap[_conferenceName].index = _self.conferenceArray.push(_conferenceName) - 1;
        _self.conferenceMap[_conferenceName].conference = _conference;
    }

    function remove(
        Data storage _self,
        bytes32 _conferenceName
    )
    public
    {
        require(contains(_self, _conferenceName), 'Conference does not exist');
        uint _index = _self.conferenceMap[_conferenceName].index;
        bytes32 _conferenceToMove = _self.conferenceArray[_self.conferenceArray.length - 1];
        _self.conferenceArray[_index] = _conferenceToMove;
        _self.conferenceMap[_conferenceToMove].index = _index;
        _self.conferenceArray.length--;
    }

    function contains(
        Data storage _self,
        bytes32 _conferenceName
    )
    public
    view
    returns (
        bool _result
    )
    {
        if (_self.conferenceArray.length == 0) return false;
        _result = _self.conferenceArray[_self.conferenceMap[_conferenceName].index] == _conferenceName;
    }

    function get(
        Data storage _self,
        bytes32 _conferenceName
    )
    public
    view
    returns (
        Conference _conference
    )
    {
        require(contains(_self, _conferenceName), "Conference does not exist");
        _conference = _self.conferenceMap[_conferenceName].conference;
    }

    function getAll(
        Data storage _self
    )
    public
    view
    returns (
        bytes32[] memory _conferenceArray
    ) {
        _conferenceArray = _self.conferenceArray;
    }
}