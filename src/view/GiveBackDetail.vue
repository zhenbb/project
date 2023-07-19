<script>
export default {
    data() {
        return {
            respondents: JSON.parse(sessionStorage.getItem('respondent')),
            questionList: [
                // questionsName: null,
                // answersOptions: null,
                // spiltOptions: [],
                // answersS:[],
                // answersM:[],
                // requiredField:null,
                // formsQuestionsId: null,
                // species: null,
                // formsId: null,
            ],
            formsId: sessionStorage.getItem('formsId'),
            formsName: sessionStorage.getItem('formsName'),
            outline: sessionStorage.getItem('outline'),
            answers: [],
        }
    },
    methods: {
        checkGiveBackDetail() {
            this.selectAllBody = {
                respondentsId: this.respondents.respondentsId,
            }
            fetch("http://localhost:8080/selectRespondentsAnsByRespondentsId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(this.selectAllBody),
            })
                .then(response => response.json())
                .then(dataAns => {
                    console.log(dataAns);

                    const formsDetailsRequest = {
                        formsId: this.formsId
                    }
                    fetch("http://localhost:8080/selectById", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formsDetailsRequest),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            for (const detail in data.formsDetails) {
                                let tempAns = [];
                                if (dataAns.respondentsAns[detail].answers.split(",").length > 1) {
                                    tempAns = dataAns.respondentsAns[detail].answers.split(",")
                                }
                                this.questionList.push({
                                    questionsName: data.formsDetails[detail].questionsName,
                                    answersOptions: data.formsDetails[detail].answersOptions,
                                    spiltOptions: data.formsDetails[detail].answersOptions.split(','),
                                    answersS: dataAns.respondentsAns[detail].answers,
                                    answersM: tempAns,
                                    requiredField: data.formsDetails[detail].requiredField,
                                    formsQuestionsId: data.formsDetails[detail].formsQuestionsId,
                                    species: +data.formsDetails[detail].species,
                                    formsId: data.formsDetails[detail].formsId,
                                })
                            }

                        })
                })
        }
    },
    mounted() {
        this.checkGiveBackDetail();
    }
}

</script>

<template>
    <ul class="formsAddMenu">
        <div class="formTitle">
            <ul>
                <li>
                    <input type="text" v-model="formsName" :disabled="true" class="nonInput Title">
                </li>
                <li>
                    <input type="text" v-model="outline" :disabled="true" class="nonInput outline">
                </li>
            </ul>
            <br>
            <ul>
                <li class="userBox">姓名:
                    <input type="text" v-model="respondents.name" :disabled="true">
                </li>
                <li class="userBox">電話:
                    <input type="text" v-model="respondents.phone" :disabled="true">
                </li>
                <li class="userBox">信箱:
                    <input type="text" v-model="respondents.email" :disabled="true">
                </li>
                <li class="userBox">年齡:
                    <input type="number" v-model="respondents.age" :disabled="true">
                </li>
                <li class="userBox">填寫時間:
                    <input type="text" v-model="respondents.answerTime" :disabled="true">
                </li>
            </ul>
            <br>
            <div class="questionsBox">
                <li v-for="(item) in questionList" class="qAndA">
                    <label v-if="item.requiredField === true">!!</label>Q:
                    <input type="text" v-model="item.questionsName" :disabled="true" class="nonInput">
                    <ul v-for="(option, optionIndex) in item.spiltOptions" class="answerBox">
                        <input type="checkbox" :value="option" v-model="item.answersM" v-if="item.species" :disabled="true">
                        <input type="radio" :value="option" v-model="item.answersS" v-if="!item.species" :disabled="true">
                        {{ option }}
                    </ul>
                </li>
            </div>
        </div>
    </ul>
</template>
<style lang="scss" scoped>
.formTitle {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 15% 0 15%;
    background-color: white;
    border: 1rem double #8C5E58;
    padding: 2% 0 2% 0;

    .nonInput {
        background: none;
        outline: none;
        border: none;
        color: black;
    }

    .Title {
        font-size: 48px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
    }

    .timeBox {
        text-align: right;
        margin-bottom: 20px;
        padding-left: 350px;
        font-size: 16px;
        color: #995a25;
    }

    .outline {
        text-align: center;
        font-size: 14px;
        padding-left: 200PX;
        color: #995a25;
        font-weight: bold;
    }
}

label {
    color: red;
    font-size: 24px;
    font-weight: bold;
}

.userBox {
    margin: 10px;
    color: #995a25;
    font-weight: bold;
}

.qAndA {
    margin: 20px;
}

.answerBox {
    margin: 5px;
}

.btn {
    width: 100px;
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
</style>