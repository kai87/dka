import React from "react";
import {Button, ControlLabel, FormControl, FormGroup, Jumbotron} from "react-bootstrap";
import {getTxStatus} from "../../utils/truffleUtils";

class PurchaseTokenComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            stackId: null,
            etherAmount: '',
        };
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleClick = async (e) => {
        e.preventDefault();
        const {drizzle, drizzleState, byteConferenceName} = this.props;
        const contract = drizzle.contracts.Administration;
        const stackId = contract.methods['purchaseToken'].cacheSend(
            byteConferenceName,
            {
                from: drizzleState.accounts[0],
                value: drizzle.web3.utils.toWei(this.state.etherAmount, "ether")
            }
        );
        this.setState({stackId});
    };

    render() {
        const {drizzleState} = this.props;
        return (
            <Jumbotron>
                <form>
                    <FormGroup controlId="formBasicText">
                        <ControlLabel>Enter amount of Ethereum tokens</ControlLabel>
                        <FormControl
                            type="text"
                            name="etherAmount"
                            value={this.state.etherAmount}
                            placeholder="Enter here"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Button
                        type="submit"
                        onClick={this.handleClick}
                    >
                        Purchase Token
                    </Button>
                    <p>{getTxStatus(drizzleState, this.state.stackId)}</p>
                </form>
            </Jumbotron>
        )
    }
}

export default PurchaseTokenComponent;