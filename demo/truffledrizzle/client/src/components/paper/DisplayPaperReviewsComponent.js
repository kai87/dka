import React from "react";
import {timeConverter} from "../../utils/truffleUtils";
import {multihash2hash} from "../../utils/ipfsUtils";
import {ListGroup, ListGroupItem} from "react-bootstrap";

class DisplayPaperReviewsComponent extends React.Component {
    state = {
        constructiveReviewKey: null,
        criticalReviewKey: null,
    };

    componentDidMount() {
        const {drizzle, paperAddress} = this.props;
        const paperContract = drizzle.contracts[paperAddress];
        const constructiveReviewKey = paperContract.methods["displayConstructiveReviews"].cacheCall();
        const criticalReviewKey = paperContract.methods["displayCriticalReviews"].cacheCall();
        this.setState({constructiveReviewKey, criticalReviewKey});
    }

    render() {
        const {drizzleState, paperAddress} = this.props;
        const paperContract = drizzleState.contracts[paperAddress];

        const constructiveReview = paperContract.displayConstructiveReviews[this.state.constructiveReviewKey];
        const criticalReview = paperContract.displayCriticalReviews[this.state.criticalReviewKey];

        const constructiveReviewListGroup = [];
        if (constructiveReview) {
            for (let i = 0; i < constructiveReview.value[0].length; i++) {
                const date = timeConverter(parseInt(constructiveReview.value[1][i]));
                const ipfsHash = multihash2hash(
                    constructiveReview.value[2][i],
                    constructiveReview.value[3][i],
                    constructiveReview.value[4][i]
                );
                const ipfsUrl = "https://ipfs.io/ipfs/" + ipfsHash;
                const reviewerAddress = constructiveReview.value[0][i];
                constructiveReviewListGroup.push(<ListGroupItem bsStyle="success">Constructive Review</ListGroupItem>)
                constructiveReviewListGroup.push(
                    <ListGroupItem header={date} href={ipfsUrl}>Review {i + 1}, by {reviewerAddress}</ListGroupItem>
                )
            }
        }

        const criticalReviewListGroup = [];
        if (criticalReview) {
            for (let i = 0; i < criticalReview.value[0].length; i++) {
                const date = timeConverter(parseInt(criticalReview.value[1][i]));
                const ipfsHash = multihash2hash(
                    criticalReview.value[2][i],
                    criticalReview.value[3][i],
                    criticalReview.value[4][i]
                );
                const ipfsUrl = "https://ipfs.io/ipfs/" + ipfsHash;
                const reviewerAddress = criticalReview.value[0][i];
                criticalReviewListGroup.push(<ListGroupItem bsStyle="warning">Critical Review</ListGroupItem>)
                criticalReviewListGroup.push(
                    <ListGroupItem header={date} href={ipfsUrl}>Review {i + 1}, by {reviewerAddress}</ListGroupItem>
                )
            }
        }

        return (
            <div>
                <ListGroup>
                    {constructiveReviewListGroup}
                </ListGroup>

                <ListGroup>
                    {criticalReviewListGroup}
                </ListGroup>
            </div>
        );
    }
}

export default DisplayPaperReviewsComponent;