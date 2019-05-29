$(function () {

    window.costingTemplates = new Vue({
        el: ".costing-templates-page",
        data: function () {
            return {
                items: $(".costing-templates-page").data("items")
            }
        },
        methods: {
            saveItem: async function (element) {
                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(element),
                    url: "/CostingTemplates/Save",
                    dataType: "JSON"
                });
                return result;
            },
            async addItem() {
                var el = {
                    "Name": "_Новая статья затрат",
                    "Unit": 1,
                    "CategoryId": 1,
                    "Qty": 1,
                    "Cost": null,
                    "Total": null,
                    "DateCreate": moment().format("DD.MM.YYYY"),
                    "DateModify": moment().format("DD.MM.YYYY"),
                    "Id": 0
                };

                let saved = await this.saveItem(el);
                this.items.push(saved);
                await utils.wait(20);
                this.items = _.sortBy(this.items, function (x) { return x.CategoryId + "_" + x.Name; });
                await utils.wait(200);
                $(".element_" + saved.Id + " input[type='text']:first").focus();
            },
            async  removeItem(element) {
                let result = confirm("Хотите удалить шаблон?");
                if (result == true) {
                    await $.ajax({
                        method: "GET",
                        contentType: "application/json",
                        url: "/CostingTemplates/Delete?id=" + element.Id
                    });
                    this.items = this.items.filter(x => x.Id !== element.Id);
                };

            }
        },
        async mounted() {
            this.items = _.sortBy(this.items, function (x) { return x.CategoryName + "_" + x.Name; });
        },
        watch: {
        },
        computed: {
        }
    });

})