import React, { useState } from 'react';
import './index.scss'

export default function Counter() {
  const [count, setCount] = useState(0);

  if (count > 2) {
    throw new Error('I crashed!');
  }

	return (
		<div className='flex flex-col items-center justify-center h-full gap-2'>
      <div className='text-3xl font-bold text-blue-400'>{count}</div>
			<div>If my count is 3 or more I will throw an error</div>
			<button className='px-4 py-2 text-white bg-gray-900 rounded-full' onClick={() => setCount(count + 1)}>
				Increment
			</button>
		</div>
	);
}
