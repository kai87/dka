import React from "react";
import {Button, ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import ipfs from "../../ipfs";
import {hash2multihash} from "../../utils/ipfsUtils";

class CreateReviewComponent extends React.Component {
    state = {
        stackId: null,
        buffer: null,
        ipfsHash: '',
    };

    constructor(props) {
        super(props);
        this.captureFile = this.captureFile.bind(this);
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

    handleConstructiveReview = async () => {
        const {drizzle, drizzleState, paperAddress} = this.props;
        const ipfsResponse = await ipfs.add(this.state.buffer);
        if (ipfsResponse && ipfsResponse[0] && ipfsResponse[0].hash) {
            const {digest, hashFunction, size} = hash2multihash(ipfsResponse[0].hash);
            const contract = drizzle.contracts[paperAddress];
            const stackId = contract.methods["insertConstructiveReview"].cacheSend(
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

    handleCriticalReview = async () => {
        const {drizzle, drizzleState, paperAddress} = this.props;
        const ipfsResponse = await ipfs.add(this.state.buffer);
        if (ipfsResponse && ipfsResponse[0] && ipfsResponse[0].hash) {
            const {digest, hashFunction, size} = hash2multihash(ipfsResponse[0].hash);
            const contract = drizzle.contracts[paperAddress];
            const stackId = contract.methods["insertCriticalReview"].cacheSend(
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


    render() {
        return (
            <div>
                <FormGroup>
                    <ControlLabel>Select file</ControlLabel>
                    <FormControl type="file" name="file" onChange={this.captureFile}/>
                </FormGroup>
                <Button type="submit" onClick={this.handleConstructiveReview}>Constructive Review</Button>
                <Button type="submit" onClick={this.handleCriticalReview}>Critical Review</Button>
            </div>
        );
    }
}

export default CreateReviewComponent;