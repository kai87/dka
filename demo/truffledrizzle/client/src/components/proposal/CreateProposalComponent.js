import React from "react";
import {Button, ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import {getTxStatus} from "../../utils/truffleUtils";


class CreateProposalComponent extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            stackId: null,
            name: '',
            symbol: '',
            exchangeRate: '',
            paperFee: '',
            constructiveReviewFee: '',
            criticalReviewReward: '',
            ether: '10',
        };
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleClick = e => {
        e.preventDefault();
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.Administration;
        const stackId = contract.methods['proposeConference'].cacheSend(
            drizzle.web3.utils.fromAscii(this.state.name),
            drizzle.web3.utils.fromAscii(this.state.symbol),
            drizzle.web3.utils.toWei(this.state.exchangeRate, 'ether'),
            drizzle.web3.utils.toWei(this.state.paperFee, 'ether'),
            drizzle.web3.utils.toWei(this.state.constructiveReviewFee, 'ether'),
            drizzle.web3.utils.toWei(this.state.criticalReviewReward, 'ether'),
            {
                from: drizzleState.accounts[0],
                value: drizzle.web3.utils.toWei(this.state.ether, "ether")
            }
        );
        this.setState({stackId});
    };

    render() {
        return (
            <form>
                <FormGroup controlId="formBasicText">
                    <ControlLabel>Conference Name</ControlLabel>
                    <FormControl type="text" name="name" value={this.state.name}
                                 placeholder="Enter here" onChange={this.handleChange}/>
                </FormGroup>

                <FormGroup controlId="formBasicText">
                    <ControlLabel>Token symbol</ControlLabel>
                    <FormControl type="text" name="symbol" value={this.state.symbol}
                                 placeholder="Enter here" onChange={this.handleChange}/>
                </FormGroup>

                <FormGroup controlId="formBasicText">
                    <ControlLabel>Exchange rate</ControlLabel>
                    <FormControl type="text" name="exchangeRate" value={this.state.exchangeRate}
                                 placeholder="Enter here" onChange={this.handleChange}/>
                </FormGroup>

                <FormGroup controlId="formBasicText">
                    <ControlLabel>Paper fee</ControlLabel>
                    <FormControl type="text" name="paperFee" value={this.state.paperFee}
                                 placeholder="Enter here" onChange={this.handleChange}/>
                </FormGroup>

                <FormGroup controlId="formBasicText">
                    <ControlLabel>Constructive review fee</ControlLabel>
                    <FormControl type="text" name="constructiveReviewFee" value={this.state.constructiveReviewFee}
                                 placeholder="Enter here" onChange={this.handleChange}/>
                </FormGroup>

                <FormGroup controlId="formBasicText">
                    <ControlLabel>Critical review fee</ControlLabel>
                    <FormControl type="text" name="criticalReviewReward" value={this.state.criticalReviewReward}
                                 placeholder="Enter here" onChange={this.handleChange}/>
                </FormGroup>

                <FormGroup controlId="formBasicText">
                    <ControlLabel>Ether to send</ControlLabel>
                    <FormControl type="text" name="ether" value={this.state.ether}
                                 placeholder="Enter here" onChange={this.handleChange}/>
                </FormGroup>

                <Button type="submit" onClick={this.handleClick}>
                    Propose Conference
                </Button>
                <div>{getTxStatus(this.props.drizzleState, this.state.stackId)}</div>
            </form>
        );
    }
}

export default CreateProposalComponent;