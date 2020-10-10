
<template>
  <div id="map">
    <div id="mapContainer" style="height:600px;width:100%" ref="hereMap"></div>
  </div>
</template>

<script>
const config = require('config');
export default {
  name: "Map",
  data() {
    return {
      platform: null,
      apikey: "jMoxIpkNNj0aZNL1xVxGqPnsZ9sYLG7Zw5Q1FMRfd1s"
    };
  },
  async mounted() {
    // Initialize the platform object:
    const platform = new window.H.service.Platform({
      apikey: this.apikey
    });
    this.platform = platform;

    const response = await fetch(`${config.apiUrl}/chance-list`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        // body: JSON.stringify({"Address": {"CityId": 1}, "Chance": {"DateStart": "2020-08-07 17:00:00"}})
        body: JSON.stringify({"Address": {"CityId": 1}, "Chance": {}})
      });
    response.json = await response.json();

    if(!response.ok && response.json.statusCode === 401) {
      console.log(response.json.statusText);
      this.logOff();
    }

    const locations = [];
    response.json.data.map(chance => {
      if (chance.Longitude != null && chance.Latitude != null) {
        locations.push({ lat: chance.Latitude, lng: chance.Longitude });
      }
    })

    this.initializeHereMap(locations);
  },
  methods: {
    initializeHereMap(locations) {
      const mapContainer = this.$refs.hereMap;
      const H = window.H;
      // Obtain the default map types from the platform object
      var maptypes = this.platform.createDefaultLayers();
      maptypes.vector.normal.map.setMax(19);

      // Instantiate (and display) a map object:
      var map = new H.Map(mapContainer, maptypes.vector.normal.map, {
        zoom: 15,
        center: { lat: 32.0758, lng: 34.7722 }
      });

      const markers = [];
      const group = new H.map.Group();
      locations.map(loc => {
        const marker = new H.map.Marker(loc);
        const html = `<div class='chance'><span>Navigate with:</span><ul>
          <li><a href='//waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes&zoom=9'>waze</a></li>
          <li><a href='//maps.apple.com/?ll=${loc.lat},${loc.lng}"'>apple maps</a></li>
          <li><a href='//maps.google.com/maps?q=${loc.lat},${loc.lng}'>google maps</a></li></dix>`;

        marker.setData(html);
        markers.push(marker);
      })

      if(markers.length > 0) {  // prevent here map client error
        // add markers to the group
        group.addObjects(markers);
        map.addObject(group);

        group.addEventListener('tap', function (evt) {
          var bubble =  new H.ui.InfoBubble(evt.target.getGeometry(), {
            content: evt.target.getData()
          });
          ui.getBubbles().forEach(bub => ui.removeBubble(bub)); //remove other infobubbles
          ui.addBubble(bubble); // show info bubble
        }, false);

        // get geo bounding box for the group and set it to the map ( centralizing )
        map.getViewModel().setLookAtData({
          bounds: group.getBoundingBox()
        });
      }

      addEventListener("resize", () => map.getViewPort().resize());

      // add behavior control
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      // add UI
      const ui = H.ui.UI.createDefault(map, maptypes);
    }
  }
};
</script>

<style>
.chance { text-align: left; }
.chance span { font-weight: bold; border-bottom-style: solid; border-width: 1px; border-bottom-color:rgba(15, 22, 23, .8); }
ul { padding: 0; margin: 0; margin-top: 3px; list-style-type: none; line-height: 19px; }
ul li { text-align: center; }
ul li a { text-decoration: none; color: rgba(15, 22, 23, .8) }
.H_ib_body { width: 140px; }
</style>

<style scoped>
#map {
  width: 60vw;
  min-width: 360px;
  text-align: center;
  margin: 5% auto;
  background-color: #ccc;
}
</style>