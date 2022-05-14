import React from "react";
import {Button, ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import ipfs from '../ipfs'
import {hash2multihash} from "../utils/ipfsUtils";

class CreatePaperComponent extends React.Component {
    state = {
        dataKey: null,
        title: '',
        buffer: null,
        ipfsHash: '',
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.captureFile = this.captureFile.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    captureFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({buffer: Buffer(reader.result)});
            console.log('buffer', this.state.buffer);
        }
    };

    handleClick = async () => {
        const {drizzle, drizzleState, conferenceAddress} = this.props;
        const ipfsResponse = await ipfs.add(this.state.buffer);
        if (ipfsResponse && ipfsResponse[0] && ipfsResponse[0].hash) {
            const {digest, hashFunction, size} = hash2multihash(ipfsResponse[0].hash);
            const contract = drizzle.contracts[conferenceAddress];
            const stackId = contract.methods["insertPaper"].cacheSend(
                drizzle.web3.utils.fromAscii(this.state.title),
                digest,
                hashFunction,
                size,
                {
                    from: drizzleState.accounts[0]
                }
            );
            console.log('stackid', stackId);
            this.setState({stackId});
        }
    };

    getTxStatus = () => {
        const {transactions, transactionStack} = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackId];
        if (!txHash) return null;
        console.log(transactions[txHash]);
        return `Transaction status: ${transactions[txHash] && transactions[txHash].status}, with Hash ${this.state.ipfsHash}`;
    };

    render() {
        return (
            this.props.byteConferenceName ? (
            <div>
                <FormGroup controlId="formBasicText">
                    <ControlLabel>Paper Title</ControlLabel>
                    <FormControl type="text" name="title" value={this.state.title}
                                 placeholder="Enter here" onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Select Paper</ControlLabel>
                    <FormControl type="file" name="file" onChange={this.captureFile}/>
                </FormGroup>
                <Button type="submit" onClick={this.handleClick}>
                    Submit paper
                </Button>
                <div>{this.getTxStatus()}</div>
            </div>
            ) : null
        );
    }
}

export default CreatePaperComponent;