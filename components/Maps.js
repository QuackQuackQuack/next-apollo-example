import React, { Component } from 'react';
import KaKaoMap from '../components/KakaoMap';
import withApolloClient from '../lib/with-apollo-client'
import QUERRY from '../query/query'



 class Maps extends Component {

  constructor(props) {
    super(props)
    this.state = {
      level: 5,
      center: {
        type: 'ADDRESS',
        address: '서울특별시 서초구 남부순환로344길 10',
        y: 0,
        x: 0,
      },
    }
  }

  dragFunc = (KakaoMap, data) => {
    console.log(data);
  }
  clickFunc = (KakaoMap, data) => {
    console.log(data);
  }

  newMarkerEvent = async (KaKaoMap, newMarker) => {
    await this.props.apolloClient.mutate({
      mutation: QUERRY.ADD_MAP,
      variables: {
        title: newMarker.title,
        address: newMarker.address,
      },
    });
  }

  parentCallback = (dataFromChild) => {
    const positions = dataFromChild.state.positions;
    const level = dataFromChild.state.level;
    this.setState({ positions, level });
  }


  componentDidMount() {

    this.props.subscribeToMore({
      document: QUERRY.MAP_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        return {
          maps: [
            ...prev.maps,
            subscriptionData.data.subscriptionMap,
          ],
        };
      },
    });
  }

  render() {
    return (
    <div>
    <KaKaoMap appkey='' level={this.state.level} positions={this.props.Maps} center={this.state.center} newMarkerEvent={this.newMarkerEvent}
      clickFunc={this.clickFunc} dragFunc={this.dragFunc} callbackFromParent={this.parentCallback}/>
      <div>줌 레벨 {this.state.level}</div>
        <div>
        <ul>
          {
            this.props.Maps.map((item, index) => (
              <li key={index}>{index} {item.title} {item.address}</li>
            ))
          }
        </ul>
      </div>
    </div>
    );
  }
}


export default withApolloClient(Maps);