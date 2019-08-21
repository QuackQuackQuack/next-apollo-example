import App, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'
import withApolloClient from '../lib/with-apollo-client'
import { ApolloProvider } from 'react-apollo'

class MyApp extends App {
  render () {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Head>
            <title>React apollo example</title>
            <meta charSet='utf-8' />
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            <script type="text/javascript" src="http://dapi.kakao.com/v2/maps/sdk.js?appkey=c1d24d5735225f79bcc47f6557b46251&libraries=services"></script>
          </Head>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApolloClient(MyApp)
