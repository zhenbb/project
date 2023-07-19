<script>
export default {
    data() {
        return {
            forms: {
                formsName: null,
                outline: null,
                actionTime: null,
                endTime: null,
                formsId: null,
            },
        }
    },
    methods: {
        toPageQuestionDetails() {
            sessionStorage.setItem('formsName', this.forms.formsName),
                sessionStorage.setItem('outline', this.forms.outline),
                sessionStorage.setItem('actionTime', this.forms.actionTime),
                sessionStorage.setItem('endTime', this.forms.endTime)

            if (this.forms.actionTime > this.forms.endTime) {
                alert("開始日期不得超過結束日期")
                return
            }
            this.$router.push('/questionUpdate')
        }
    },
    mounted() {
        this.selectByIdBody = {
            formsId: sessionStorage.getItem("formsId")
        }
        fetch("http://localhost:8080/selectById", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(this.selectByIdBody),
        })
            .then(response => response.json())
            .then(data => {
                this.forms = data.form
                console.log(data)
            })

    }

}
</script>

<template>
    <ul class="formsAddMenu">
        <li>
            <RouterLink to="/formUpdate" class="pageSearch nowPage">修改問卷</RouterLink>
            <RouterLink to="/questionUpdate" class="pageSearch">修改題目</RouterLink>
            <RouterLink to="/answerGiveBack" class="pageSearch">反饋</RouterLink>
            <RouterLink to="/addUp" class="pageSearch">統計</RouterLink>
        </li>

        <ul class="questionBox">
            <li>
                問卷名稱
                <input type="text" v-model="forms.formsName">
            </li>
            <li>描述內容
                <input type="text" v-model="forms.outline">
            </li>
            <li>開始時間
                <input type="date" v-model="forms.actionTime">
            </li>
            <li>結束時間
                <input type="date" v-model="forms.endTime">
            </li>
            <li>
                <button type="button" class="addQuestionBoxBtn" @click="toPageQuestionDetails">修改問題</button>
            </li>
        </ul>
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

    .pageSearch {
        margin: 0 5px 2px 0;
        color: black;
        cursor: pointer;
        background-color: rgb(147, 212, 127);
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
    width: 400px;
    background-color: rgb(147, 212, 127);
    padding: 10px;


    li {
        line-height: 1.5;
        font-weight: bold;
    }

    .clearBtn {
        margin-left: 300px;
    }
}
</style>