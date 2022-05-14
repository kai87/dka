pragma solidity >=0.4.21 <0.6.0;

import "../ownership/Ownable.sol";
import "./EthereumLedger.sol";
import "./ConferenceLib.sol";
import "./ProposalLib.sol";
import "./TokenLib.sol";
import "../conference/Conference.sol";


/// @dev This contract is the main entry point for any business action that might cause side effects
contract Administration is Ownable, EthereumLedger {
    using SafeMath for uint256;
    using TokenLib for TokenLib.Data;
    using ProposalLib for ProposalLib.Data;
    using ConferenceLib for ConferenceLib.Data;

    TokenLib.Data tokens;
    ProposalLib.Data proposals;
    ConferenceLib.Data conferences;

    // External and anyone can call
    function proposeConference(
        bytes32 _conferenceName,
        bytes32 _tokenSymbol,
        uint256 _exchangeRate,
        uint256 _paperFee,
        uint256 _constructiveReviewFee,
        uint256 _criticalReviewReward
    )
    external
    payable
    {
        require(!conferences.contains(_conferenceName), 'Can not propose a conference that already exists');
        frozenAmount = frozenAmount.add(msg.value);
        proposals.add(
            _conferenceName,
            _tokenSymbol,
            _exchangeRate,
            _paperFee,
            _constructiveReviewFee,
            _criticalReviewReward,
            msg.value
        );
    }

    // External and only owner can call
    function approveProposal(
        bytes32 _conferenceName
    )
    external
    onlyOwner
    {
        (
        ,
        address _senderAddress,
        bytes32 _tokenSymbol,
        uint256 _exchangeRate,
        uint256 _paperFee,
        uint256 _constructiveReviewFee,
        uint256 _criticalReviewReward,
        uint256 _amount
        ) = proposals.get(_conferenceName);
        if (!tokens.contains(_tokenSymbol)) {
            tokens.add(_tokenSymbol);
        }
        conferences.add(
            _conferenceName,
            _senderAddress,
            tokens.get(_tokenSymbol),
            _exchangeRate,
            _paperFee,
            _constructiveReviewFee,
            _criticalReviewReward
        );
        proposals.remove(_conferenceName);
        frozenAmount = frozenAmount.sub(_amount);
        ethereumLedger[owner()] = ethereumLedger[owner()].add(_amount);
    }

    function rejectProposal(
        bytes32 _conferenceName
    )
    external
    onlyOwner
    {
        address _proposalCreator = proposals.proposalMap[_conferenceName].senderAddress;
        uint256 _amount = proposals.proposalMap[_conferenceName].ethereumReceived;
        frozenAmount = frozenAmount.sub(_amount);
        ethereumLedger[_proposalCreator] = ethereumLedger[_proposalCreator].add(_amount);
        proposals.remove(_conferenceName);
    }

    function purchaseToken(bytes32 _conferenceName)
    external
    payable
    {
        Conference _conference = conferences.get(_conferenceName);
        address _ownerAddress = _conference.getOwnerAddress();
        uint256 _amount = _conference.convertEtherToToken(msg.value);
        _conference.getToken().mint(msg.sender, _amount);
        ethereumLedger[_ownerAddress] = ethereumLedger[_ownerAddress].add(msg.value);
    }

    // External Views
    function displayAllTokens()
    external
    view
    returns (
        bytes32[] memory _tokens,
        address[] memory _addresses,
        uint256[] memory _totalSupplies
    )
    {
        _tokens = tokens.getAll();
        _addresses = new address[](_tokens.length);
        _totalSupplies = new uint256[](_tokens.length);
        for (uint i = 0; i < _tokens.length; i++) {
            _addresses[i] = address(tokens.get(_tokens[i]));
            _totalSupplies[i] = tokens.get(_tokens[i]).totalSupply();
        }
    }

    function getAllProposals()
    external
    view
    returns (
        bytes32[] memory _result
    ) {
        _result = proposals.getAll();
    }

    function getOneProposal(bytes32 _conferenceName)
    external
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
        (
        _blockTimestamp,
        _senderAddress,
        _tokenSymbol,
        _exchangeRate,
        _paperFee,
        _constructiveReviewFee,
        _criticalReviewReward,
        _amount
        ) = proposals.get(_conferenceName);
    }

    function displayConferencesWithContractAddressDetails()
    external
    view
    returns (
        bytes32[] memory _conferenceNames,
        address[] memory _conferenceContractAddresses,
        address[] memory _tokenContractAddresses
    )
    {
        _conferenceNames = conferences.conferenceArray;
        _conferenceContractAddresses = new address[](_conferenceNames.length);
        _tokenContractAddresses = new address[](_conferenceNames.length);
        for (uint i = 0; i < _conferenceNames.length; i++) {
            _conferenceContractAddresses[i] = address(conferences.get(_conferenceNames[i]));
            _tokenContractAddresses[i] = address(conferences.get(_conferenceNames[i]).getToken());
        }
    }

    function displayAllPapers(bytes32 _conferenceName)
    external
    view
    returns (
        bytes32[] memory _titles,
        uint[] memory _blockTimestamps,
        bytes32[] memory _digests,
        uint8[] memory _hashFunction,
        uint8[] memory _size,
        address[] memory _address
    )
    {
        _titles = new bytes32[](conferences.get(_conferenceName).getTotalNumberOfPapers());
        _blockTimestamps = new uint[](conferences.get(_conferenceName).getTotalNumberOfPapers());
        _digests = new bytes32[](conferences.get(_conferenceName).getTotalNumberOfPapers());
        _hashFunction = new uint8[](conferences.get(_conferenceName).getTotalNumberOfPapers());
        _size = new uint8[](conferences.get(_conferenceName).getTotalNumberOfPapers());
        _address = new address[](conferences.get(_conferenceName).getTotalNumberOfPapers());
        for (uint i = 0; i < conferences.get(_conferenceName).getTotalNumberOfPapers(); i++) {
            (
            _titles[i],
            _digests[i],
            _hashFunction[i],
            _size[i],
            _blockTimestamps[i]
            ) = conferences.get(_conferenceName).getPaper(i).displayLatestPaperContent();
            _address[i] = address(conferences.get(_conferenceName).getPaper(i));
        }
    }


}