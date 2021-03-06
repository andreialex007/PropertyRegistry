﻿$(function () {
    window.editLandModal = new Vue({
        el: ".edit-land-modal",
        data: function () {
            return {
                loading: false,
                visible: false,
                landId: 0,
                readOnly: true,
                entity: {

                }
            }
        },
        methods: {
            async create(coordinates) {
                await this.open(0);
                this.entity.Coordinates = coordinates;
            },
            async open(landId) {

                this.loading = true;
                let result = await $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/Home/LoadLand?id=" + landId
                });
                this.loading = false;

                this.entity = result;

                this.landId = landId;
                this.readOnly = this.landId !== 0;
                this.visible = true;

                await utils.wait(100);
                landsPage.setHighlightedRow(landId, true);
            },
            edit() {
                this.readOnly = false;
            },
            close() {
                landsPage.setHighlightedRow(this.entity.Id, false);
                landsPage.setShapeColor(this.entity.Id, "#0000FF", 0.1);
                this.visible = false;
                landsPage.disableDrawing();
            },
            async save() {

                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(this.entity),
                    url: "/Home/SaveLand"
                });
                toastr.success("Участок успешно сохранен.");
                window.landsPage.search();
                this.close();
                landsPage.disableDrawing();
                landsPage.setShapeColor(result.Id, "#0000FF", 0.7);
                landsPage.setHighlightedRow(result.Id, true);
            },
            async fileSelected(item) {
                let result = await utils.getBase64(item.target.files[0]);
                this.entity.DocumentBase64 = result;
                this.entity.DocumentOnLandFileName = item.target.files[0].name;
            },
            downloadFile() {
                utils.downloadURI(this.entity.DocumentBase64, this.entity.DocumentOnLandFileName);
            },
            removeFile() {
                this.entity.DocumentBase64 = null;
                this.entity.DocumentOnLandFileName = null;
                this.entity.DocumentOnLand = null;
                $("input[type='file']").val("");
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
