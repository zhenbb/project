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
        formAdd() {
            sessionStorage.setItem("formsName", this.forms.formsName);
            sessionStorage.setItem("outline", this.forms.outline);
            sessionStorage.setItem("actionTime", this.forms.actionTime);
            sessionStorage.setItem("endTime", this.forms.endTime);

            if (this.forms.actionTime > this.forms.endTime) {
                alert("開始日期不得超過結束日期")
                return
            }
            this.$router.push("formQuestionAdd");
        },
        reset() {
            this.forms.formsName = "",
                this.forms.outline = "",
                this.forms.actionTime = "",
                this.forms.endTime = ""
        },
        // 自動選擇當天日期
        setActionDate() {
            const today = new Date();
            this.forms.actionTime = today.toISOString().split('T')[0]
            console.log(this.forms.actionTime);
        },
        setEndDate() {
            // 取得當日日期
            const today = new Date();
            // 加上7天
            const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            this.forms.endTime = futureDate.toISOString().split('T')[0]
            console.log(this.forms.endTime);

            if (this.forms.actionTime > this.forms.endTime) {
                alert("開始日期不得超過結束日期")
                return
            }
        },
    },
    mounted() {
        this.setActionDate();
        this.setEndDate()
    }

}
</script>

<template>
    <ul class="formsAddMenu">
        <li>
            <RouterLink to="/formAdd" class="pageSearch nowPage">問卷</RouterLink>
            <RouterLink to="/formQuestionAdd" class="pageSearch">題目</RouterLink>

        </li>

        <ul class="questionBox">
            <li>
                問卷名稱
                <input type="text" v-model="forms.formsName" name="formsName">
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
                <button type="button" class="clearBtn" @click="reset">清除內容</button>
                <button type="button" class="addQuestionBoxBtn" v-if="forms.formsName !== null && forms.outline !== null"
                    @click="formAdd">新增問題</button>
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

}

.questionBox {
    width: 400px;
    background-color: pink;
    padding: 10px;


    li {
        line-height: 1.5;
        font-weight: bold;
    }

    .clearBtn {
        margin-left: 300px;
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

.nowPage {
    font-style: oblique;
}
</style>