;(function( $, undefined){


$.widget("ui.GeoTool",{

	
	options:{
		serviceLink: "",
		imageLink: "",
	},

	_create: function(){
		var self = this;
		this.iconUrl = $("#markericon").attr("src");

		self._createMap();

	},

	
	_getJson: function(){
		var self = this;
		$.ajax({
			  type: "GET",
			  dataType: 'json',
			  url:  self.options.serviceLink,
			  success: function(json){self._createMap(json);},
			   error: function(jqXHR,  textStatus, errorThrown){console.log(jqXHR, textStatus, errorThrown);}
		});
	},
	
	
	_createMap: function(){
	    var self = this;
	    
		this.mainMapLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery Â© <a href="http://mapbox.com">Mapbox</a>',
			id: 'mapbox.streets'
		});
		
		this.map = L.map('map')
		.setView([ 51.50, 20.21 ], 4)
		.addLayer(self.mainMapLayer);
		
		this.markers = new L.MarkerClusterGroup();
		this.markers2 = new L.MarkerClusterGroup();
		
		this.LeafIcon = L.Icon.extend({
			options: {
				iconSize:     [28, 28],
			}
		});
		
	    this.archiveIcon = L.icon({
	    	iconUrl: self.options.imageLink,
			iconSize:     [28, 28],

	    	
	    })
	    
	    
	    this.collectionIcon = new self.LeafIcon({iconUrl: 'img/collection.png'});
	    this.charterIcon = new self.LeafIcon({iconUrl: 'img/charter.png'});
	    
	    self.map.addLayer(self.markers);
	    self.map.addLayer(self.markers2);
	    
		$.ajax({
			  type: "GET",
			  dataType: 'json',
			  url:  self.options.serviceLink,
			  success: function(json){self._createMarker(json);},
			   error: function(jqXHR,  textStatus, errorThrown){console.log(jqXHR, textStatus, errorThrown);}
		});

	    
  
	},

	_setMarker: function(lat, lng, result, mode){
		var self = this;
        if(mode =="charter"){
            var marker = L.marker([lat, lng], {icon: self.charterIcon});
        }
        else{
            var marker = L.marker([lat, lng], {icon: self.archiveIcon});     
        }
        marker.bindPopup(result);
        self.markers.addLayer(marker);

	},
	
	_createMarker: function(json){
		self = this;
        for(var locationsCounter = 0, locationsLength = json.geolocations.length; locationsCounter < locationsLength; locationsCounter++ ){
            var lat = json.geolocations[locationsCounter].lat;
            var lng = json.geolocations[locationsCounter].lng;
            if(!json.geolocations[locationsCounter].name){
                json.geolocations[locationsCounter].name = "???";
            }
            var result = "<b>"+json.geolocations[locationsCounter].name+"</b><br />";
            for (var resultsCounter = 0, resultsLength = json.geolocations[locationsCounter].results.length; resultsCounter < resultsLength; resultsCounter++) {
            	result = result + "<a href='"+json.geolocations[locationsCounter].results[resultsCounter].url+"'>"+json.geolocations[locationsCounter].results[resultsCounter].displayText+'</a><br/>';
            }
            self._setMarker(lat, lng, result, "archives");
        }	  
		
	}
	
	
	});




})( jQuery );



	








