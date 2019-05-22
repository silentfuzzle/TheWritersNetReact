import React, { Component } from 'react';
import { Form, Col, Label, Input, Button, FormGroup } from 'reactstrap';

class GenerateLinkForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultPage: 0,
            page: 0,
            linktext: '',
            shortcode: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        let link = this.state.linktext;
        if (this.state.linktext.length === 0) {
            link = 'Link Text';
        }

        const shortcode = `?[${link}](${this.state.page})`;

        this.setState({
            page: this.state.defaultPage,
            linktext: '',
            shortcode: shortcode
        });

        event.preventDefault();
    }

    componentDidMount() {
        let defaultPage = 0;
        if (this.props.pages.length > 0)
            defaultPage = this.props.pages[0].id;

        this.setState({
            page: defaultPage,
            defaultPage: defaultPage
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h4>Loading Pages...</h4>
            );
        } else if (this.state.errMess) {
            return (
                <h4>{this.state.errMess}</h4>
            );
        }

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup row>
                    <Col>
                        <Label for="page">Generate Page Link</Label>
                        <select
                            disabled={this.state.page === 0}
                            className="form-control"
                            id="page"
                            name="page"
                            value={this.state.page}
                            onChange={this.handleChange}
                            >
                                {
                                    this.props.pages.map(p => {
                                        return (<option key={p.id} value={p.id}>{p.title}</option>);
                                    })
                                }
                        </select>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col>
                        <Label for="linktext">Link Text</Label>
                        <Input
                            disabled={this.state.page === 0}
                            className="form-control mr-1"
                            id="linktext"
                            name="linktext"
                            value={this.state.linktext}
                            onChange={this.handleChange}
                            />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col>
                        <Button color="success" disabled={this.state.page === 0}>Generate</Button>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col>
                        <Label className="sr-only" for="shortcode">Shortcode appears here</Label>
                        <Input readOnly 
                            type="text" 
                            id="shortcode" 
                            placeholder="Shortcode appears here."
                            value={this.state.shortcode} />
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}

export default GenerateLinkForm;