import React from 'react';
import PropTypes from 'prop-types';
import Rating from './Rating';
import Suggest from "./Suggest";

class FormInput extends React.Component {
    constructor(props) {
        super(props);

        this.input = React.createRef();
    }
    
    getValue() {
        return 'value' in this.input
            ? this.input.value
            : this.input.getValue();
    }

    render() {
        const common = { // propriedades aplicáveis a todos
            id: this.props.id,
            ref: this.input,
            defaultValue: this.props.defaultValue,
        };

        switch (this.props.type) {
            case 'year':
                return (
                    <input {...common} type="number" defaultValue={this.props.defaultValue || new Date().getFullYear()} />
                );
            case 'suggest':
                return <Suggest {...common} options={this.props.options} />
            case 'rating':
                return (
                    <Rating {...common} defaultValue={parseInt(this.props.defaultValue, 10)} />
                );
            case 'text':
                return <textarea {...common} />;
            default:
                return <input {...common} type="text" />
        }
    }
}

FormInput.propTypes = {
    type: PropTypes.oneOf(['year', 'suggest', 'rating', 'text', 'input']),
    id: PropTypes.string,
    options: PropTypes.array, // como em <options>s de preenchimento automático
    defaultValue: PropTypes.any,
};

export default FormInput