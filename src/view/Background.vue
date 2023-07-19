<script>
import Pagination from '../components/Pagination.vue';
import SearchView from '../components/Search.vue';
import { RouterLink } from 'vue-router'

export default {
    components: {
        SearchView,
        Pagination
    },
    data() {
        return {
            forms: null,
            formsDelete: [],
            text: null,
            status: true,
            pageNum: 1,
            totalPageCount: 0,
            rowsPerPage: 10,
            display: [],// 用于显示的数据
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
                    this.filterByPageNum(this.pageNum);
                    console.log(this.forms)
                })
        },
        delete() {
            this.deleteBody = {
                deleteFormsId: this.formsDelete
            }

            fetch("http://localhost:8080/deleteById", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(this.deleteBody),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
        },
        deleteBtn() {
            if (confirm('是否確認刪除?') === true) {
                this.delete();
                this.$router.go(0)
            } else {
                return
            }

        },
        getInfo(item) {
            console.log("外層:" + item)
            this.forms = item;
        },
        //跳轉頁面
        switchPage() {
            this.$router.push("formAdd")
        },
        toUpdatePage(item) {
            sessionStorage.setItem("formsId", item.formsId)
            console.log(item.formsId)
            if (this.status === true) {
                this.$router.push('/formUpdate')
            } else {
                alert('問卷已結束,不得編輯')
                return
            }
        },
        checkStatus(item) {
            const today = new Date();
            const actT = new Date(item.actionTime);
            const endT = new Date(item.endTime);
            actT.setHours(0, 0, 0, 0);
            endT.setHours(23, 59, 59, 0);

            if (actT >= today) {
                this.status = true
                return "尚未開放"
            } else if (endT < today) {
                this.status = false
                return "已結束"
            } else {
                this.status = true
                return "進行中"
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
            sessionStorage.setItem("outline", item.outline)
            this.$router.push('/addUp')
        },

        filterByPageNum(num) {
            this.pageNum = num;
            const startIndex = this.rowsPerPage * (num - 1);
            const endIndex = this.rowsPerPage * num;
            this.display = this.forms.slice(startIndex, endIndex);
        },

        unable() {
            alert('未開放')
            return
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
        <div class="backGroundIcon">
            <span @click="deleteBtn" class="trashBtn"><font-awesome-icon icon="trash" fade /></span>
            <RouterLink to="/formAdd" class="plusBtn"><font-awesome-icon :icon="['fas', 'file-circle-plus']" fade />
            </RouterLink>
        </div>
        <div class="questionListBox">
            <div class="questionList">
                <ul>選取
                    <li v-for="item in paginatedForms">
                        <input type="checkbox" v-model="formsDelete" :value="item.formsId"
                            :disabled="checkFormsOpen(item) === '進行中'">
                    </li>
                </ul>
                <ul>編號
                    <li v-for="(item) in paginatedForms">
                        {{ item.formsId }}
                    </li>

                </ul>
                <ul>問卷
                    <li v-for="(item, index) in paginatedForms" :key="index" class="formsName"
                        :class="{ 'disabled': !status }" @click="checkStatus(item) ? toUpdatePage(item) : null">
                        {{ item.formsName }}
                    </li>
                </ul>
                <ul>
                    狀態
                    <li v-for="(item, index) in paginatedForms" :key="index">
                        {{ checkStatus(item) }}
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

.backGroundIcon {
    margin-left: 10%;
}
</style>
