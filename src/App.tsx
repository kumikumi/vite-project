import React from 'react'

import { Store, useSelector } from './redux/Store'

import viteLogo from '/vite.svg'

import reactLogo from './assets/react.svg'
import { Blocker, history } from './a-router/history'

import './App.css'

type NavigationBlockProps = {
	blocker: Blocker
}

const NavigationBlock = (props: NavigationBlockProps) => {
	const onNavigateAwayRef = React.useRef(props.blocker)
	onNavigateAwayRef.current = props.blocker
	React.useEffect(() => {
		// Mount
		const unblock = history.block((url, confirm) =>
			onNavigateAwayRef.current(url, confirm)
		)
		return () => {
			// Unmount
			unblock()
		}
	}, [])

	return null
}

function App() {
	const count = useSelector((state) => state.counter)
	const increment = () => Store.dispatch({ type: 'counter/increment' })
	return (
		<>
			<header className="container">
				<h1>Header</h1>
				<NavigationBlock
					blocker={(url, confirmNavigation) => {
						// eslint-disable-next-line no-alert
						const result = confirm(`Confirm navigation to ${url}`)
						if (result) {
							confirmNavigation()
						}
					}}
				/>
				<ul>
					<li>
						<a onClick={() => history.push('/page1')}>Page 1</a>
					</li>
					<li>
						<a onClick={() => history.push('/page2')}>Page 2</a>
					</li>
					<li>
						<a onClick={() => history.push('/page3')}>Page 3</a>
					</li>
				</ul>
			</header>
			<main className="container">
				<div>
					<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank" rel="noreferrer">
						<img src={reactLogo} className="logo react" alt="React logo" />
					</a>
				</div>
				<h1>Vite + React</h1>
				<div className="card">
					<button onClick={increment}>count is {count}</button>
					<p>
						Edit <code>src/App.tsx</code> and save to test HMR
					</p>
				</div>
				<p className="read-the-docs">
					Click on the Vite and React logos to learn more
				</p>
			</main>
			<footer className="container">Footer</footer>
		</>
	)
}

export default App
