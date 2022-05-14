import React from "react";
import {Button} from "react-bootstrap";

class ConferenceManagement extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            stackId: null
        }
    }

    handleClick() {
        const {drizzle, drizzleState, conferenceAddress} = this.props;
        const contract = drizzle.contracts[conferenceAddress];
        const stackId = contract.methods['closeReview'].cacheSend({from: drizzleState.accounts[0]});
        this.setState({stackId});
    };

    render() {
        return <Button type="submit" onClick={this.handleClick}>Close reviewing process</Button>;
    }
}

export default ConferenceManagement;