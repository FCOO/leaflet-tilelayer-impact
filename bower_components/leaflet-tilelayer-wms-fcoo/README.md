# leaflet-tilelayer-wms-fcoo

Leaflet layer store for layers provided by FCOO.

## Demo
http://jblarsen.github.io/leaflet-tilelayer-wms-fcoo/

## Requirements
Leaflet, jQuery and moment.

http://leafletjs.com/

http://jquery.com/

http://momentjs.com/

## Usage
Install the dependencies and include the Javascript
file in this repository in your application:

Example usage:

        var map1 = L.map('map1').setView([56.5, 12.0], 5);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a>'
        }).addTo(map1);

        var store = new L.Control.FcooLayerStore;

        // Add layers to map1
        var options = {
            'dataset': 'FCOO/WW3/NSBALTIC',
            'parameter': 'waveDirection'
        }
        var windDirectionLayer = store.getLayer(options);
        map1.addLayer(windDirectionLayer);
        options = {
            'dataset': 'DMI/HIRLAM/S03',
            'parameter': 'windSpeed'
        }
        var windSpeedLayer = store.getLayer(options);
        map1.addLayer(windSpeedLayer);

