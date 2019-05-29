function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}



$(function () {



    Vue.directive('mask',
        {
            bind: function (el, binding) {
                window.Inputmask(binding.value).mask(el);
            }
        });


    window.editCompany = new Vue({
        el: ".company-edit-page",
        mixins: [window.quotesManagement],
        data: function () {
            return {
                entity: {
                    Id: location.pathname.split('/')[3],
                    Phones: [],
                    Records: [],
                    StateId: 0
                },
                errorsView: "",
                activeTab: "log",
                callDescription: "",
                selectedPhoneId: null,
                currentTab: "main"
            }
        },
        computed: {
            callToNumber() {
                let object = this.entity.Phones.filter(x => x.Id == editCompany.selectedPhoneId)[0];
                if (!object)
                    return "";
                let number = object.Number;
                return "callto:" + number.replace(/\D+/g, '');
            }
        },
        methods: {
            async save() {
                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(this.entity),
                    url: "/Companies/Save"
                });
                if (this.entity.Id == 0) {
                    location.href = "/Companies/Edit/" + result.Id;
                    return;
                }
                if (result.StateId == null) {
                    result.StateId = 0;
                }
                this.entity = result;
            },
            async load() {

            },
            addPhone() {
                window.editPhoneModal.entity.CompanyId = this.entity.Id;
                window.editPhoneModal.open();
            },
            editPhone(item) {
                window.editPhoneModal.entity = JSON.parse(JSON.stringify(this.entity.Phones.filter(x => x.Id == editCompany.selectedPhoneId)[0]));
                window.editPhoneModal.open();
                window.editPhoneModal.isComplete = true;
            },
            copyPhone() {
                let number = this.entity.Phones.filter(x => x.Id == editCompany.selectedPhoneId)[0].Number;
                copyTextToClipboard(number);
            },
            async removePhone(item) {
                let result = confirm("Хотите удалить телефон, все записи связанные с телефоном будут удалены!");
                if (result == true) {
                    await $.ajax({
                        method: "GET",
                        contentType: "application/json",
                        url: "/Companies/DeletePhone?id=" + this.selectedPhoneId
                    });
                    this.entity.Phones = this.entity.Phones.filter(x => x.Id != this.selectedPhoneId);
                };

                this.selectedPhoneId = this.entity.Phones.length == 0 ? "" : this.entity.Phones[0].Id + "";
            },
            async saveRecord() {
                if (!this.selectedPhoneId) {
                    return;
                }


                let newRecord = await $.ajax({
                    method: "POST",
                    data: { description: this.callDescription, phoneId: this.selectedPhoneId },
                    url: "/Companies/AddRecord"
                });
                this.entity.Records = [newRecord].concat(this.entity.Records);
                this.callDescription = "";
            }
        },
        async mounted() {

            let vm = this;



            window.onPhoneChange = function () {
                let entity = window.editPhoneModal.entity;
                vm.entity.Phones = vm.entity.Phones.filter(x => x.Id !== entity.Id);
                vm.entity.Phones.push(entity);
                vm.entity.Phones = _.sortBy(vm.entity.Phones, function (x) { return x.Number; });
                if (!vm.selectedPhoneId) {
                    vm.selectedPhoneId = entity.Id;
                }
            }

            let result = await $.ajax({
                method: "GET",
                url: "/Companies/Load?id=" + this.entity.Id
            });

            if (result.errorsView) {
                this.errorsView = result.errorsView;
                return;
            }

            if (result.StateId == null) {
                result.StateId = 0;
            }
            this.entity = result;

            if (this.entity.Phones.length !== 0) {
                this.selectedPhoneId = this.entity.Phones[0].Id + "";
            }

            this.initQuotesManagement();
        }
    });

    let defaultPhoneEntity = {
        Number: "8 (___) ___-__-__",
        Remarks: "Общий",
        CompanyId: null,
        Id: 0
    };

    window.editPhoneModal = new Vue({
        el: ".edit-phone-modal",
        data: function () {

            return {
                isComplete: false,
                visible: false,
                hasDuplicates: false,
                duplicate: { number: "", company: "" },
                companyEditLink: "",
                entity: JSON.parse(JSON.stringify(defaultPhoneEntity))
            }
        },
        methods: {
            open() {
                this.visible = true;

                setTimeout(function () {
                    $(".phone-input").focus();
                }, 100);
            },
            close() {
                this.visible = false;
            },
            async save() {
                if (!this.isReadyForSave)
                    return;

                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(this.entity),
                    url: "/Companies/EditPhone"
                });

                this.entity = result;
                window.onPhoneChange();
                this.close();

                this.entity = JSON.parse(JSON.stringify(defaultPhoneEntity));
            },
            maskCheck: function (field) {
                this.isComplete = field.target.inputmask.isComplete();
                this.entity.Number = $(field.target).val();
                if (!this.isComplete) {
                    this.hasDuplicates = false;
                }
            }
        },
        computed: {
            isReadyForSave: function () {
                return !this.hasDuplicates && this.isValid;
            },
            isValid: function () {
                return !!this.entity.Remarks && this.isComplete;
            }
        },
        watch: {
            'entity.Number': async function () {

                if (!this.isComplete)
                    return;

                let result = await $.ajax({
                    method: "GET",
                    url: "/Companies/FindPhoneDuplicate?id=" + this.entity.Id + "&phone=" + this.entity.Number
                });

                this.hasDuplicates = result.hasDuplicate;
                if (this.hasDuplicates) {
                    this.duplicate.number = result.number;
                    this.duplicate.company = result.company;
                    this.companyEditLink = "/Companies/Edit/" + result.CompanyId;
                }
            }
        }
    });


})