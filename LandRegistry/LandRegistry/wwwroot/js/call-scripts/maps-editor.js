window.initMap = function () {

    window.mapApi = function () {
        let self = {};

        self.init = async function () {

            await utils.wait(200);

            var latlng = new google.maps.LatLng(39.305, -76.617);
            window.map = new google.maps.Map(document.getElementById('map-placeholder'), {
                center: latlng,
                zoom: 12
            });

            window.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
                },
                markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
                circleOptions: {
                    fillColor: '#ffff00',
                    fillOpacity: 1,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1
                }
            });
            drawingManager.setMap(window.map);
        }

        self.init();

        return self;
    }();


};