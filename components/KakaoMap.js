import React, { Component } from 'react';

export default class KaKaoMap extends Component {

  static defaultProps = {
    jsUrl: '//dapi.kakao.com/v2/maps/sdk.js', //defalut
    id: 'kakaomap',
    width: '100%',
    height: '600px',
    mapTypeId: 'ROADMAP',
    level: 5,
    clickable: true,
    removable: true,
    positions: [],
    mapClass: 'kakaomap',
    defaultInfoClass: 'kakaomap-info',
    addressMode: true,
    center: {
      type: 'OFFSET',
      address: '',
      y: 0,
      x: 0,
    },
    centerAddress: '',
    useMarkerImage: false,
    markerImageOption: {
      url: '//t1.daumcdn.net/localimg/localimages/07/2012/img/marker_p.png',
      width: 42,
      height: 40,
      options: {},
    },
    clickGetAddress: true,
    dragGetAddress: false,
    clickFunc: () => {},
    dragFunc: () => {},
    callbackFromParent: () => {},
    newMarkerEvent: () => {},
  }


  constructor(props) {
    super(props);
    this.index = 0;
    this.state = {
      level: this.props.level,
      positions: this.props.positions,
      position: {
        x: 0,
        y: 0,
      },
      markers: [],
      center: this.props.center,
      addressMode: this.props.addressMode,
      address: this.props.centerAddress,
      clickGetAddress: this.props.clickGetAddress,
      dragGetAddress: this.props.dragGetAddress,
    };
    this.mapContainer = null;
    this.map = null;
    this.marker = null;
    this.markerImage = null;
    this.coords = null;
    this.geocoder  = null;
    if (props.callbackFromParent) {
      this.props.callbackFromParent(this);
    }

  }

  addScript() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `${this.props.jsUrl}?appkey=${this.props.appkey}&libraries=services`;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  setInitialConfig() {
    this.mapContainer = document.getElementById(`${this.props.id}`);
    this.map = new kakao.maps.Map(this.mapContainer, {
      center: new kakao.maps.LatLng(0, 0), //Essential
      mapTypeId : kakao.maps.MapTypeId[this.props.mapTypeId],
    });
    this.geocoder = new kakao.maps.services.Geocoder();
  }

  setCenter() {
    if (this.state.center.type === 'OFFSET') {
      this.map.setCenter(new kakao.maps.LatLng(this.state.center.y, this.state.center.x));
    }

    if (this.state.center.type === 'ADDRESS') {
      this.addressSearch('GET_CENTER', this.state.center);
    }

  }

  getPositions() {
    if (this.state.addressMode) {
      for (let i = 0; i < this.state.positions.length; i++) {
        const positions = this.state.positions[i];
        this.addressSearch('GET_POSITION', Object.assign({}, positions, { index: i }));
      }
    } else {
      const positions = [];

      for (let i = 0; i < this.state.positions.length; i++) {
        const statePositions = this.state.positions[i];
        this.addMarker(i, new kakao.maps.LatLng(statePositions.y, statePositions.x), statePositions.title);
        this.geocoder.coord2Address(statePositions.x, statePositions.y, (result, status) => {

          if (status === 'OK') {
            const roadAdress = result[0].road_address;
            const address = result[0].address;
            const addressResult = roadAdress || address;

            positions.push( Object.assign({}, statePositions, { address: addressResult.address_name}));

            if (i === (this.state.positions.length -1)) {
              this.setState({
                positions,
              })
            };

          }
        });
      }
    }
    this.index = this.state.positions.length - 1;

  }

  getPosition(position) {
    this.addressSearch('GET_POSITION', Object.assign({}, position, { index: this.index + 1 }));
    this.index += 1;
  }


  addressSearch(type, data) {
    this.geocoder.addressSearch(data.address, (result, status) => {

      if (status === 'OK') {
        if (type === 'GET_CENTER') {
          this.setState({ center: { y: result[0].y, x: result[0].x, type: 'OFFSET'} });
        }
        if (type === 'GET_POSITION') {
          this.addMarker(data.index, new kakao.maps.LatLng(result[0].y, result[0].x), data.title);
        }
      }
    });
  }

  addMarker(index, position, title) {
    const markerImageOption = this.props.markerImageOption;
    const markerImageUrl = markerImageOption.url;
    const markerImageSize = new kakao.maps.Size(markerImageOption.width, markerImageOption.height); // 마커 이미지의 크기
    this.markerImage = (this.props.useMarkerImage) ? new kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOption.options) : null;

