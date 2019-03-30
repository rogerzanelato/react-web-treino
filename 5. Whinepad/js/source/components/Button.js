import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = props => {
    const cssClasses = classNames('Button', props.className);

    return props.href
        ? <a {...props} className={cssClasses} />
        : <button {...props} className={cssClasses} />
}

Button.propTypes = {
    href: PropTypes.string,
};

export default Button