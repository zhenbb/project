<script>
export default {
    data() {
        return {
            questionsName: null,
            answersOptions: null,
            requiredField: false,
            species: false,
            formsId: sessionStorage.getItem('formsId'),
            formsQuestionsId: null,
            questionList: [],
            formsName: sessionStorage.getItem('formsName'),
            outline: sessionStorage.getItem('outline'),
            actionTime: sessionStorage.getItem('actionTime'),
            endTime: sessionStorage.getItem('endTime'),

        }
    },
    methods: {

        save() {
            //原本的寫法是下面註解的那樣 但是有時候會有錯誤
            if (this.questionsName == null || this.answersOptions == null || this.species == null) {
                alert("所有欄位皆須填寫完整")
                return
            }
            // if (!this.questionsName || !this.answersOptions || !this.species) {
            //     alert("所有欄位皆須填寫完整")
            //     return
            // }
            this.questionList.push({
                questionsName: this.questionsName,
                answersOptions: this.answersOptions,
                requiredField: this.requiredField,
                //formsQuestionsId: this.formsQuestionsId, 還沒新增前不會有這個值 所以可以不用寫
                species: +this.species,
            })
            console.log(this.questionList)
            this.questionsName = "",
                this.answersOptions = "",
                this.requiredField = false,
                this.species = false
        },
        clearQuestion(index) {
            this.questionList.splice(index, 1); // 移除第幾個元素,從這個元素開始刪幾筆
        },

        modifyQuestion(index) {
            //this.formsQuestionsId = this.questionList[index].formsQuestionsId,  還沒新增前不會有這個值 所以可以不用寫
            this.questionsName = this.questionList[index].questionsName,
                this.answersOptions = this.questionList[index].answersOptions,
                this.requiredField = this.questionList[index].requiredField,
                this.species = this.questionList[index].species

            this.questionList.splice(index, 1); // 移除第幾個元素,從這個元素開始刪幾筆
        },

        formAndQuestionAdd() {
            const addFormsBody = {
                forms: {
                    formsName: this.formsName,
                    outline: this.outline,
                    actionTime: this.actionTime,
                    endTime: this.endTime,
                }
            }
            fetch("http://localhost:8080/addForms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(addFormsBody),
            })
                .then(response => response.json())
                .then(data => {
                    // sessionStorage.setItem('formsId', data.form.formsId)
                    // console.log(...this.questionList)
                    const addQuestionBody = {
                        formsDetails: [
                            ...this.questionList,
                        ],
                    }
                    console.log(222, addQuestionBody)
                    fetch("http://localhost:8080/addQuestions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(addQuestionBody),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            alert(data.message)
                            this.$router.push('/backGroundPage')
                        })

                })
        }
    }
}
</script>

<template>
    <ul class="formsAddMenu">
        <li>
            <RouterLink to="/formAdd" class="pageSearch">問卷</RouterLink>
            <RouterLink to="/formQuestionAdd" class="pageSearch nowPage">題目</RouterLink>
        </li>

        <ul class="questionBox">
            <li>
                問題
                <input type="text" v-model="questionsName">
                <input type="checkbox" v-model="requiredField">是否為必填
                <input type="radio" value="0" v-model="species">單選
                <input type="radio" value="1" v-model="species">多選
            </li>
            <li>選項
                <input type="text" v-model="answersOptions">
                (多個答案以,作為分隔)
                <button type="button" class="questionAddBtn" @click="save">加入</button>
            </li>
        </ul>


        <div class="questionDetailsList">

            <ul>編號
                <li v-for="(item, index) in questionList">
                    {{ index + 1 }}
                </li>

            </ul>
            <ul>問題
                <li v-for="(item) in questionList">
                    {{ item.questionsName }}
                </li>
            </ul>
            <ul>種類(單選多選)
                <li v-for="(item) in questionList">
                    {{ item.species === 0 ? '單選' : '多選' }}
                </li>
            </ul>
            <ul>是否必填
                <li v-for="(item) in questionList">
                    {{ item.requiredField }}
                </li>
            </ul>
            <ul>詳細資訊
                <li v-for="(item) in questionList">
                    {{ item.answersOptions }}
                </li>
            </ul>
            <ul>編輯
                <li v-for="(item, index) in questionList">
                    <button type="button" class="clearBtn" @click="modifyQuestion(index)">檢視</button>
                </li>
            </ul>
            <ul>刪除
                <li v-for="(item, index) in questionList">
                    <button type="button" class="clearBtn" @click="clearQuestion(index)">取消</button>
                </li>
            </ul>
        </div>
        <button type="button" class="questionAddBtn" @click="formAndQuestionAdd">新增問卷及題目</button>
    </ul>
</template>

<style lang="scss" scoped>
body {
    position: relative;
}

.formsAddMenu {
    position: absolute;
    top: 35%;
    left: 35%;
    transform: translateY(-50%), translateX(-50%);

}

.nowPage {
    font-style: oblique;
}

.questionBox {
    width: 600px;
    background-color: pink;
    margin-bottom: 5px;

    li {
        padding: 5px;
    }


    .questionAddBtn {
        margin-left: 100px;
    }
}

.questionDetailsList {
    display: flex;
    justify-content: left;
    background-color: white;
    margin-top: 5px;


    ul {
        margin: 10px 20px;
        font-weight: bold;
    }

    li {
        margin-top: 10px;
        line-height: 1.5;
    }
}

.backGroundIcon {


    .trashBtn {
        font-size: 24px;
        color: black;
        cursor: pointer;
    }
}

.pageSearch {
    margin: 0 5px;
    color: rgb(142, 35, 35);
    font-weight: bold;
    cursor: pointer;
    background-color: pink;
    padding: 5px;

    &:hover {
        background-color: white;
        color: black;
    }
}
</style>


