import React from 'react';

const Button = (props) => { 
  return <button {...props} onClick={props.handleClick} className={props.className} >{props.name}</button>

export default Button;