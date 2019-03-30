import React from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput';
import Rating from './Rating';

class Form extends React.Component {
    constructor(props){
        super(props);

        this._refs = [];
        this.props.fields.forEach(field => {
            this._refs[field.id] = React.createRef();
        });
    }

    getData() {
        let data = {};

        this.props.fields.forEach(field => {
            data[field.id] = this._refs[field.id].getValue();
        });

        return data;
    }

    render() {
        return (
            <form className="Form">
                {
                    this.props.fields.map(field => {
                        const prefilled = this.props.initialData && this.props.initialData[field.id];

                        if (!this.props.readOnly) {
                            return (
                                <div className="FormRow" key={field.id}>
                                    <label className="FormLabel" htmlFor={field.id}>{field.label}:</label>
                                    <FormInput
                                        {...field}
                                        ref={element => this._refs[field.id] = element}
                                        defaultValue={prefilled}
                                    />
                                </div>
                            );
                        }

                        if (!prefilled) {
                            return null;
                        }

                        return (
                            <div className="FormRow" key={field.id}>
                                <span className="FormLabel">{field.label}</span>
                                {
                                    field.type === 'rating'
                                        ? <Rating readOnly={true} defaultValue={parseInt(prefilled, 10)} />
                                        : <div>{prefilled}</div>
                                }
                            </div>
                        );
                    }, this)
                }
            </form>
        );
    }
}

Form.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.string)
        })
    ).isRequired,
    initialData: PropTypes.object,
    readOnly: PropTypes.bool,
};

export default Form