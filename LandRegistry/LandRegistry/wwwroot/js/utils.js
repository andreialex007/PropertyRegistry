Vue.filter('toNumber', function (number) {
    let format = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(number);
    console.log("number=" + number);
    console.log("format=" + format);
    return format;
});

$(function () {

    // Restricts input for the given textbox to the given inputFilter.
    window.setInputFilter = function (textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
            $(textbox).each(function (i, element) {
                element.addEventListener(event,
                    function () {
                        if (inputFilter(this.value)) {
                            this.oldValue = this.value;
                            this.oldSelectionStart = this.selectionStart;
                            this.oldSelectionEnd = this.selectionEnd;
                        } else if (this.hasOwnProperty("oldValue")) {
                            this.value = this.oldValue;
                            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                        }
                    });
            });
        });
    }

    setTimeout(function () {
        setInputFilter(document.getElementsByClassName("numbers-only"), function (value) {
            return /^\d*\.?\d*$/.test(value);
        });
    },
        100);

    window.utils = function () {

        var self = {};

        self.wait = function (ms, timeoutId) {
            if (!!timeoutId) {
                window.timeouts = window.timeouts || {};

                return new Promise(resolve => {
                    clearTimeout(window.timeouts[timeoutId]);
                    window.timeouts[timeoutId] = setTimeout(resolve, ms);
                });
            }
            return new Promise(resolve => setTimeout(resolve, ms));
        };

        self.doIfConfirm = function (link) {
            window.event.preventDefault();

            let href = $(link).attr("href");
            let result = confirm("Подтверждаете действие?");
            if (result) {
                location.href = href;
            }
        };

        return self;


    }();
})