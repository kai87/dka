import React from "react";
import {Button, Table} from "react-bootstrap";
import {withRouter} from 'react-router-dom';
import {multihash2hash} from "../utils/ipfsUtils";
import PaperContract from "../contracts/Paper";
import {timeConverter} from "../utils/truffleUtils";

class DisplayPapersComponent extends React.Component {
    state = {
        dataKey: null
    };

    componentDidMount() {
        const {drizzle, byteConferenceName} = this.props;
        const contract = drizzle.contracts.Administration;
        const dataKey = contract.methods["displayAllPapers"].cacheCall(byteConferenceName);
        this.setState({dataKey});
    }

    // getOnePaper
    render() {
        const {Administration} = this.props.drizzleState.contracts;
        const papers = Administration.displayAllPapers[this.state.dataKey];
        console.log(papers);
        let tableContent = [];
        if (papers && papers.value) {
            for (let i = 0; i < papers.value[0].length; i++) {
                const paperAddress = papers.value[5][i];
                const ipfsHash = multihash2hash(papers.value[2][i], papers.value[3][i], papers.value[4][i]);
                const ipfsUrl = "https://ipfs.io/ipfs/" + ipfsHash;
                const detailUrl = `/viewPaperDetail/${paperAddress}/${i}`;
                tableContent.push(
                    <tr key={i}>
                        <td>{this.props.drizzle.web3.utils.toAscii(papers.value[0][i])}</td>
                        <td>{timeConverter(parseInt(papers.value[1][i]))}</td>
                        <td><Button bsSize="xsmall" href={ipfsUrl}>Download</Button></td>
                        <td>
                            <Button bsSize="xsmall" href="#" onClick={
                                () => {
                                    console.log('Registering paper', paperAddress);
                                    this.props.drizzle.addContract(
                                        {
                                            contractName: paperAddress,
                                            web3Contract: new this.props.drizzle.web3.eth.Contract(
                                                PaperContract.abi,
                                                paperAddress
                                            )
                                        },
                                        []
                                    );

                                    this.props.history.push({
                                        pathname: detailUrl
                                    });
                                }
                            }>
                                Show
                            </Button>
                        </td>
                    </tr>
                );
            }
        }

        return (
            <Table>
                <thead>
                <tr>
                    <td>Title</td>
                    <td>Time</td>
                    <td>IPFS Link</td>
                    <td>Details</td>
                </tr>
                </thead>
                <tbody>
                {tableContent}
                </tbody>
            </Table>
        );
    }
}

export default withRouter(DisplayPapersComponent);