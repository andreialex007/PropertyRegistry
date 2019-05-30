$(function () {

    let hasStoredConfig = !!localStorage.landsListColumnsConfig;

    window.landsPage = new Vue({
        el: ".lands-page",
        data: function () {
            return {
                items: [],
                totalRecords: 0,
                filteredRecords: 0,
                config: hasStoredConfig ? JSON.parse(localStorage.landsListColumnsConfig) : {
                    skip: 0,
                    take: 50
                }
            }
        },
        methods: {
            async search(reset) {

                var params = {};

                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(params),
                    url: "/Home/Search"
                });


            }
        },
        computed: {
        },
        async mounted() {

        }
    });

});

window.initMap = function () {
    window.map = new google.maps.Map(document.getElementById('map-placeholder'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });
};