    const marker = new kakao.maps.Marker({
      position,
      image: this.markerImage,
      draggable: true,
      zIndex: 0,
      title,
    });
    this.setState(prevState => ({
      markers: [...prevState.markers, marker]
    }));
    this.markerEvent(marker, { index, title});
    marker.setMap(this.map)
  }

  markerEvent(marker, option) {
    kakao.maps.event.addListener(marker, 'click', () => {

      if (this.state.clickGetAddress) {
        this.searchDetailAddrFromCoords(marker.getPosition(), (result, status) => {
          if (status === 'OK') {
            this.props.clickFunc(this, { result, option});
          };
        });
      } else {
        this.props.clickFunc(this, {option});
      }
    });

    kakao.maps.event.addListener(marker, 'dragend', () => {
      if (this.state.dragGetAddress) {
        this.searchDetailAddrFromCoords(marker.getPosition(), (result, status) => {
          if (status === 'OK') {
            this.props.dragFunc(this, { result, option});
          };
        });
      } else {
        this.props.dragFunc(this, {option});
      }
    });
  }

  searchDetailAddrFromCoords(coords, callback) {
    this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  componentWillReceiveProps(nextProps) {

    if (JSON.stringify(this.state.positions) !== JSON.stringify(nextProps.positions)) {
      const position = nextProps.positions[nextProps.positions.length - 1];
      this.getPosition(position);
    }

    if (this.state.level !== nextProps.level) {
      this.map.setLevel(nextProps.level); // set zoom
      this.setState({ level: nextProps.level});
    }
  }



  componentDidUpdate(prevProps, prevState) {

    // set Center
    if (JSON.stringify(this.props.center) !== JSON.stringify(prevProps.center)) {
      this.setCenter();
    }

    if (JSON.stringify(this.state.center) !== JSON.stringify(prevState.center)) {
      this.setCenter();
      this.props.callbackFromParent(this);
    }

    // level
    if (this.state.level !== prevState.level) {
      this.map.setLevel(this.state.level); // set zoom
      this.props.callbackFromParent(this);
    }

    // Change Marker
    if (JSON.stringify(this.state.positions) !== JSON.stringify(prevState.positions)) {
      this.props.callbackFromParent(this);
    }
  }


  componentDidMount() {
    this.addScript();
    this.setInitialConfig();
    this.setCenter();
    this.map.setLevel(this.props.level); // set zoom
    this.getPositions();

    kakao.maps.event.addListener(this.map, 'click', this.markMakeClickHandler);
    kakao.maps.event.addListener(this.map, 'zoom_changed', () => {
      this.setState({ level: this.map.getLevel()});
    });
  }


  markMakeClickHandler = (mouseEvent) => {

      const title = `신규타이틀${this.index + 1}`;

      var content = `<div id='newMarkerWrap${this.index}' style='z-index:99;width:200px;'><input type='text' id='newMarker${this.index}' placehoder='${title}' style='float:left;width:150px;height:30px;'/>
      <button type='button' id='newMarkerButton${this.index}' style='float:left;height:36px;'>생성</button></div>`;
      var customOverlay = new kakao.maps.CustomOverlay({
        position: mouseEvent.latLng,
        content: content,
      });
      customOverlay.setMap(this.map);

      const newMarker = document.getElementById(`newMarker${this.index}`);
      const newMarkerWrap = document.getElementById(`newMarkerWrap${this.index}`);
      const newMarkerButton = document.getElementById(`newMarkerButton${this.index}`);
      newMarker.focus();
      newMarkerButton.addEventListener('click', () => {

        const newTitle = newMarker.value;

        this.addMarker(this.index + 1, mouseEvent.latLng, newTitle);

        this.index = this.index + 1;
        this.searchDetailAddrFromCoords(mouseEvent.latLng, (result, status) => {
          //console.log(mouseEvent.latLng.getLat());
          //console.log(mouseEvent.latLng.getLng());

          if (status === 'OK') {
            const address = result[0].address.address_name;
            const roadAdress = result[0].road_address && result[0].road_address.address_name;
            this.setState(prevState => ({
              positions: [...prevState.positions, { title: newTitle, address: roadAdress || address}]
            }));
            this.props.newMarkerEvent(this, { title: newTitle, address: roadAdress || address});
          };
        });
        newMarkerWrap.remove();
        kakao.maps.event.addListener(this.map, 'click', this.markMakeClickHandler);
      }, false);
      kakao.maps.event.removeListener(this.map, 'click', this.markMakeClickHandler);
  }

  getAddress() {
    this.setState({ clickGetAddress: true, dragGetAddress: true });
  }

  render() {
    const divStyle = {
      width: this.props.width,
      height: this.props.height,
    };

    return (
      <div>
        <div style={ divStyle } id={this.props.id} className={this.props.mapClass}></div>
      </div>
    );
  }
}
