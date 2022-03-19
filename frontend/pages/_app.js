import { AccountProvider } from '../context/AccountContext';
import { WalletProvider } from '../context/WalletContext';
import '../styles/globals.css';
import { MoralisProvider } from "react-moralis";
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider serverUrl="https://x1cgu5ns5ubi.usemoralis.com:2053/server" appId="qThj4Kvh6qHgIkAGvK5KIMXpmDOJIf6gOhBqvKWl">
    <AuthProvider>
      <AccountProvider>
        <Component {...pageProps} />
      </AccountProvider>
    </AuthProvider>
    </MoralisProvider>
    )
}

export default MyApp
