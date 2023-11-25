import { Store, useSelector } from './redux/Store'

import viteLogo from '/vite.svg'

import reactLogo from './assets/react.svg'

import './App.css'

function App() {
	const count = useSelector((state) => state.counter)
	const increment = () => Store.dispatch({ type: 'counter/increment' })
	return (
		<>
			<header className="container">Header</header>
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
