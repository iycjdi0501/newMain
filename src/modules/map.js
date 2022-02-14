/* eslint-disable */
export class Map {
    map
    geocoder
    marker
    OK = kakao.maps.services.Status.OK
    test
    constructor(element, {latitude, longitude, level, test}) {
        this.map = new kakao.maps.Map(element, {center: this.loadCoordinate(latitude, longitude), level})
    }

    createGeocoder() {
        this.geocoder = new kakao.maps.services.Geocoder()
    }

    createMarker(coordinate) {
        if(!this.marker){
            this.marker =  new kakao.maps.Marker({position: coordinate, map: this.map})
        }
    }

    loadCoordinate(latitude, longitude) {
        return new kakao.maps.LatLng(latitude, longitude)
    }

    addressSearch(address, resultFunction) {
        this.geocoder.addressSearch(address, resultFunction)
    }

    reLayout() {
        this.map.relayout()
    }

    setCenter(coordinate) {
        this.map.setCenter(coordinate)
    }

    setPosition(coordinate) {
        this.marker.setPosition(coordinate)
    }
}
