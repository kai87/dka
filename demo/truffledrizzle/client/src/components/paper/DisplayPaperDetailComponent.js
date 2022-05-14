import React from "react";
import {Jumbotron, Tab, Tabs} from "react-bootstrap";
import UploadNewPaperContentComponent from "./UploadNewPaperContentComponent";
import DisplayPaperHistoryComponent from "./DisplayPaperHistoryComponent";
import DisplayPaperReviewsComponent from "./DisplayPaperReviewsComponent";
import CreateReviewComponent from "./CreateReviewComponent";
import MakeDecisionComponent from "./MakeDecisionComponent";

class DisplayPaperDetailComponent extends React.Component {
    state = {
        paperBasicKey: null,
        constructiveReviewKey: null,
        criticalReviewKey: null,
        stackId: null,
    };

    constructor(props) {
        super(props);
        this.captureFile = this.captureFile.bind(this);
    }

    componentDidMount() {
        const {drizzle, paperAddress} = this.props;
        console.log('prop', this.props);
        const paperContract = drizzle.contracts[paperAddress];
        const paperBasicKey = paperContract.methods["displayPaperBasic"].cacheCall();
        this.setState({paperBasicKey});
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

    render() {
        const {drizzleState, paperAddress} = this.props;
        const paperContract = drizzleState.contracts[paperAddress];
        const paperBasic = paperContract.displayPaperBasic[this.state.paperBasicKey];
        return (
            <div>
                <Jumbotron>
                    <p>Author: {paperBasic && paperBasic.value[0]}</p>
                    <p>State: {paperBasic && paperBasic.value[1]}</p>
                    <p>Balance: {paperBasic && paperBasic.value[2]}</p>
                </Jumbotron>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Upload new version">
                        <UploadNewPaperContentComponent
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            paperAddress={this.props.paperAddress}
                        />
                    </Tab>
                    <Tab eventKey={2} title="History">
                        <DisplayPaperHistoryComponent
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            paperAddress={this.props.paperAddress}
                        />
                    </Tab>
                    <Tab eventKey={3} title="Reviews">
                        <DisplayPaperReviewsComponent
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            paperAddress={this.props.paperAddress}
                        />
                    </Tab>
                    <Tab eventKey={4} title="Write Review">
                        <CreateReviewComponent
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            paperAddress={this.props.paperAddress}
                        />
                    </Tab>
                    <Tab eventKey={5} title="Make a decision">
                        <MakeDecisionComponent
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            paperAddress={this.props.paperAddress}
                        />
                    </Tab>
                </Tabs>
            </div>

        )


    }
}

export default DisplayPaperDetailComponent;