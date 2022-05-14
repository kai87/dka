import React from "react";
import {Table} from "react-bootstrap";
import DisplayProposalDetailComponent from "./DisplayProposalDetailComponent";

class DisplayProposalComponent extends React.Component {
    state = {dataKey: null};

    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.Administration;
        const dataKey = contract.methods["getAllProposals"].cacheCall();
        this.setState({dataKey});
    }

    render() {
        const {Administration} = this.props.drizzleState.contracts;
        const proposals = Administration.getAllProposals[this.state.dataKey];
        const items = [];
        if (proposals && proposals.value) {
            proposals.value.forEach(
                e => {
                    items.push(
                        <DisplayProposalDetailComponent
                            key={e}
                            conferenceName={e}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    );
                }
            );
        }
        return (
            <Table responsive>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Block time</th>
                    <th>Sender</th>
                    <th>Token</th>
                    <th>Exchange Rate</th>
                    <th>Paper fee</th>
                    <th>Constructive review fee</th>
                    <th>Critical review reward</th>
                    <th>Ether received</th>
                    <th>Accept?</th>
                    <th>Reject?</th>
                </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </Table>
        );
    }
}

export default DisplayProposalComponent;