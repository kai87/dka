import {
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    Grid,
    MenuItem,
    Nav,
    Navbar,
    NavDropdown,
    NavItem,
    Row
} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import AboutComponent from "./AboutComponent";
import DisplayAllTokenComponent from "./erc20/DisplayAllTokenComponent";
import DisplayProposalComponent from "./proposal/DisplayProposalComponent";
import DisplayBalanceComponent from "./eth/DisplayBalanceComponent";
import CreateProposalComponent from "./proposal/CreateProposalComponent";
import CreatePaperComponent from "./CreatePaperComponent";
import {BrowserRouter, Route} from "react-router-dom";
import React from "react";
import WithdrawComponent from "./eth/WithdrawComponent";
import DisplayPapersComponent from "./DisplayPapersComponent";
// Load ABI
import ConferenceContract from "../contracts/Conference";
import ConferenceTokenContract from "../contracts/ConferenceToken";
import PurchaseTokenComponent from "./erc20/PurchaseTokenComponent";
import ApproveTokenToContract from "./erc20/ApproveTokenToContract";
import DisplayPaperDetailComponent from "./paper/DisplayPaperDetailComponent";
import ConferenceManagement from "./manage/ConferenceManagement";

class RouterComponent extends React.Component {

    state = {
        dataKey: null,
        display: 0,
        byteConferenceName: '',
        conferenceName: '',
        conferenceAddress: '',
        tokenAddress: '',
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const {drizzle} = this.props;
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name === "conferenceContractAddress") {
            const jsonObject = JSON.parse(value);
            const {conferenceAddress, tokenAddress, byteConferenceName, conferenceName, display} = jsonObject;
            console.log(conferenceAddress, tokenAddress, display);

            // Registering selected conference contract
            if (this.state.conferenceAddress !== conferenceAddress) {
                drizzle.addContract(
                    {
                        contractName: conferenceAddress,
                        web3Contract: new this.props.drizzle.web3.eth.Contract(
                            ConferenceContract.abi,
                            conferenceAddress
                        )
                    },
                    []
                );
            }

            // Registering selected token contract
            if (this.state.tokenAddress !== tokenAddress) {
                drizzle.addContract(
                    {
                        contractName: tokenAddress,
                        web3Contract: new this.props.drizzle.web3.eth.Contract(
                            ConferenceTokenContract.abi,
                            tokenAddress
                        )
                    },
                    []
                );
            }

            this.setState({
                byteConferenceName: byteConferenceName,
                conferenceName: conferenceName,
                display: display,
                conferenceAddress: conferenceAddress,
                tokenAddress: tokenAddress,
            })
        } else {
            this.setState({[name]: value});
        }
    }

    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.Administration;
        const dataKey = contract.methods["displayConferencesWithContractAddressDetails"].cacheCall();
        this.setState({dataKey});
    }

    render() {
        const {Administration} = this.props.drizzleState.contracts;
        const conferences = Administration.displayConferencesWithContractAddressDetails[this.state.dataKey];
        const items = [];

        if (conferences && conferences.value) {
            for (let i = 0; i < conferences.value[0].length; i++) {
                const byteConferenceName = conferences.value[0][i];
                const conferenceAddress = conferences.value[1][i];
                const tokenAddress = conferences.value[2][i];
                const conferenceName = this.props.drizzle.web3.utils.toAscii(byteConferenceName);
                const optionValues = {
                    byteConferenceName: byteConferenceName,
                    conferenceName: conferenceName,
                    conferenceAddress: conferenceAddress,
                    tokenAddress: tokenAddress,
                    display: 1,
                };
                items.push(
                    <option key={byteConferenceName} value={JSON.stringify(optionValues)}>{conferenceName}</option>
                );
            }
        }

        return (
            <BrowserRouter>
                <Navbar collapseOnSelect>
                    <Navbar.Header>
                        <Form inline>
                            <FormGroup>
                                <ControlLabel><LinkContainer to={"/"}><Navbar.Brand>Decentralised Knowledge
                                    Assessment</Navbar.Brand></LinkContainer></ControlLabel>
                                <FormControl componentClass="select" type="text" name="conferenceContractAddress"
                                             placeholder="select"
                                             onChange={this.handleChange}>
                                    <option value='{"display": 0}' key='blank'>Please select a conference</option>
                                    {items}
                                </FormControl>
                            </FormGroup>
                        </Form>

                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavDropdown title="Management" id="basic-nav-dropdown">
                                <LinkContainer to={"/proposeConference"}>
                                    <NavItem>Propose Conference</NavItem>
                                </LinkContainer>
                                <LinkContainer to={"/approveProposals"}>
                                    <MenuItem>Approve Conference</MenuItem>
                                </LinkContainer>
                                <LinkContainer to={"/displayToken"}>
                                    <MenuItem>Display Existing Tokens</MenuItem>
                                </LinkContainer>
                                <LinkContainer to={'/withdraw'}>
                                    <MenuItem>Withdraw</MenuItem>
                                </LinkContainer>
                            </NavDropdown>
                            {
                                this.state.display ? (
                                    <Nav pullRight>
                                        <NavDropdown title="Conference" id="basic-nav-dropdown">
                                            <LinkContainer to={"/purchaseToken"}>
                                                <NavItem>Purchace Token</NavItem>
                                            </LinkContainer>
                                            <LinkContainer to={"/submitPaper"}>
                                                <NavItem>Submit Paper</NavItem>
                                            </LinkContainer>
                                            <LinkContainer to={"/viewPapers"}>
                                                <NavItem>View Papers</NavItem>
                                            </LinkContainer>
                                            <LinkContainer to={"/conferenceManagement"}>
                                                <NavItem>Manage</NavItem>
                                            </LinkContainer>
                                        </NavDropdown>
                                    </Nav>
                                ) : null
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div>
                    <Grid>
                        <Row>
                            <Route path="/" exact component={AboutComponent}/>

                            {/*Admin Routes*/}
                            <Route
                                path="/displayToken"
                                render={
                                    (props) => <DisplayAllTokenComponent
                                        drizzle={this.props.drizzle}
                                        drizzleState={this.props.drizzleState}
                                    />
                                }
                            />
                            <Route
                                path="/approveProposals"
                                render={
                                    (props) => (
                                        <DisplayProposalComponent
                                            drizzle={this.props.drizzle}
                                            drizzleState={this.props.drizzleState}
                                        />
                                    )
                                }
                            />
                            <Route
                                path="/withdraw"
                                render={
                                    (props) => (
                                        <div>
                                            <DisplayBalanceComponent
                                                drizzle={this.props.drizzle}
                                                drizzleState={this.props.drizzleState}
                                            />
                                            <WithdrawComponent
                                                drizzle={this.props.drizzle}
                                                drizzleState={this.props.drizzleState}
                                            />
                                        </div>
                                    )
                                }
                            />

                            {/*Conference Routes*/}
                            <Route
                                path="/proposeConference"
                                render={
                                    (props) => <CreateProposalComponent
                                        drizzle={this.props.drizzle}
                                        drizzleState={this.props.drizzleState}
                                    />
                                }
                            />
                            <Route
                                path="/purchaseToken"
                                render={
                                    (props) => (
                                        this.state.byteConferenceName ?
                                            <div>
                                                <PurchaseTokenComponent
                                                    drizzle={this.props.drizzle}
                                                    drizzleState={this.props.drizzleState}
                                                    byteConferenceName={this.state.byteConferenceName}
                                                    tokenAddress={this.state.tokenAddress}
                                                />

                                                <ApproveTokenToContract
                                                    drizzle={this.props.drizzle}
                                                    drizzleState={this.props.drizzleState}
                                                    tokenAddress={this.state.tokenAddress}
                                                    conferenceAddress={this.state.conferenceAddress}
                                                />
                                            </div>
                                            :
                                            <div/>
                                    )
                                }
                            />
                            <Route
                                path="/submitPaper"
                                render={
                                    (props) => <CreatePaperComponent
                                        drizzle={this.props.drizzle}
                                        drizzleState={this.props.drizzleState}
                                        byteConferenceName={this.state.byteConferenceName}
                                        conferenceAddress={this.state.conferenceAddress}
                                    />
                                }
                            />
                            <Route
                                path="/viewPapers"
                                render={
                                    (props) => (
                                        <div>
                                            <DisplayPapersComponent
                                                drizzle={this.props.drizzle}
                                                drizzleState={this.props.drizzleState}
                                                conferenceName={this.state.conferenceName}
                                                byteConferenceName={this.state.byteConferenceName}
                                                conferenceAddress={this.state.conferenceAddress}
                                            />
                                        </div>
                                    )
                                }
                            />
                            <Route
                                path="/conferenceManagement"
                                render={
                                    (props) => <ConferenceManagement
                                        drizzle={this.props.drizzle}
                                        drizzleState={this.props.drizzleState}
                                        conferenceAddress={this.state.conferenceAddress}
                                    />
                                }
                            />

                            <Route
                                path="/viewPaperDetail/:paperContractAddress/:paperIndex"
                                render={
                                    (props) => (
                                        <div>
                                            <DisplayPaperDetailComponent
                                                drizzle={this.props.drizzle}
                                                drizzleState={this.props.drizzleState}
                                                conferenceName={this.state.conferenceName}
                                                byteConferenceName={this.state.byteConferenceName}
                                                conferenceAddress={this.state.conferenceAddress}
                                                paperAddress={props.match.params.paperContractAddress}
                                                paperIndex={props.match.params.paperIndex}
                                            />
                                        </div>
                                    )
                                }
                            />
                        </Row>
                    </Grid>
                </div>
            </BrowserRouter>
        )
    }
}

export default RouterComponent;