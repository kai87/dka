import React from "react";
import {Button} from "react-bootstrap";

class RejectProposalComponent extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            stackId: null,
        };
    }

    handleClick = e => {
        const {drizzle, drizzleState, conferenceName} = this.props;
        const contract = drizzle.contracts.Administration;
        const stackId = contract.methods['rejectProposal'].cacheSend(
            conferenceName,
            {from: drizzleState.accounts[0]}
        );
        const state = JSON.parse(JSON.stringify(this.state));
        state.stackId = stackId;
        this.setState(state);
    };

    render() {
        return (
            <Button type="submit" bsSize="xsmall" bsStyle="danger" onClick={this.handleClick}>
                Reject
            </Button>
        )
    }
}

export default RejectProposalComponent;