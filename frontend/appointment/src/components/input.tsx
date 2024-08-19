import React, { Component } from 'react';

/** The input content component */
class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.defaultValue || ''
        };

        this.onChange = this.onInputChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        // Call parent's onChange only when value actually changes
        if (prevProps.defaultValue !== this.props.defaultValue) {
            this.setState({ value: this.props.defaultValue || '' });
        }
    }

    onInputChange(e) {
        const value = e.target.value;
        this.setState({ value });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        return (
            <input 
                type={this.props.type || 'text'} // Default to text if type not provided
                placeholder={this.props.placeholder} 
                className="mm-popup__input" 
                value={this.state.value} 
                onChange={this.onChange} 
            />
        );
    }
}

export default Input;
