$(function () {

    window.callScriptTimeoutId = 1;
    window.callScript = function () {

        var self = {};

        self.init = async function () {
            $('#summernote').summernote({
                toolbar: [
                    ['style', ['style', 'bold', 'italic', 'underline', 'clear', 'ol', 'ul']],
                    ['font', ['fontsize', 'color', 'strikethrough', 'superscript', 'subscript']],
                    ['font', ['fontname']],
                    ['para', ['paragraph']],
                    ['insert', ['link', 'table', 'picture', 'hr', 'video']], // image and doc are customized buttons
                    ['misc', ['codeview', 'fullscreen', 'undo', 'redo']],
                ],
                callbacks: {
                    onChange: self.changedContent
                }
            });
        };

        self.changedContent = async function (content, item) {
            await utils.wait(500, window.callScriptTimeoutId)
            $.ajax({
                method: "POST",
                data: { content: content },
                url: "/Script/SaveScript"
            });
        }

        self.init();

        return self;


    }();
})