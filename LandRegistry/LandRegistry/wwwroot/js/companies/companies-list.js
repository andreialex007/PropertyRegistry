$(function () {

    var columnsObj = {};
    let cols = ["Id", "Name", "ActivityType", "WebSites", "Remarks", "PhoneNumbers", "StateId", "LastCallRecordDate"];
    for (let el of cols) {
        columnsObj[el] = {
            sorting: "",
            filter: ""
        };
    }

    let hasStoredConfig = !!localStorage.companiesListColumnsConfig;

    window.companiesList = new Vue({
        el: ".companies-list-page",
        data: function () {
            return {
                items: [],
                config: hasStoredConfig ? JSON.parse(localStorage.companiesListColumnsConfig) : {
                    columns: columnsObj,
                    skip: 0,
                    take: 50
                },
                totalRecords: 0,
                filteredRecords: 0,
                isLoading: false,
                isEndofList: false
            }
        },
        methods: {
            applySorting(column) {
                let sorting = column.sorting;
                for (let item in this.config.columns) {
                    this.config.columns[item].sorting = "";
                }
                column.sorting = sorting === "asc" ? "desc" : "asc";

                this.doSearch(true);
            },
            openDblClick(item) {
                var win = window.open("/Companies/Edit/" + item.Id, '_blank');
                win.focus();
            },
            async doSearch(reset) {


                if (reset) {
                    this.config.skip = 0;
                }

                var params = {};
                for (let item in this.config.columns) {
                    let column = this.config.columns[item];
                    params[item] = column.filter;
                    if (!!column.sorting) {
                        params.OrderBy = item;
                        params.IsAsc = column.sorting == "asc";
                    }
                }
                params.LastCallRecordDateFrom = this.config.columns.LastCallRecordDate.filterFrom;
                params.LastCallRecordDateTo = this.config.columns.LastCallRecordDate.filterTo;
                params.Take = this.config.take;
                params.Skip = this.config.skip;

                this.isLoading = true;

                localStorage.setItem("companiesListColumnsConfig", JSON.stringify(companiesList.config));
                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(params),
                    url: "/Companies/Search"
                });

                this.isLoading = false;

                this.items = reset ? result.items : this.items.concat(result.items);
                this.totalRecords = result.total;
                this.filteredRecords = result.filtered;
                this.isEndofList = this.items.length >= this.totalRecords || result.items.length < this.config.take;

            },
            loadMore() {
                this.config.skip += this.config.take;
                this.doSearch();
            },
            clearSearch() {
                for (let item in this.config.columns) {
                    this.config.columns[item].filter = "";
                    this.config.columns.LastCallRecordDate.filterFrom = "";
                    this.config.columns.LastCallRecordDate.filterTo = "";
                }
                this.doSearch(true);
            },
            async  deleteCompany(company) {
                let isDelete = confirm("Хотите удалить?");
                if (isDelete) {
                    await $.ajax({
                        method: "GET",
                        contentType: "application/json",
                        url: "/Companies/DeleteCompany?id=" + company.Id
                    });
                    this.doSearch(true);
                }
            }
        },
        async mounted() {

            if (!hasStoredConfig) {
                this.config.columns.Id.sorting = "asc";
                this.config.columns.LastCallRecordDate.filterFrom = "";
                this.config.columns.LastCallRecordDate.filterTo = "";
            }

            let vm = this;

            $('.from-date').datepicker({
                autoClose: true,
                timepicker: true,
                timeFormat:"hh:ii",
                onSelect: function (value) { vm.config.columns.LastCallRecordDate.filterFrom = value; }
            });

            $('.to-date').datepicker({
                autoClose: true,
                timepicker: true,
                timeFormat: "hh:ii",
                onSelect: function (value) { vm.config.columns.LastCallRecordDate.filterTo = value; }
            });

            await utils.wait(100);

            this.doSearch();
        }
    });

})