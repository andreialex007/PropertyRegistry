$(function () {


    let salaryPerHour = $(".company-edit-page").data("basic-price-per-hour");

    let defaultCosting = {
        Id: 0,
        Name: "",
        Unit: 1,
        Qty: 1,
        Cost: salaryPerHour,
        Total: "",
        Multiplier: 1,
        CategoryId: 1
    };

    window.quotesManagement = {
        data: function () {
            return {
                managementProperty: "",
                newCosting: {
                    ...defaultCosting
                },
                basicSalaryPerHour: salaryPerHour
            }
        },
        computed: {
            addCostingBtnActive() {
                return this.costingValid(this.newCosting);
            }
        },
        methods: {
            initQuotesManagement: function () {
                for (let el of this.entity.Quotes) {
                    this.addSelect2ToQuote(el);
                }
            },
            async newQuote() {
                let newQuote = await $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/Companies/NewEmptyQuote?companyId=" + this.entity.Id
                });

                this.entity.Quotes.push(newQuote);
                this.addSelect2ToQuote(newQuote);
            },
            renameQuote(quote) {
                $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/Companies/RenameQuote?quoteId=" + quote.Id + "&name=" + encodeURIComponent(quote.Name)
                });
            },
            async addCosting(quote) {
                let costing = this.newCosting;
                costing.QuoteId = quote.Id;

                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(costing),
                    url: "/Companies/SaveCosting"
                });

                Object.assign(quote, result);
                quote.Opened = true;

                this.newCosting = {
                    ...defaultCosting
                };
            },
            async costingChanged(costing, quote) {
                if (!this.costingValid(costing))
                    return;
                if (!costing.Cost && costing.Unit == 1 /* часы */) {
                    costing.Cost = this.basicSalaryPerHour;
                }
                if (costing.Id === 0) {
                    return;
                }
                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(costing),
                    url: "/Companies/SaveCosting"
                });

                Object.assign(quote, result);
                quote.Opened = true;
            },
            async designChanged(quote) {
                let result = await $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/Companies/ChangeDesign?quoteId=" + quote.Id + "&individualDesign=" + quote.CustomDesign
                });

                Object.assign(quote, result);
                quote.Opened = true;
            },
            getMultiplierTotal(costing) {
                if (!costing.Total) return 0;
                if (!costing.Multiplier) return 0;
                return costing.Total * costing.Multiplier;
            },
            getQtyTotal(costing) {
                if (!costing.Qty) return 0;
                if (!costing.Multiplier) return 0;
                return costing.Qty * costing.Multiplier;
            },
            calcTotal(costing) {
                if (!costing.Qty) return 0;
                if (!costing.Cost) return 0;

                costing.Total = costing.Cost * costing.Qty;
                return costing.Total;
            },
            async deleteCosting(costing, quote) {

                let confirmed = confirm("Хотите удалить затрату?");
                if (!confirmed)
                    return;

                let result = await $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/Companies/DeleteCosting?id=" + costing.Id
                });
                Object.assign(quote, result);
                quote.Opened = true;
            },
            costingValid(costing) {
                if (!costing.Name) return false;
                if (!costing.Qty) return false;
                if (!costing.Multiplier) return false;
                return true;
            },
            async  addQuoteFromTemplate(templateId) {
                let newQuote = await $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/Companies/AddQuoteFromTemplate?templateId=" + templateId + "&companyId=" + this.entity.Id
                });

                this.entity.Quotes.push(newQuote);
            },
            async deleteQuote(id) {
                let confirmed = confirm("Хотите удалить смету?");
                if (!confirmed)
                    return;

                await $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/Companies/DeleteQuote?id=" + id
                });
                this.entity.Quotes = this.entity.Quotes.filter(x => x.Id !== id);
            },
            async addSelect2ToQuote(quote) {
                var vm = this;
                await utils.wait(200);
                $(".costings-template-select-" + quote.Id).select2({
                    dropdownAutoWidth: true
                }).on("select2:select",
                    function () {
                        vm.addCostingFromTemplate($(this).val(), quote);
                        $(this).val("").trigger("change");
                    });
            },
            async addCostingFromTemplate(costingTemplateId, quote) {
                let result = await $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/Companies/AddCostingFromTemplate?templateId=" + costingTemplateId + "&quoteId=" + quote.Id
                });
                Object.assign(quote, result);
                quote.Opened = true;
            }
        }
    };


})