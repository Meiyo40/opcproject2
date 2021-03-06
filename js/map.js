//GLOBAL VAR
var stations = [];
//SET MAP
function Map(name, coord, mapid) {
    this.name = name;
    this.coord = coord;
    this.mapid = mapid;
    this.myMap = L.map(this.mapid).setView(this.coord, 15.5);
    
    //MAP DATA STATIONS
    this.available_stations = 0;
    this.closed_stations = 0;
    this.empty_stations = 0;
    
    this.updateMapInfo = () => {
        let availableHTML = document.getElementById('availableStations');
        let emptyHTML = document.getElementById('emptyStations');
        let closedHTML = document.getElementById('closedStations');
        
        availableHTML.innerHTML  = this.available_stations;
        emptyHTML.innerHTML  = this.empty_stations;
        closedHTML.innerHTML  = this.closed_stations;
    }

    this.initMap = function () {
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 20,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibWVpeW8iLCJhIjoiY2pxcmp2bGMzMGxvajQ2bjJwbHJuZWQzMyJ9.INZjlfp6WqLeajKxCsKCgg'
        }).addTo(this.myMap);
    }
    
}
//OBJ STATION
function Station(data, Map) {

    this.name = data.name;
    this.address = data.address;
    this.coord = [data.position.lat, data.position.lng];
    this.status = data.status;
    this.Map = Map;
    this.marker;
    
    this.setMarker = function () {
        //TODO STATION FERME
        //IconStyle
        var Available = L.icon({
            iconUrl: 'assets/Cycling_Location.png',
            iconSize: [39,60],
            iconAnchor: [18,59],
            popupAnchor: [0,-56]
        });
        var notAvailable = L.icon({
            iconUrl: 'assets/Cycling_Location_empty.png',
            iconSize: [39,60],
            iconAnchor: [18,59],
            popupAnchor: [0,-56]
        });
        var Closed = L.icon({
            iconUrl: 'assets/Cycling_Location_closed.png',
            iconSize: [39,60],
            iconAnchor: [18,59],
            popupAnchor: [0,-56]
        });
        //createMarker
        if(data.available_bikes > 0 && data.status === "OPEN"){
           this.marker = new L.marker([this.coord[0], this.coord[1]], {icon: Available}).addTo(this.Map.myMap);
            this.Map.available_stations++;
           }
        else if(data.status === "CLOSED"){
            this.marker = new L.marker([this.coord[0], this.coord[1]], {icon: Closed}).addTo(this.Map.myMap);
            this.Map.closed_stations++;
        }
        else{
           this.marker = new L.marker([this.coord[0], this.coord[1]], {icon: notAvailable}).addTo(this.Map.myMap);
            this.Map.empty_stations++;
        }
        //Show popup with station name
        this.marker.bindPopup('<strong>Station:</strong><br>' + this.name).openPopup();
        this.marker.on('click', function(){
            document.getElementById('nameStation').placeholder = data.name;
            document.getElementById('address').placeholder     = data.address;
            document.getElementById('velo').placeholder        = data.available_bikes;
            document.getElementById('place').placeholder       = data.bike_stands;
        })
    }
    
    this.setStations = (Alldata, Map) => {
        for (let i = 0; i < Alldata.length; i++) {
            stations[i] = new Station(Alldata[i], Map);
            stations[i].setMarker();
            //if an user exist, we set previous data
            if(localStorage.getItem('user')){
                let tempUser = JSON.parse(localStorage.getItem('user'));
                if(Alldata[i].name == tempUser.station){
                    document.getElementById('nameStation').placeholder = Alldata[i].name;
                    document.getElementById('address').placeholder     = Alldata[i].address;
                    document.getElementById('place').placeholder       = Alldata[i].bike_stands;
                    if((tempUser.timer[1] > 0 )&& (tempUser.timer[0] > 0) && tempUser.signature){
                        if(Alldata[i].available_bikes > 1){
                            document.getElementById('velo').placeholder = (Alldata[i].available_bikes-1) + ' (1 Resa)';
                        }
                        else{
                            document.getElementById('velo').placeholder = (Alldata[i].available_bikes) + ' (1 Resa)';
                        }
                    }
                    else{
                        document.getElementById('velo').placeholder = Alldata[i].available_bikes;
                    }
                }
            }
        }
        Map.updateMapInfo();
    }
}
