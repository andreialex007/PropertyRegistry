$(function () {

    window.landsPage = new Vue({
        el: ".lands-page",
        data: function () {
            return {

                selectedQuestionId: null
            }
        },
        methods: {

        },
        computed: {

        },
        async mounted() {

        }
    });


})

window.initMap = function () {
    window.map = new google.maps.Map(document.getElementById('map-placeholder'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });
};