import React from "react";
import {Button, ControlLabel, FormControl, FormGroup, Jumbotron} from "react-bootstrap";
import {getTxStatus} from "../../utils/truffleUtils";

class ApproveTokenToContract extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            stackId: null,
            dataKey: null,
            tokenAmount: '',
        };
    }

    componentDidMount() {
        const {drizzle, drizzleState, tokenAddress, conferenceAddress} = this.props;
        console.log(drizzle);
        const contract = drizzle.contracts[tokenAddress];
        const dataKey = contract.methods["allowance"].cacheCall(drizzleState.accounts[0], conferenceAddress);
        this.setState({dataKey});
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleClick = async (e) => {
        e.preventDefault();
        const {drizzle, drizzleState, tokenAddress, conferenceAddress} = this.props;
        const contract = drizzle.contracts[tokenAddress];
        const stackId = contract.methods['approve'].cacheSend(
            conferenceAddress,
            drizzle.web3.utils.toWei(this.state.tokenAmount, "ether"),
            {
                from: drizzleState.accounts[0]
            }
        );
        this.setState({stackId});
    };

    render() {
        const {drizzle, drizzleState, tokenAddress} = this.props;
        const conferenceToken = drizzleState.contracts[tokenAddress];
        const tokenBalance = conferenceToken.allowance[this.state.dataKey];
        const tokenBalanceToDisplay = tokenBalance ?
            drizzle.web3.utils.fromWei(tokenBalance.value.toString(), 'ether') : 0;

        return (
            <Jumbotron>
                <p>{tokenBalanceToDisplay} Tokens were approved to be used by smart contract</p>
                <form>
                    <FormGroup controlId="formBasicText">
                        <ControlLabel>Enter amount of ERC20 tokens</ControlLabel>
                        <FormControl
                            type="text"
                            name="tokenAmount"
                            value={this.state.tokenAmount}
                            placeholder="Enter here"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Button
                        type="submit"
                        onClick={this.handleClick}
                    >
                        Approve Token
                    </Button>
                    <p>{getTxStatus(drizzleState, this.state.stackId)}</p>
                </form>
            </Jumbotron>
        )
    }
}

export default ApproveTokenToContract;