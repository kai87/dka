import React from "react";
import AcceptProposalComponent from "./AcceptProposalComponent";
import RejectProposalComponent from "./RejectProposalComponent";
import {getShortAddress, timeConverter} from "../../utils/truffleUtils";

class DisplayProposalDetailComponent extends React.Component {
    state = {dataKey: null};

    componentDidMount() {
        const {drizzle, drizzleState, conferenceName} = this.props;
        const contract = drizzle.contracts.Administration;
        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["getOneProposal"].cacheCall(
            conferenceName,
            {from: drizzleState.accounts[0]}
        );

        // save the `dataKey` to local component state for later reference
        this.setState({dataKey});
    }

    render() {
        const {drizzle} = this.props;
        const {Administration} = this.props.drizzleState.contracts;
        const conferenceDetails = Administration.getOneProposal[this.state.dataKey];
        if (conferenceDetails) {
            return (
                <tr key={`${this.props.conferenceName}_row`}>
                    <td key='0'>{drizzle.web3.utils.toAscii(this.props.conferenceName)}</td>
                    <td key='1'>{timeConverter(conferenceDetails.value[0])}</td>
                    <td key='2'>{getShortAddress(conferenceDetails.value[1])}</td>
                    <td key='3'>{drizzle.web3.utils.toAscii(conferenceDetails.value[2])}</td>
                    <td key='4'>{drizzle.web3.utils.fromWei(conferenceDetails.value[3], 'ether')}</td>
                    <td key='5'>{drizzle.web3.utils.fromWei(conferenceDetails.value[4], 'ether')}</td>
                    <td key='6'>{drizzle.web3.utils.fromWei(conferenceDetails.value[5], 'ether')}</td>
                    <td key='7'>{drizzle.web3.utils.fromWei(conferenceDetails.value[6], 'ether')}</td>
                    <td key='8'>{drizzle.web3.utils.fromWei(conferenceDetails.value[7], 'ether')}</td>
                    <td key='9'>
                        <AcceptProposalComponent
                            conferenceName={this.props.conferenceName}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    </td>
                    <td key='10'>
                        <RejectProposalComponent
                            conferenceName={this.props.conferenceName}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    </td>
                </tr>
            );
        } else {
            return <tr></tr>;
        }
    }
}

export default DisplayProposalDetailComponent;