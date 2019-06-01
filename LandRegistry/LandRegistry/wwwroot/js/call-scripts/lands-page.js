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
                    take: 200
                },
                currentPage: 1
            }
        },
        methods: {
            newLand() {
                this.startDrawing();
            },
            viewLand(id) {
                this.centeringShape(id);
            },
            async editLand(id) {
                editLandModal.open(id);
                await utils.wait(200);
                this.centeringShape(id);
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
            setHighlightedRow(id, higlighted) {
                let foundItem = this.items.filter(x => x.Id === id)[0];
                if (!!foundItem)
                    foundItem.Active = higlighted;
            },
            overRow(id) {
                this.setShapeColor(id, "#0000FF", 0.7);
                this.setHighlightedRow(id, true);
            },
            outRow(id) {
                if (!editLandModal.visible) {
                    this.setShapeColor(id, "#0000FF", 0.1);
                    this.setHighlightedRow(id, false);
                }
            },
            scrollToItem(id) {
                var rows = document.querySelectorAll('.lands-table-body tr');
                let item = this.items.filter(x => x.Id === id)[0];
                let line = this.items.indexOf(item);
                rows[line].scrollIntoView({
                    behavior: 'auto',
                    block: 'center'
                });
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
                this.search(true);
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
