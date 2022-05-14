import React from "react";
import {Button} from "react-bootstrap";

class MakeDecisionComponent extends React.Component {

    state = {
        stackId: null,
    };

    handleAccept = (event) => {
        const {drizzle, drizzleState, paperAddress} = this.props;
        const contract = drizzle.contracts[paperAddress];
        const stackId = contract.methods["accept"].cacheSend({from: drizzleState.accounts[0]});
        this.setState({stackId});
    };

    handleReject = (event) => {
        const {drizzle, drizzleState, paperAddress} = this.props;
        const contract = drizzle.contracts[paperAddress];
        const stackId = contract.methods["reject"].cacheSend({from: drizzleState.accounts[0]});
        this.setState({stackId});
    };

    render() {
        return (
            <div>
                <Button type="submit" onClick={this.handleAccept}>Accept</Button>
                <Button type="submit" onClick={this.handleReject}>Reject</Button>
            </div>
        );
    }
}

export default MakeDecisionComponent;