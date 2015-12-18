import React from 'react';
import ReactDOM from 'react-dom';

var Button = React.createClass({
    render: function(){
        return (
            <button {...this.props} onClick={this.props.handleClick} className={this.props.className} >{this.props.name}</button>
        );
    }
});

export default Button;