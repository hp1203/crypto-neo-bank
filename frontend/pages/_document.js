import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Toaster } from 'react-hot-toast'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="dark:bg-gray-900 bg-white" >
          <Main />
          <NextScript />
          <div><Toaster/></div>
        </body>
      </Html>
    )
  }
}

export default MyDocument