<script>
import SearchView from '../components/Search.vue';
import { RouterLink } from 'vue-router'

export default {
    components: {
        SearchView
    },
    data() {
        return {
            forms: null,
            formsDelete: [],
            text: null,
            status: true,
            currentPage: 1,
            formsPerPage: 10
        }
    },
    computed: {
        totalPages() {
            if (this.forms === null) {
                return 0;
            }
            return Math.ceil(this.forms.length / this.formsPerPage);
        },
        paginatedForms() {
            const startIndex = (this.currentPage - 1) * this.formsPerPage;
            const endIndex = startIndex + this.formsPerPage;
            console.log(startIndex)
            console.log(endIndex)
            console.log(this.forms)
            if (this.forms === null) {
                return;
            }
            return this.forms.slice(startIndex, endIndex);
        }
    },
    methods: {
        selectAll() {
            this.selectAllBody = {
                selectActionTime: null,
                selectEndTime: null,
                selectName: null,
            }
            fetch("http://localhost:8080/selectAll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(this.selectAllBody),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.forms = data.forms;
                    console.log(this.forms)
                })
        },

        getInfo(item) {
            console.log("外層:" + item)
            this.forms = item;
        },

        toAnswerPage(item) {
            sessionStorage.setItem("formsId", item.formsId)
            console.log(item.formsId)
            console.log(this.status)
            this.$router.push('/answerPage')
        },
        checkStatus(item) {
            const today = new Date();
            const actT = new Date(item.actionTime);
            const endT = new Date(item.endTime);
            actT.setHours(0, 0, 0, 0);
            endT.setHours(23, 59, 59, 0);

            if (actT > today) {
                this.status = false
                return false
            } else if (endT < today) {
                this.status = false
                return false
            } else {
                this.status = true
                return true
            }
        },

        checkFormsOpen(item) {

            const today = new Date();
            const actT = new Date(item.actionTime);
            const endT = new Date(item.endTime);
            actT.setHours(0, 0, 0, 0);
            endT.setHours(23, 59, 59, 0);

            if (actT > today) {
                this.status = false
                return "尚未開始"
            } else if (endT < today) {
                this.status = false
                return "已結束"
            } else {
                this.status = true
                return "進行中"
            }
        },

        toAddUpPage(item) {
            sessionStorage.setItem("formsId", item.formsId)
            sessionStorage.setItem("formsName", item.formsName)
            this.$router.push('/UserAddUp')

        },

        formsClose() {
            alert('未開放作答')
            return
        },

        unable() {
            alert('未開放')
            return
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        }


    },
    mounted() {
        this.selectAll();
    }
}


</script>

<template>
    <SearchView @callOutside="getInfo" />
    <div class="btnAndListBox">
        <div class="questionListBox">
            <div class="questionList">

                <ul>編號
                    <li v-for="(item) in paginatedForms">
                        {{ item.formsId }}
                    </li>

                </ul>
                <ul>問卷
                    <li v-for="(item, index) in paginatedForms" :key="index" class="formsName"
                        :class="{ 'disabled': checkStatus(item) }"
                        @click="checkStatus(item) ? toAnswerPage(item) : formsClose()">
                        {{ item.formsName }}
                    </li>
                </ul>
                <ul>
                    狀態
                    <li v-for="(item, index) in paginatedForms" :key="index">
                        {{ checkFormsOpen(item) }}
                    </li>
                </ul>
                <ul>開始時間
                    <li v-for="(item) in paginatedForms">
                        {{ item.actionTime }}
                    </li>
                </ul>
                <ul>結束時間
                    <li v-for="(item) in paginatedForms">
                        {{ item.endTime }}
                    </li>
                </ul>
                <ul>觀看統計
                    <li v-for="(item, index) in paginatedForms" :key="index" class="formsName"
                        @click="checkFormsOpen(item) !== '尚未開始' ? toAddUpPage(item) : unable()">
                        {{ '統計' }}
                    </li>
                </ul>
            </div>
            <div class="pagination">
                <!-- <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
                <button @click="nextPage" :disabled="currentPage === totalPages">Next</button> -->
                <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :disabled="currentPage === page">{{
                    page
                }}</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.pagination {
    margin: 5px;
    background-color: black;
    color: #ffffff;

    &:hover {
        font-weight: bold;
    }
}
.btnAndListBox {
    display: flex;
    flex-direction: column;
    margin: 15px 20%;


    .questionListBox {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}

.questionList {
    display: flex;
    justify-content: left;
    background-color: white;
    margin-top: 5px;
    padding: 10px;
    border: 10px double black;


    ul {
        margin: 10px 20px;
        font-weight: bold;
    }

    li {
        margin-top: 10px;
        line-height: 1.5;
    }
}


.trashBtn,
.plusBtn {
    font-size: 24px;
    color: black;
    cursor: pointer;
    margin: 0 5px;
}


.formsName {
    cursor: pointer;
    color: cornflowerblue;
}
</style>
