
window.initMap = function () {
    setTimeout(function () {
        landsPage.initGoogleMap();

        google.maps.Polygon.prototype.getBounds = function () {
            var bounds = new google.maps.LatLngBounds();
            var paths = this.getPaths();
            var path;
            for (var i = 0; i < paths.getLength(); i++) {
                path = paths.getAt(i);
                for (var ii = 0; ii < path.getLength(); ii++) {
                    bounds.extend(path.getAt(ii));
                }
            }
            return bounds;
        }

        initMapLabel();
    },
        200);
};

window.landShapes = [];


function attachPolygonInfoWindow(polygon) {
    let center = polygon.getBounds().getCenter();

    var mapLabel2 = new MapLabel({
        text: "#" + polygon.content,
        position: center,
        map: window.map,
        fontSize: 15,
        align: 'right'
    });
    mapLabel2.set('position', center);
    polygon.label = mapLabel2;
}

window.mapManagerMixIn = {
    created: function () {

    },
    data: function () {
        return {
            isDrawingEnabled: false,
            shapeDrawn: false
        }
    },
    methods: {
        disableDrawing: async function () {
            this.isDrawingEnabled = false;
            this.shapeDrawn = false;
            window.drawingManager.setMap(null);
            this.deleteDrawShape();
        },
        deleteDrawShape() {
            if (!!window.currentShape) {
                window.currentShape.setMap(null);
                window.currentShape = null;
            }
        },
        startDrawing: async function () {
            window.drawingManager.setMap(window.map);
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
            this.deleteDrawShape();
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
            this.isDrawingEnabled = true;
            this.shapeDrawn = false;

            await utils.wait(10);
            $("[title='Выйти из режима рисования']").hide();
        },
        hideLandShapes() {
            for (let shape of window.landShapes) {
                shape.setVisible(false);
            }
        },
        addAllLandShapes() {
            for (let shape of window.landShapes) {
                shape.setMap(null);
                shape.label.setMap(null);
            }
            window.landShapes = [];

            for (let item of this.items) {
                let coordinates = item.Coordinates;
                let object = JSON.parse(coordinates);
                if (object === null)
                    continue;
                let shape = this.setShapeFromCoordinates(item.Id, object, false);
                attachPolygonInfoWindow(shape);
                window.landShapes.push(shape);
            }
        },
        getShapeCoordinates: function () {
            return window.currentShape.getPath().getArray().map(x => ({ lat: x.lat(), lng: x.lng() }));
        },
        applyShape() {
            let coordinates = JSON.stringify(this.getShapeCoordinates());
            editLandModal.create(coordinates);
        },
        clearMap: function () {
            this.disableDrawing();
            this.startDrawing();
        },
        centeringShape(id) {
            let foundShape = window.landShapes.filter(x => x.content === id)[0];
            if (!foundShape) {
                return;
            }
            window.map.fitBounds(foundShape.getBounds());
        },
        setShapeFromCoordinates: function (name, triangleCoords, editable) {
            if (editable === undefined) {
                editable = true;
            }
            let shape = new google.maps.Polygon({
                paths: triangleCoords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.10,
                editable: editable,
                content: name
            });
            google.maps.event.addListener(shape, 'click', function (event) {
                window.editLandModal.open(this.content);
            });
            google.maps.event.addListener(shape, "mouseover", function () {
                this.setOptions({ fillColor: "#00FF00" });
            });
            google.maps.event.addListener(shape, "mouseout", function () {
                this.setOptions({ fillColor: "#FF0000" });
            });

            shape.setMap(window.map);
            return shape;
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

            let vm = this;

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {

                console.log("overlay complete");

                vm.shapeDrawn = true;

                window.currentShape = e.overlay;
                window.currentShape.type = e.type;

                if (e.type !== google.maps.drawing.OverlayType.MARKER) {
                    window.drawingManager.setDrawingMode(null);
                }
            });
        }
    }
}