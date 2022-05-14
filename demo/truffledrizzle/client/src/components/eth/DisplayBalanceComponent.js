import React from "react";
import {Jumbotron} from "react-bootstrap";

class DisplayBalanceComponent extends React.Component {
    state = {dataKey: null};

    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.Administration;
        const dataKey = contract.methods["getBalance"].cacheCall();
        this.setState({dataKey});
    }

    render() {
        const {Administration} = this.props.drizzleState.contracts;
        const balance = Administration.getBalance[this.state.dataKey];
        return (
            <Jumbotron>
                <h1>You
                    own {balance && this.props.drizzle.web3.utils.fromWei(balance.value.toString(), 'ether')} Ether</h1>
                <p>
                    Gas will be charged for withdraw on the client side.
                </p>
            </Jumbotron>
        )
    }
}

export default DisplayBalanceComponent;