import { useState } from 'react';

export const useInput = (value) => {
	const [name, setName] = useState(value);
		
	const onChange = event => {
		const { target:{ value } } = event;
		setName(value);
	}
		
	return { onChange, value:name }
}