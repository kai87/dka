pragma solidity >=0.4.21 <0.6.0;

library ProposalLib {
    struct ProposalStruct {
        uint index;
        uint blockTimestamp;
        address senderAddress;
        bytes32 tokenSymbol;
        uint256 exchangeRate;
        uint256 paperFee;
        uint256 constructiveReviewFee;
        uint256 criticalReviewReward;
        uint256 ethereumReceived;
    }

    struct Data {
        mapping(bytes32 => ProposalStruct) proposalMap;
        bytes32[] proposalArray;
    }


    function add(
        Data storage _self,
        bytes32 _conferenceName,
        bytes32 _tokenSymbol,
        uint256 _exchangeRate,
        uint256 _paperFee,
        uint256 _constructiveReviewFee,
        uint256 _criticalReviewReward,
        uint256 _amount
    )
    public
    {
        require(!contains(_self, _conferenceName), 'Proposal already exists');
        _self.proposalMap[_conferenceName].index = _self.proposalArray.push(_conferenceName) - 1;
        _self.proposalMap[_conferenceName].blockTimestamp = block.timestamp;
        _self.proposalMap[_conferenceName].senderAddress = msg.sender;
        _self.proposalMap[_conferenceName].tokenSymbol = _tokenSymbol;
        _self.proposalMap[_conferenceName].exchangeRate = _exchangeRate;
        _self.proposalMap[_conferenceName].paperFee = _paperFee;
        _self.proposalMap[_conferenceName].constructiveReviewFee = _constructiveReviewFee;
        _self.proposalMap[_conferenceName].criticalReviewReward = _criticalReviewReward;
        _self.proposalMap[_conferenceName].ethereumReceived = _amount;
    }


    function remove(
        Data storage _self,
        bytes32 _conferenceName
    )
    public
    {
        require(contains(_self, _conferenceName), 'Proposal does not exist');
        uint _index = _self.proposalMap[_conferenceName].index;
        bytes32 _proposalToMove = _self.proposalArray[_self.proposalArray.length - 1];
        _self.proposalArray[_index] = _proposalToMove;
        _self.proposalMap[_proposalToMove].index = _index;
        _self.proposalArray.length--;
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
        if (_self.proposalArray.length == 0) return false;
        _result = (_self.proposalArray[_self.proposalMap[_conferenceName].index] == _conferenceName);
    }


    function get(
        Data storage _self,
        bytes32 _conferenceName
    )
    public
    view
    returns (
        uint _blockTimestamp,
        address _senderAddress,
        bytes32 _tokenSymbol,
        uint256 _exchangeRate,
        uint256 _paperFee,
        uint256 _constructiveReviewFee,
        uint256 _criticalReviewReward,
        uint256 _amount
    )
    {
        require(contains(_self, _conferenceName), 'Proposal does not exist');
        _blockTimestamp = _self.proposalMap[_conferenceName].blockTimestamp;
        _senderAddress = _self.proposalMap[_conferenceName].senderAddress;
        _tokenSymbol = _self.proposalMap[_conferenceName].tokenSymbol;
        _exchangeRate = _self.proposalMap[_conferenceName].exchangeRate;
        _paperFee = _self.proposalMap[_conferenceName].paperFee;
        _constructiveReviewFee = _self.proposalMap[_conferenceName].constructiveReviewFee;
        _criticalReviewReward = _self.proposalMap[_conferenceName].criticalReviewReward;
        _amount = _self.proposalMap[_conferenceName].ethereumReceived;
    }

    function getAll(
        Data storage self
    )
    public
    view
    returns (
        bytes32[] memory _result
    )
    {
        _result = self.proposalArray;
    }
}