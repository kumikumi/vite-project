import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

// eslint-disable-next-line import/order
import App from './App.tsx'

import { Store } from './redux/Store.ts'

// eslint-disable-next-line
const Providers = ({ children }: React.PropsWithChildren<object>) => (
	<Provider store={Store}>{children}</Provider>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Providers>
			<App />
		</Providers>
	</React.StrictMode>
)
