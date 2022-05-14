pragma solidity ^0.5.0;

import "./PaperCommentLib.sol";

contract PaperReviews {
    using PaperCommentLib for PaperCommentLib.Data;

    PaperCommentLib.Data internal constructiveReview;
    PaperCommentLib.Data internal criticalReview;

    // External Functions
    function displayConstructiveReviews()
    external view
    returns (
        address[] memory,
        uint[] memory,
        bytes32[] memory,
        uint8[] memory,
        uint8[] memory
    ) {
        return constructiveReview.getAllReviews();
    }

    function displayCriticalReviews()
    external view
    returns (
        address[] memory,
        uint[] memory,
        bytes32[] memory,
        uint8[] memory,
        uint8[] memory
    ) {
        return criticalReview.getAllReviews();
    }
}