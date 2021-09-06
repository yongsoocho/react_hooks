import { useState } from 'react'

export const useTabs = (initialTab, allTabs) => {
	
	const [currentIndex, setCurrentIndex] = useState(initialTab);
	
	return {
		currentItem: allTabs[currentIndex],
		changeItem: setCurrentIndex
	}

} 