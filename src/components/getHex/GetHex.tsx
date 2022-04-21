import { useState, useEffect, useRef} from 'react'
import { useMap, Polygon, Marker, Polyline } from 'react-leaflet'
import Loading from '../loading/Loading';


function GetHex() {
    const [data, setData] = useState(null);  
    const map = useMap();
    const h3 = require("h3-js");
    const boundedHex = [];
    let number = 0;

    useEffect(() => {
      map.on('moveend', function() { 
        let location = {east: map.getBounds().getEast() + 0.005, west:  map.getBounds().getWest() - 0.005, south: map.getBounds().getSouth() - 0.005, north: map.getBounds().getNorth() + 0.005};
        fetch(`http://spock.is:5000/api/Trash?LowerLatBound=${location.south}&LowerLngBound=${location.west}&UpperLatBound=${location.north}&UpperLngBound=${location.east}`)
            .then(res => res.json())
            .then( data => {
                if (data !== null) {
                  setData(data.map(hexOnly => hexOnly.h3Id))                }
            })        
      })
    }, []);


    if (data !== null) {
      const coordinates = h3.h3SetToMultiPolygon(data, false);
      coordinates.forEach((data) => {
        boundedHex.push(<Polygon color={'green'} key={number = number +1} positions={data}/>)
      })
    }
    return data === null ? (
      <Loading/>     
      ) : (
      <div>
          {boundedHex}  
      </div>  
    )
  }

  export default GetHex