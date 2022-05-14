import React from "react";
import {Table} from "react-bootstrap";

class DisplayAllTokenComponent extends React.Component {
    state = {dataKey: null}

    componentDidMount() {
        const {drizzle, drizzleState} = this.props;
        console.log(drizzle);
        console.log(drizzleState);

        const contract = drizzle.contracts.Administration;

        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["displayAllTokens"].cacheCall();

        // save the `dataKey` to local component state for later reference
        this.setState({dataKey});
    }

    render() {
        const {Administration} = this.props.drizzleState.contracts;
        const coins = Administration.displayAllTokens[this.state.dataKey];
        let tableContent = [];


        if (coins && coins.value) {
            for (let i = 0; i < coins.value[0].length; i++) {
                tableContent.push(
                    <tr key={coins.value[0][i]}>
                        <td>{this.props.drizzle.web3.utils.toAscii(coins.value[0][i])}</td>
                        <td>{coins.value[1][i]}</td>
                        <td>{this.props.drizzle.web3.utils.fromWei(coins.value[2][i])}</td>
                    </tr>
                );
            }
        }

        return (
            <Table>
                <thead>
                <tr>
                    <th>Coin Name</th>
                    <th>ERC20 Contract Address</th>
                    <th>Total Supply</th>
                </tr>
                </thead>
                <tbody>
                {tableContent}
                </tbody>
            </Table>
        );
    }
}

export default DisplayAllTokenComponent;