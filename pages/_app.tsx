import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux'

import '../styles/index.css'
import 'react-toastify/dist/ReactToastify.css';
import store from '../store';

function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
            <ToastContainer
                position="top-right"
                autoClose={8000}
                hideProgressBar={false}
                newestOnTop={false}
                draggable={false}
                closeOnClick
                pauseOnHover
            />
        </Provider>
    )
}

export default App