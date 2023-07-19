<script>
export default {
    data() {
        return {
            respondents: {
                name: sessionStorage.getItem('name'),
                phone: sessionStorage.getItem('phone'),
                email: sessionStorage.getItem('email'),
                age: sessionStorage.getItem('age'),
            },
            formsId: sessionStorage.getItem('formsId'),
            formsQuestionsId: null,
            questionList: JSON.parse(sessionStorage.getItem('questionList')),
            questionsName: null,
            answersOptions: null,
            requiredField: false,
            species: false,
            formsName: sessionStorage.getItem('formsName'),
            outline: sessionStorage.getItem('outline'),
            actionTime: sessionStorage.getItem('actionTime'),
            endTime: sessionStorage.getItem('endTime'),
            answers: [],
        }
    },
    methods: {
        addRespondents() {
            const addRespondentsBody = {
                respondents: {
                    name: this.respondents.name,
                    phone: this.respondents.phone,
                    email: this.respondents.email,
                    age: this.respondents.age,
                    formsId: this.formsId,
                    respondentsId: ""
                }
            }

            fetch("http://localhost:8080/addRespondents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(addRespondentsBody),
            })
                .then(response => response.json())
                .then(data => {
                    this.respondentsId = data.respondents.respondentsId
                    alert(data.message)
                    for (const ans of this.questionList) {
                        console.log("typeof ans.answersS")
                        console.log(typeof ans.answersS)
                        if (typeof ans.answersS == "string") {
                            ans.answersS = [ans.answersS];
                        }
                    }
                    const respondentsAnsBody = {
                        questionList: this.questionList,
                        respondentsId: this.respondentsId,
                        formsId: this.formsId,
                    }
                    console.log("respondentsAnsBody")
                    console.log(respondentsAnsBody)
                    fetch("http://localhost:8080/addRespondentsAns", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(respondentsAnsBody),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            console.log(data.message);

                            this.$router.push('/frontGroundPage')
                        });
                })
        },
        reset() {
            sessionStorage.setItem('previousPage', "answerCheck")
            const expirationTime = 500; // 1 hour in milliseconds
            setTimeout(() => {
                sessionStorage.removeItem('previousPage');
            }, expirationTime);
            sessionStorage.setItem('actionTime', this.actionTime),
                sessionStorage.setItem('endTime', this.endTime),
                sessionStorage.setItem('formsName', this.formsName),
                sessionStorage.setItem('outline', this.outline),
                sessionStorage.setItem('name', this.respondents.name),
                sessionStorage.setItem('phone', this.respondents.phone),
                sessionStorage.setItem('email', this.respondents.email),
                sessionStorage.setItem('age', this.respondents.age),

                this.$router.push('/answerPage')
            //要回到上一頁並充滿原答案
        },
    },
    mounted() {

    }
}

</script>

<template>
    <div class="formTitle">
        <ul>
            <li class="timeBox">
                From<input type="text" v-model="actionTime" :disabled="true" class="nonInput">
                To<input type="text" v-model="endTime" :disabled="true" class="nonInput">
            </li>
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
        <div class="btnForUser">
            <button type="button" @click="reset" class="btn">修改</button>
            <button type="button" @click="addRespondents" class="btn">確認送出</button>
        </div>
    </div>
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