$(function () {

    window.editQuoteTemplate = new Vue({
        el: ".edit-quote-template",
        data: function () {
            return {
                ...$(".edit-quote-template").data("json"),
                showOnlyChecked: true
            };
        },
        mounted() {
            autosize($('textarea'));
        },
        watch: {
            CustomDesign: function (newVal) {
                console.log("design=" + newVal);
                this.setCustomDesign(newVal);
            }
        },
        computed: {
            isEmptyName: function () {
                return !this.Name || !this.Name.trim();
            }
        },
        methods: {
            getRelation(costing) {
                return this.QuoteCostingRelations.filter(x => x.CostingTemplateId === costing.Id)[0];
            },
            checkCosting(costing) {
                let relation = this.getRelation(costing);
                if (!!relation) {
                    this.deleteRelation(costing);
                } else {
                    this.addRelation(costing);
                }
            },
            calcWithMultiplier(costing) {
                let relation = this.getRelation(costing);
                let multiplier = !relation ? 1 : relation.Multiplier;
                return (costing.Total * multiplier).toFixed(0);
            },
            isCheckedCosting(costing) {
                return !!this.getRelation(costing);
            },
            async addRelation(costing) {
                var newRelation = {
                    QuoteTemplateId: this.Id,
                    QuoteTemplate: null,
                    CostingTemplateId: costing.Id,
                    CostingTemplate: null,
                    Multiplier: 1
                }

                var result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(newRelation),
                    url: "/QuoteTemplates/AddRelation",
                    dataType: "JSON"
                });
                this.Total = result.total;
                this.TotalHours = result.totalHours;
                this.QuoteCostingRelations.push(newRelation);
            },
            async deleteRelation(costing) {
                let relation = this.getRelation(costing);

                var result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        QuoteTemplateId: relation.QuoteTemplateId,
                        CostingTemplateId: relation.CostingTemplateId
                    }),
                    url: "/QuoteTemplates/DeleteRelation",
                    dataType: "JSON"
                });
                this.Total = result.total;
                this.TotalHours = result.totalHours;
                this.QuoteCostingRelations = this.QuoteCostingRelations.filter(x => x.CostingTemplateId !== costing.Id);
            },
            async setMultiplier(costing) {

                let relation = this.getRelation(costing);

                var result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        QuoteTemplateId: relation.QuoteTemplateId,
                        Multiplier: relation.Multiplier,
                        CostingTemplateId: relation.CostingTemplateId
                    }),
                    url: "/QuoteTemplates/SetMultiplier",
                    dataType: "JSON"
                });
                this.Total = result.total;
                this.TotalHours = result.totalHours;
            },
            async setCustomDesign(isCustom) {
                var result = await $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/QuoteTemplates/SetCustomDesign?id=" + this.Id + "&isCustomDesign=" + isCustom,
                    dataType: "JSON"
                });
                this.Total = result.total;
                this.CustomDesignTotal = result.customDesignTotal;
                this.TotalHours = result.totalHours;
            },
            saveTemplate() {
                $("form").submit();
            }
        }
    });


});