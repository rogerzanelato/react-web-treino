import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Rating extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: props.defaultValue,
            tmpRating: props.defaultValue
        };
    }

    getValue() {
        return this.state.rating;
    }

    setTemp(rating) { // on mouse over
        this.setState({
            tmpRating: rating,
        });
    }

    setRating(rating) { // on click
        this.setState({
            tmpRating: rating,
            rating: rating,
        });
    }

    reset() { // on mouseout retorna a verdadeira classificação
        this.setTemp(this.state.rating);
    }

    componentWillReceiveProps(nextProps) { // reage a mudanças externas
        this.setRating(nextProps.defaultValue);
    }

    render() {
        const stars = [];

        for (let i = 1; i <= this.props.max; i++) {
            stars.push(
                <span
                    className={i <= this.state.tmpRating ? 'RatingOn' : null}
                    key={i}
                    onClick={!this.props.readOnly ? this.setRating.bind(this, i) : undefined}
                    onMouseOver={!this.props.readOnly ? this.setTemp.bind(this, i) : undefined}
                >
                    &#9734;
                </span>  
            );
        }

        return (
            <div
                className={classNames({
                    Rating: true,
                    RattingReadOnly: this.props.readOnly,
                })}
                onMouseOut={this.reset.bind(this)}
            >
                {stars}
                {this.props.readOnly || !this.props.id
                    ? null
                    : <input type="hidden" id={this.props.id} value={this.state.rating} />
                }
            </div>
        );
    }
}

Rating.propTypes = {
    defaultValue: PropTypes.number,
    readOnly: PropTypes.bool,
    max: PropTypes.number,
};

Rating.defaultProps = {
    defaultValue: 0,
    max: 5,
};

export default Rating