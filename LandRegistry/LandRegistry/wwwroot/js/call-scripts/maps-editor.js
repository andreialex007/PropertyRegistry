window.initMap = function () {
    setTimeout(function () {
        landsPage.initGoogleMap();
    },
        200);
};


window.mapManagerMixIn = {
    created: function () {

    },
    methods: {
        disableDrawing: function () {
            window.drawingManager.setMap(null);
            if (!!window.currentShape) {
                window.currentShape.setMap(null);
                window.currentShape = null;
            }
        },
        startDrawing: function () {
            window.drawingManager.setMap(window.map);
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        },
        getShapeCoordinates: function () {
            return window.currentShape.getPath().getArray().map(x => ({ lat: x.lat(), lng: x.lng() }));
        },
        clearMap: function () {
            this.disableDrawing();
            this.startDrawing();
        },
        startDrawingFromCoordinates: function () {
            this.setShapeFromCoordinates([
                { "lat": 39.371075961814434, "lng": -76.63874717010572 },
                { "lat": 39.30469269255688, "lng": -76.69402213348462 },
                { "lat": 39.28450517580149, "lng": -76.6184159361967 },
                { "lat": 39.29460789548524, "lng": -76.54486967543221 },
                { "lat": 39.34294263864609, "lng": -76.56159602042521 }
            ]);
        },
        setShapeFromCoordinates: function (triangleCoords) {

            window.currentShape = new google.maps.Polygon({
                paths: triangleCoords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.10,
                editable: true,
            });
            window.currentShape.setMap(window.map);
        },
        initGoogleMap: function () {

            var latlng = new google.maps.LatLng(39.305, -76.617);
            window.map = new google.maps.Map(document.getElementById('map-placeholder'), {
                center: latlng,
                zoom: 12
            });

            var polyOptions = {
                strokeWeight: 0,
                fillOpacity: 0.45,
                editable: true,
                draggable: true
            };


            window.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                markerOptions: {
                    draggable: true
                },
                polylineOptions: {
                    editable: true,
                    draggable: true
                },
                rectangleOptions: polyOptions,
                circleOptions: polyOptions,
                polygonOptions: polyOptions,
                map: window.map,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: []
                }

            });

            this.disableDrawing();

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
                window.currentShape = e.overlay;
                window.currentShape.type = e.type;
                if (e.type !== google.maps.drawing.OverlayType.MARKER) {
                    window.drawingManager.setDrawingMode(null);
                }
            });
        }
    }
}