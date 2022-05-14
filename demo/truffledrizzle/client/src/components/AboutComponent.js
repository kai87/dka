import {Col, Jumbotron, Row} from "react-bootstrap";
import React from "react";

class AboutComponent extends React.Component {
    render() {
        const dummySentences = [
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
            'Donec hendrerit tempor tellus.',
            'Donec pretium posuere tellus.',
            'Proin quam nisl, tincidunt et, mattis eget, convallis nec, purus.',
            'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
            'Nulla posuere.',
            'Donec vitae dolor.',
            'Nullam tristique diam non turpis.',
            'Cras placerat accumsan nulla.',
            'Nullam rutrum.',
            'Nam vestibulum accumsan nisl.'
        ];

        return (
            <div>
                <Jumbotron>
                    <h1>A Blockchain based peer review system</h1>
                    <p>Designed for academic conferences and journals</p>
                </Jumbotron>

                <Row className="show-grid">
                    <Col sm={6} md={3}>
                        <h3>
                            Open
                        </h3>
                        <br/>
                        {dummySentences.slice(3, 7).join(' ')}
                    </Col>
                    <Col sm={6} md={3}>
                        <h3>
                            Reliable
                        </h3>
                        <br/>
                        {dummySentences.slice(0, 4).join(' ')}
                    </Col>
                    <Col sm={6} md={3}>
                        <h3>
                            Gain reputation
                        </h3>
                        <br/>
                        {dummySentences.slice(0, 5).join(' ')}
                    </Col>
                    <Col sm={6} md={3}>
                        <h3>
                            Reward for tokens
                        </h3>
                        <br/>
                        {dummySentences.slice(0, 2).join(' ')}
                    </Col>
                </Row>
            </div>

        )
    }
}

export default AboutComponent;