import React from "react";
import {Button} from "react-bootstrap";

class AcceptProposalComponent extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            stackId: null,
        };
    }

    handleClick = e => {
        const {drizzle, drizzleState, conferenceName} = this.props;
        const contract = drizzle.contracts.Administration;
        const stackId = contract.methods['approveProposal'].cacheSend(
            conferenceName,
            {from: drizzleState.accounts[0]}
        );
        const state = JSON.parse(JSON.stringify(this.state));
        state.stackId = stackId;
        this.setState(state);
    };

    render() {
        return (
            <Button type="submit" bsSize="xsmall" bsStyle="success" onClick={this.handleClick}>
                Accept
            </Button>
        )
    }
}

export default AcceptProposalComponent;