import React, { Component } from 'react';
import App from '../components/App'
import Header from '../components/Header'
import Maps from '../components/Maps';
import { Query } from 'react-apollo';
import QUERRY from '../query/query'

class Map extends React.Component {

  render() {
    return (
      <App>
      <Header />
      <Query query={QUERRY.GET_MAPS}>
      {({ data, loading, subscribeToMore }) => {
        if (!data) {
          return null;
        }

        if (loading) {
          return <span>Loading ...</span>;
        }

        return (
          <Maps
            Maps={data.maps}
            subscribeToMore={subscribeToMore}
          />
        );
      }}
      </Query>
      </App>
    );
  }
}



export default Map;