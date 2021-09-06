import { Fragment, useState, useEffect, useRef } from 'react';
import { useInput } from './useInput';
import { useTabs } from './useTabs';
	
const content = [
	{
		tab: "Section 1",
		content: "I'm content of section 1"
	},
	{
		tab: "Section 2",
		content: "I'm content of section 2"
	}
]

const useTitle = initialTitle => {
	const [title, setTitle] = useState(initialTitle)
	const updateTitle = () => {
		const htmlTitle = document.querySelector('title')
		htmlTitle.innerText = title
	}
	useEffect(updateTitle, [title])
	return setTitle
}

const useConfirm = (message, cb, rejection) => {
	if(!cb || typeof cb !== "function") {
		return;
	}
	if(!rejection || typeof rejection !== "function") {
		return;
	}
	const confirmAction = () => {
		if(window.confirm(message)) {
			cb()
		} else {
			rejection()
		}
	}
	return confirmAction
}

const usePreventLeave = () => {
	const listener = event => {
		event.preventDefault()
		event.returnValue = ""
	}
	const enablePrevent = () => window.addEventListener("beforeunload", listener)
	const disablePrevent = () => window.addEventListener("beforeunload", listener)
	return { enablePrevent, disablePrevent }
}

const useBeforeLeave = onBefore => {
	const handle = (e) => {
		const { clientY } = e
		if(clientY <= 0) {
			onBefore()		
		}
	}
	useEffect(() => {
		if(typeof onBefore !== "function") {
			return;
		}
		document.addEventListener("mouseleave", handle)
		return () => document.removeEventListener("mouseleave", handle)
	}, [])
}

const useFadeIn = (duration = 3, deal = 0) => {
	const element = useRef()
	useEffect(() => {
		if(element.current) {
			const { current } = element
			current.style.transition = `opacity ${duration}s ease-in-out ${deal}s`
			current.style.opacity = 1
		}
	}, [])
	return { ref:element, style: { opacity:0 } }
}

const App = (props) => {
	const input = useInput('')
	const { currentItem, changeItem } = useTabs(0, content)
	
	const titleUpdater = useTitle('Loading...')
	
	setTimeout(() => titleUpdater("Home"), 1000)
	
	useEffect(() => {
		console.log('render')
		return () => {
			console.log('cleanup')
		}
	}, [input.value])
	
	const testRef = useRef()
	setTimeout(() => {
		testRef.current.focus()
	}, 4000)
	
	const useClick = onClick => {
		const element = useRef()
		
		useEffect(() => {
			if(element.current) { element.current.addEventListener("click", onClick) }
			
			return () => element.current.removeEventListener("click", onClick)
		}, [])
		
		return element;
	}
	const sayHello = () => console.log("Hi~! I'm cys")
	const btn = useClick(sayHello);
	
	const printConfirm = () => console.log('test confirm')
	const abort = () => console.log('aborted')
	const testConfirm = useConfirm("Are you sure?", printConfirm, abort)
	
	const { enablePrevent, disablePrevent } = usePreventLeave();
	
	const begForLife = () => console.log("Plz don't leave")
	useBeforeLeave(begForLife)
	
	const el = useFadeIn(1,1)
	const el2 = useFadeIn(6)
	
	return (
		<Fragment>
			<div>{ input.value }</div>
			<input placeholder="name" {...input} />
			<p></p>
			{ content.map((section, index) => (
				<button key={section.tab} onClick={() => { changeItem(index) }} >{ section.tab }</button>
			)) }
			<p>{ currentItem.content }</p>
			<input placeholder="test.." ref={testRef} />
			<p></p>
			<button ref={btn} onClick={testConfirm}>Hi~</button>
			<div></div>
			<button onClick={enablePrevent}>protect</button>
			<button onClick={disablePrevent}>unprotect</button>
			<h1 {...el}>Element</h1>
			<p {...el2}>Hello My name is Cho Yongsoo Nice to meet you!</p>
		</Fragment>
	)
	
};

export default App;