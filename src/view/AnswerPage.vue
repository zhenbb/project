<script>
export default {
    data() {
        return {
            respondents: {
                name: null,
                phone: null,
                email: null,
                age: null,
                respondentsId: null,
            },
            formsId: sessionStorage.getItem('formsId'),
            formsQuestionsId: null,
            questionList: [],
            questionsName: null,
            answersOptions: null,
            requiredField: false,
            species: false,
            formsName: null,
            outline: null,
            actionTime: null,
            endTime: null,
            answers: [],
            respondentsAns: {
                answers: null,
                formsQuestionsId: null,
                respondentsId: null,
                formsId: null,
            },

        }
    },
    methods: {
        toPageRespondentsCheck() {
            console.log(this.questionList)
            for (const question of this.questionList) {
                if (question.requiredField && question.answersM.length == 0 && question.answersS == "") {
                    alert("!!為必填問題")
                    return
                }
            }
            sessionStorage.setItem('actionTime', this.actionTime),
                sessionStorage.setItem('endTime', this.endTime),
                sessionStorage.setItem('formsName', this.formsName),
                sessionStorage.setItem('outline', this.outline),
                sessionStorage.setItem('name', this.respondents.name),
                sessionStorage.setItem('phone', this.respondents.phone),
                sessionStorage.setItem('email', this.respondents.email),
                sessionStorage.setItem('age', this.respondents.age),
                sessionStorage.setItem('questionList', JSON.stringify(this.questionList)),
                sessionStorage.setItem('respondentsId', this.respondentsId),
                sessionStorage.setItem('formsId', this.formsId),
                this.$router.push('/answerCheck')
        },
        ageCheck() {
            const checkAge = this.respondents.age
            if (checkAge <= 0 || checkAge % 1 !== 0 || checkAge > 99) {
                alert('請重新輸入正確年齡')
                this.respondents.age = ""
            }
        },
        nameCheck() {
            const checkName = this.respondents.name
            if (checkName == null) {
                alert('姓名欄位為必填!')
                this.respondents.name = ""
            }
        },
        phoneCheck() {
            const checkPhone = this.respondents.phone
            const phonePattern = "^09\\d{8}$"
            if (checkPhone == null || !checkPhone.match(phonePattern)) {
                alert('電話欄位請填寫正確手機號碼!')
                this.respondents.phone = ""
            }
        },
        emailCheck() {
            const checkEmail = this.respondents.email
            const emailPattern = ".*@.*"
            if (checkEmail == null || !checkEmail.match(emailPattern)) {
                alert('請確認信箱是否填寫完成!')
                this.respondents.email = ""
            }
        },
        reset() {
            if (confirm('是否要清除所有回答?') === true) {
                this.$router.push('/frontGroundPage')
            } else {
                return
            }
        },
        modifyUser(index) {
            this.questionsName = this.questionList[index].questionsName,
                this.answersOptions = this.questionList[index].answersOptions,
                this.requiredField = this.questionList[index].requiredField,
                this.species = this.questionList[index].species
            this.questionList.splice(index, 1); // 移除第幾個元素,從這個元素開始刪幾筆
        },

        convertToArr(item) {
            // Convert the string value to an array
            //item.answersS = [item.answersS];
        },

    },
    mounted() {
        if (sessionStorage.getItem('previousPage') === "answerCheck") {
            this.respondents = {
                name: sessionStorage.getItem('name'),
                phone: sessionStorage.getItem('phone'),
                email: sessionStorage.getItem('email'),
                age: sessionStorage.getItem('age'),
            }
            this.formsName = sessionStorage.getItem('formsName'),
                this.outline = sessionStorage.getItem('outline'),
                this.actionTime = sessionStorage.getItem('actionTime'),
                this.endTime = sessionStorage.getItem('endTime'),
                this.questionList = JSON.parse(sessionStorage.getItem('questionList'))
            return
        }
        const formsDetailsRequest = {
            formsId: this.formsId
        }
        // console.log(1201, formsDetailsRequest)
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
                this.actionTime = data.form.actionTime;
                this.endTime = data.form.endTime;
                this.formsName = data.form.formsName;
                this.outline = data.form.outline;
                for (const detail of data.formsDetails) {
                    this.questionList.push({
                        questionsName: detail.questionsName,
                        answersOptions: detail.answersOptions,
                        spiltOptions: detail.answersOptions.split(','),
                        answersM: [],
                        answersS: [],
                        requiredField: detail.requiredField,
                        formsQuestionsId: detail.formsQuestionsId,
                        species: +detail.species,
                        formsId: detail.formsId,
                    })
                    if (detail.requiredField === 1) {
                        this.requiredField = true
                    }
                }

            })

    },
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
                <input type="text" v-model="respondents.name" @change="nameCheck">
            </li>
            <li class="userBox">電話:
                <input type="text" v-model="respondents.phone" @change="phoneCheck">
            </li>
            <li class="userBox">信箱:
                <input type="text" v-model="respondents.email" @change="emailCheck">
            </li>
            <li class="userBox">年齡:
                <input type="number" v-model="respondents.age" @change="ageCheck" min=0 max=99>
            </li>
        </ul>
        <br>
        <div class="questionsBox">
            <li v-for="(item) in questionList" class="qAndA">
                <label v-if="item.requiredField === true">!!</label>Q:
                <input type="text" v-model="item.questionsName" :disabled="true" class="nonInput">
                <ul v-for="(option, optionIndex) in item.spiltOptions" class="answerBox">
                    <input type="checkbox" :value="option" v-model="item.answersM" v-if="item.species">
                    <input type="radio" :value="option" v-model="item.answersS" @change="convertToArr(item)"
                        v-if="!item.species">
                    {{ option }}
                </ul>
            </li>
        </div>
        <div class="btnForUser">
            <button type="button" @click="reset" class="btn">清除</button>
            <button type="button" @click="toPageRespondentsCheck" class="btn">送出</button>
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
    width: 80px;
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