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
            changePage(pageNumber) {
                this.config.skip = (pageNumber - 1) * this.config.take;
                this.search();
            },
            async search(reset) {

                var params = {};

                if (reset) {
                    this.config.skip = 0;
                }

                params.Take = this.config.take;
                params.Skip = this.config.skip;

                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(params),
                    url: "/Home/Search"
                });

                this.items = result.items;
                this.totalRecords = result.total;
                this.filteredRecords = result.filtered;
            }
        },
        watch: {
            'config.take': function () {
                this.search();
            }
        },
        computed: {
            totalPages() {
                let number = this.totalRecords / this.config.take;
                number += this.totalRecords % this.config.take == 0 ? 0 : 1;
                return number;
            }
        },
        async mounted() {
            this.search();
        }
    });

});

window.initMap = function () {
    window.map = new google.maps.Map(document.getElementById('map-placeholder'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });
};