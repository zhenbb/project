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
            if (this.questionsName == null || this.answersOptions == null || this.species == null) {
                alert("所有欄位皆須填寫完整")
                return
            }
            // if (!this.questionsName|| !this.answersOptions || !this.species ) {
            //     alert("所有欄位皆須填寫完整")
            //     return
            // }
            this.questionList.push({
                questionsName: this.questionsName,
                answersOptions: this.answersOptions,
                requiredField: this.requiredField,
                formsQuestionsId: this.formsQuestionsId,
                species: +this.species,
                formsId: this.formsId,
            })
            console.log(this.questionList)
            this.questionsName = "",
                this.answersOptions = "",
                this.requiredField = false,
                this.species = false,
                this.formsQuestionsId = null
        },

        modifyQuestion(index) {
            this.formsQuestionsId = this.questionList[index].formsQuestionsId,
                this.questionsName = this.questionList[index].questionsName,
                this.answersOptions = this.questionList[index].answersOptions,
                this.requiredField = this.questionList[index].requiredField,
                this.species = this.questionList[index].species

            this.questionList.splice(index, 1); // 移除第幾個元素,從這個元素開始刪幾筆
        },

        clearQuestion(index) {
            const deleteQuestionBody = {
                formsQuestionsId: this.questionList[index].formsQuestionsId
            }
            fetch("http://localhost:8080/questionDelete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(deleteQuestionBody),
            })
                .then(response => response.json())
                .then(data => {
                    // console.log(data.message);
                })
            this.questionList.splice(index, 1); // 移除第幾個元素,從這個元素開始刪幾筆
        },

        questionAddUpdate() {
            const addFormsBody = {
                forms: {
                    formsName: this.formsName,
                    outline: this.outline,
                    actionTime: this.actionTime,
                    endTime: this.endTime,
                    formsId: this.formsId,
                }
            }
            fetch("http://localhost:8080/updateForms", {
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
                    fetch("http://localhost:8080/updateQuestions", {
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

    },
    mounted() {
        const formsDetailsRequest = {
            formsId: this.formsId
        }
        console.log(1201, formsDetailsRequest)
        fetch("http://localhost:8080/findAllByformsId", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formsDetailsRequest),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                for (const detail of data.formsDetails) {
                    this.questionList.push({
                        questionsName: detail.questionsName,
                        answersOptions: detail.answersOptions,
                        requiredField: detail.requiredField,
                        formsQuestionsId: detail.formsQuestionsId,
                        species: +detail.species,
                        formsId: detail.formsId,
                    })
                }
            })
    }
}
</script>

<template>
    <ul class="formsAddMenu">
        <li>
            <RouterLink to="/formUpdate" class="pageSearch">修改問卷</RouterLink>
            <RouterLink to="/questionUpdate" class="pageSearch nowPage">修改題目</RouterLink>
            <RouterLink to="/answerGiveBack" class="pageSearch">反饋</RouterLink>
            <RouterLink to="/addUp" class="pageSearch">統計</RouterLink>
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
        <ul>問題選項
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
    <button type="button" class="btn" @click="questionAddUpdate">新增問卷及題目</button>
</template>

<style lang="scss" scoped>
body {
    position: relative;
}

.formsAddMenu {
    position: absolute;
    top: 30%;
    left: 35%;
    transform: translateY(-50%), translateX(-50%);

    .pageSearch {
        margin: 0 5px 2px 0;
        color: black;
        cursor: pointer;
        background-color: pink;
        padding: 5px;

        &:hover {
            background-color: white;
        }
    }

}


.nowPage {
    font-weight: bolder;
    font-style: oblique;
}

.questionBox {
    width: 600px;
    background-color: pink;
    margin-bottom: 5px;

    li {
        padding: 5px;
    }

}
    .questionAddBtn {
        margin-left: 100px;
}

.btn {
    position: absolute;
    top: 68%;
    left: 50%;
    width: 200px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin: 0 2px 5px 2px;
    padding: 10px;
    color: white;
    border-radius: 1.5rem;
    transition: ease 0.1s;
    border: none;
    box-shadow: 2px 2px 5px gray;
    background-color: #995a25;

    &:hover {
        background-color: gray;
    }
}

.questionDetailsList {
    padding-top: 10px;
    position: absolute;
    top: 42%;
    left: 30%;
    width: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
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
</style>


