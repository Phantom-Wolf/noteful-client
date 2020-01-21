import React from 'react';

export default function ValidateForm(props) {
	console.log('in val', props.message);
	if (props.message) {
		return <div className='error'>{props.message}</div>;
	}

	return <></>;
}
