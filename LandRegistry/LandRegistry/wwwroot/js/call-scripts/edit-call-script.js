$(function () {

    window.editScript = new Vue({
        el: ".edit-script-page",
        data: function () {
            return {
                entity: $(".edit-script-page").data("json"),
                selectedQuestionId: null
            }
        },
        methods: {
            savePage() {
                $("form").submit();
            },
            addQuestion() {
                window.editQuestionModal.$data.Text = "Новый вопрос";
                window.editQuestionModal.$data.Id = 0;
                window.editQuestionModal.$data.CallScriptId = this.entity.Id;
                window.editQuestionModal.show();
            },
            editQuestion(item) {
                Object.assign(window.editQuestionModal.$data, item);
                window.editQuestionModal.show();
            },
            addAnswer() {
                window.editAnswerModal.$data.Text = "Новый ответ";
                window.editAnswerModal.$data.Id = 0;
                window.editAnswerModal.$data.FromQuestionId = this.selectedQuestion.Id;
                window.editAnswerModal.$data.ToQuestionId = null;
                window.editAnswerModal.$data.questions = this.questionsExceptSelf(this.selectedQuestion.Id);
                window.editAnswerModal.show();
            },
            editAnswer(item) {
                Object.assign(window.editAnswerModal.$data, item);
                window.editAnswerModal.$data.questions = this.questionsExceptSelf(this.selectedQuestion.Id);
                window.editAnswerModal.show();
            },
            questionsExceptSelf(questionId) {
                return this.entity.CallQuestions.filter(x => x.Id !== questionId);
            },
            async deleteQuestion(id) {
                let isDelete = confirm("Хотите удалить?");
                if (isDelete) {
                    await $.ajax({
                        method: "GET",
                        contentType: "application/json",
                        url: "/CallScripts/DeleteQuestion?id=" + id
                    });
                    this.load();
                }
            },
            async deleteAnswer(id) {
                let isDelete = confirm("Хотите удалить?");
                if (isDelete) {
                    await $.ajax({
                        method: "GET",
                        contentType: "application/json",
                        url: "/CallScripts/DeleteAnswer?id=" + id
                    });
                    this.load();
                }
            },
            async  load() {
                let result = await $.ajax({
                    method: "GET",
                    url: "/CallScripts/Load?id=" + window.editScript.entity.Id,
                    dataType: "JSON"
                });
                window.editScript.$data.entity = result;
            }
        },
        computed: {
            isEmptyName: function () {
                return !this.entity.Name || !this.entity.Name.trim();
            },
            selectedQuestion() {
                if (!this.selectedQuestionId)
                    return null;
                let entity = this.entity.CallQuestions.filter(x => x.Id == this.selectedQuestionId)[0];
                return entity;
            }
        },
        async mounted() {

            await utils.wait(300);

            let updateFunc = async function (item) {
                window.editScript.load();
            };
            window.editAnswerModal.saveCompleted = updateFunc;
            window.editQuestionModal.saveCompleted = updateFunc;
        }
    });

    window.editQuestionModal = new Vue({
        el: ".edit-question-modal",
        data: function () {
            return {
                Id: 0,
                Text: "Новый вопрос",
                visible: false,
                saveCompleted: function () { }
            }
        },
        methods: {
            async  save() {
                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(this.$data),
                    url: "/CallScripts/EditQuestion",
                    dataType: "JSON"
                });
                this.$data.Id = result.Id;
                this.saveCompleted(result);
                this.close();
            },
            close() {
                this.visible = false;
            },
            show() {
                setTimeout(function () {
                    $(".question-text").focus();
                }, 100);
                this.visible = true;
            }
        },
        computed: {
            isEmptyName: function () {
                return !this.Text || !this.Text.trim();
            },
        },
        async mounted() {

        }
    });

    window.editAnswerModal = new Vue({
        el: ".edit-answer-modal",
        data: function () {
            return {
                Id: 0,
                Text: "Новый ответ",
                ToQuestionId: null,
                visible: false,
                saveCompleted: function () { },
                questions: []
            }
        },
        methods: {
            async  save() {

                if (this.$data.ToQuestionId === "null") {
                    this.$data.ToQuestionId = null;
                }

                let result = await $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(this.$data),
                    url: "/CallScripts/EditAnswer",
                    dataType: "JSON"
                });
                this.$data.Id = result.Id;
                this.saveCompleted(result);
                this.close();
            },
            close() {
                this.visible = false;
            },
            show() {
                setTimeout(function () {
                    $(".question-text").focus();
                }, 100);
                this.visible = true;
            }
        },
        computed: {
            isEmptyName: function () {
                return !this.Text || !this.Text.trim();
            },
        },
        async mounted() {

        }
    });

})