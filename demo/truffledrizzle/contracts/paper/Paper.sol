pragma solidity ^0.5.0;

import "../ownership/Secondary.sol";
import "../math/SafeMath.sol";
import "../conference/Conference.sol";
import "./PaperContent.sol";
import "./PaperReviews.sol";

contract Paper is PaperContent, PaperReviews, Secondary {
    using SafeMath for uint256;

    enum State {Submitted, Pending, Rejected, Accepted}

    address private correspondingAuthor;
    State private state;
    Conference private conference;
    uint private index;

    constructor(Conference _conference, address _correspondingAuthor) public {
        conference = _conference;
        correspondingAuthor = _correspondingAuthor;
        state = State.Submitted;
    }

    modifier onlyConferenceContract(){
        require(
            msg.sender == address(conference),
            "Only conference contract can call"
        );
        _;
    }

    modifier onlyConferenceOwner() {
        require(
            msg.sender == conference.getOwnerAddress(),
            "Only conference owner can access this method"
        );
        _;
    }

    modifier inState(State _state) {
        require(
            _state == state,
            "Invalid state"
        );
        _;
    }

    modifier hasNotSubmittedAlready() {
        require(!constructiveReview.contains(msg.sender), "Reviewer has already submitted constructive review");
        require(!criticalReview.contains(msg.sender), "Reviewer has already submitted critical review");
        _;
    }

    // External Functions
    function accept()
    external
    onlyConferenceOwner
    inState(State.Pending)
    {
        state = State.Accepted;
    }

    function reject()
    external
    onlyConferenceOwner
    inState(State.Pending)
    {
        state = State.Rejected;
    }

    function displayPaperBasic()
    external view
    returns (
        address _author,
        uint _state,
        uint256 _balance
    )
    {
        _author = correspondingAuthor;
        _state = uint(state);
        _balance = conference.getToken().balanceOf(address(this));
    }

    // Public Functions
    function setIndex(
        uint _index
    )
    public
    onlyConferenceContract
    {
        index = _index;
    }

    ///@dev this method can be called by end user to update article, or by conference at creation time
    function insertPaperContent(
        bytes32 _title,
        bytes32 _digest,
        uint8 _hashFunction,
        uint8 _size
    )
    public
    inState(State.Submitted)
    {
        require(msg.sender == correspondingAuthor || msg.sender == address(conference));
        paperContentArray.push(
            PaperContentStructure(_title, block.timestamp, _digest, _hashFunction, _size)
        );
    }

    function insertConstructiveReview(
        bytes32 _digest,
        uint8 _hashFunction,
        uint8 _size
    )
    public
    inState(State.Submitted)
    hasNotSubmittedAlready
    {
        conference.payConstructiveReviewFee(index, msg.sender);
        constructiveReview.insert(msg.sender, _digest, _hashFunction, _size);
    }

    function insertCriticalReview(
        bytes32 _digest,
        uint8 _hashFunction,
        uint8 _size
    )
    public
    inState(State.Submitted)
    hasNotSubmittedAlready
    {
        criticalReview.insert(msg.sender, _digest, _hashFunction, _size);
    }

    function distributeTokens()
    public
    inState(State.Submitted)
    onlyConferenceContract
    {
        state = State.Pending;
        uint256 _reward = conference.getCriticalReviewReward();
        uint256 _numberOfCriticalReviewers = criticalReview.addressArray.length;
        if (conference.getToken().balanceOf(address(this)) < _reward.mul(_numberOfCriticalReviewers)) {
            _reward = conference.getToken().balanceOf(address(this)).div(_numberOfCriticalReviewers);
        }
        for (uint i = 0; i < _numberOfCriticalReviewers; i ++) {
            conference.getToken().transfer(criticalReview.addressArray[i], _reward);
        }
    }
}