window.initMap = function () {

    window.mapApi = function () {
        let self = {};

        self.currentShape = null;

        self.disableDrawing = function () {
            window.drawingManager.setMap(null);
            if (!!self.currentShape) {
                self.currentShape.setMap(null);
                self.currentShape = null;
            }
        }

        self.startDrawing = function () {
            window.drawingManager.setMap(window.map);
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        }

        self.startDrawingFromCoordinates = function () {
            self.setShapeFromCoordinates([
                { lat: 25.774, lng: -80.190 },
                { lat: 18.466, lng: -66.118 },
                { lat: 32.321, lng: -64.757 }
            ]);
        }

        self.getShapeCoordinates = function () {
            return mapApi.currentShape.getPath().getArray().map(x => ({ lat: x.lat(), lng: x.lng() }));
        }

        self.setShapeFromCoordinates = function (triangleCoords) {
            
            self.currentShape = new google.maps.Polygon({
                paths: triangleCoords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.10,
                editable: true,
            });
            self.currentShape.setMap(window.map);

        }

        self.init = async function () {
            setTimeout(function () {
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

                self.disableDrawing();



                google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
                    self.currentShape = e.overlay;
                    self.currentShape.type = e.type;
                    if (e.type !== google.maps.drawing.OverlayType.MARKER) {
                        drawingManager.setDrawingMode(null);
                    }
                });
            },
                200);
        }

        self.init();

        return self;
    }();


};