﻿$(function () {

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
            newLand() {
                editLandModal.open(0);
            },
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

    window.editLandModal = new Vue({
        el: ".edit-land-modal",
        data: function () {
            return {
                visible: false,
                landId: 0,
                entity: {

                }
            }
        },
        methods: {
            changePage(pageNumber) {

            },
            async search(reset) {

            },
            open(landId) {



                this.landId = landId;
                this.visible = true;
            },
            close() {
                this.visible = false;
            },
            save() {
                this.close();
            }
        },
        watch: {

        },
        computed: {

        },
        async mounted() {

        }
    });

});

