import React, { Component } from 'react';
import { ButtonDropdown, Button, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class SplitDropupButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return(
            <ButtonDropdown
                disabled={this.props.history.length === 0} 
                direction="up" 
                isOpen={this.state.isOpen} 
                toggle={this.toggle}
                >
                <Button 
                    id="caret" 
                    color="success" 
                    onClick={() => this.props.navigate(this.props.history[this.props.history.length - 1])}
                    >
                    {this.props.text}
                </Button>
                <DropdownToggle caret color="success" />
                <DropdownMenu>
                    {
                        this.props.history.map(h => 
                                <DropdownItem 
                                    key={h.id} 
                                    onClick={() => this.props.navigate(h)}
                                    >
                                    {h.title}
                                </DropdownItem>
                            )
                    }
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}

export default SplitDropupButton;