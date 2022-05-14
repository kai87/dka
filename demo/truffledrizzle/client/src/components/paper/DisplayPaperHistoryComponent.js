import React from "react";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {timeConverter} from "../../utils/truffleUtils";
import {multihash2hash} from "../../utils/ipfsUtils";

class DisplayPaperHistoryComponent extends React.Component {
    state = {
        paperContentHistoryKey: null,
    };

    componentDidMount() {
        const {drizzle, paperAddress} = this.props;
        console.log('prop', this.props);
        const paperContract = drizzle.contracts[paperAddress];
        const paperContentHistoryKey = paperContract.methods["displayPaperContentHistory"].cacheCall();
        this.setState({paperContentHistoryKey});
    }

    render() {
        const {drizzle, drizzleState, paperAddress} = this.props;
        const paperContract = drizzleState.contracts[paperAddress];
        const paperContentHistory = paperContract.displayPaperContentHistory[this.state.paperContentHistoryKey];

        const history = [];
        if (paperContentHistory) {
            for (let i = paperContentHistory.value[0].length - 1; i >= 0; i--) {
                const date = timeConverter(parseInt(paperContentHistory.value[4][i]));
                const ipfsHash = multihash2hash(
                    paperContentHistory.value[1][i],
                    paperContentHistory.value[2][i],
                    paperContentHistory.value[3][i]
                );
                const ipfsUrl = "https://ipfs.io/ipfs/" + ipfsHash;
                const articleName = drizzle.web3.utils.toAscii(paperContentHistory.value[0][i]);

                history.push(
                    <ListGroupItem header={date} href={ipfsUrl}>{articleName}</ListGroupItem>
                )
            }
        }

        return (
            <ListGroup>
                {history}
            </ListGroup>
        )
    }
}

export default DisplayPaperHistoryComponent;