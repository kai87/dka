import React from "react";
import {Button} from "react-bootstrap";

class WithdrawComponent extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            stackId: null,
        };
    }

    handleClick = e => {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.Administration;
        const stackId = contract.methods['withdrawEther'].cacheSend();
        const state = JSON.parse(JSON.stringify(this.state));
        state.stackId = stackId;
        this.setState(state);
    };

    render() {
        return (
            <Button type="submit" onClick={this.handleClick}>
                Withdraw
            </Button>
        )
    }
}

export default WithdrawComponent;