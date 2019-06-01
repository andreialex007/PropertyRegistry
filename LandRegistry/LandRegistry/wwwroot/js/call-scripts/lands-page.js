$(function () {

    let hasStoredConfig = !!localStorage.landsListColumnsConfig;

    window.landsPage = new Vue({
        mixins: [window.mapManagerMixIn],
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
                this.startDrawing();
            },
            viewLand(id) {
                this.centeringShape(id);
                editLandModal.open(id);
            },
            async deleteLand(id) {
                let result = await Swal.fire({
                    type: 'question',
                    title: 'Действительно хотите удалить участок?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Да, удалить!',
                    cancelButtonText: 'Нет!'
                });

                if (result.value === true) {
                    await $.ajax({
                        method: "GET",
                        contentType: "application/json",
                        url: "/Home/DeleteLand?id=" + id
                    });

                    this.search();
                }
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

                await utils.wait(200);

                this.addAllLandShapes();
            }
        },
        watch: {
            'config.take': function () {
                this.search();
            }
        },
        computed: {
            totalPages() {
                let number = Math.floor(this.totalRecords / this.config.take);
                number += this.totalRecords % this.config.take === 0 ? 0 : 1;
                return number;
            }
        },
        async mounted() {
            this.search();
        }
    });

});
