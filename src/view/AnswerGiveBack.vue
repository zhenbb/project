<script>
export default {

    data() {
        return {
            formsId: sessionStorage.getItem('formsId'),
            respondentsList: [],
            text: null,
            status: true,
            pageNum: 1,
            totalPageCount: 0,
            rowsPerPage: 10,
            display: [] // 用于显示的数据
        }
    },
    methods: {
        selectAllByformsId() {
            this.selectAllBody = {
                formsId: this.formsId,
            }
            fetch("http://localhost:8080/selectRespondentsByformsId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(this.selectAllBody),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.respondentsList = data.respondentsList
                    console.log(this.respondentsList);
                })
        },

        checkGiveBackDetail(item){
            sessionStorage.setItem("respondent",JSON.stringify(item));
            this.$router.push('/giveBackDetail')
        }

    },
    mounted() {
        this.selectAllByformsId();
    }
}
</script>


<template>
    <ul class="formsAddMenu">
        <li>
            <RouterLink to="/formUpdate" class="pageSearch">修改問卷</RouterLink>
            <RouterLink to="/questionUpdate" class="pageSearch">修改題目</RouterLink>
            <RouterLink to="/answerGiveBack" class="pageSearch nowPage">反饋</RouterLink>
            <RouterLink to="/addUp" class="pageSearch">統計</RouterLink>
        </li>
        <div class="giveBackList">
            <ul>編號
                <li v-for="(item) in respondentsList">
                    {{ item.respondentsId }}
                </li>
            </ul>
            <ul>姓名
                <li v-for="(item) in respondentsList">
                    {{ item.name }}
                </li>
            </ul>
            <ul>填寫時間
                <li v-for="(item) in respondentsList">
                    {{ item.answerTime }}
                </li>
            </ul>
            <ul>觀看細節
                <li v-for="(item, index) in respondentsList" :key="index" @click="checkGiveBackDetail(item)" class="watch">
                    查看
                </li>
            </ul>
            <!-- 分頁 -->
            <!-- <Pagination @autodatePage="filterByPageNum" :PageNum="PageNum" :totalPageCount="totalPageCount">
                </Pagination> -->
        </div>
    </ul>
</template>
<style lang="scss" scoped>
.giveBackList {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: palevioletred;
    font-size: 16px;
    padding: 10px;

    ul {
        color: white;
        margin: 10px;

        li {
            color: black;
            margin: 10px;
        }
    }
}

.nowPage {
    font-weight: bolder;
    font-style: oblique;
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
        background-color: palevioletred;
        padding: 5px;

        &:hover {
            background-color: white;
        }
    }

}

.watch{
    font-weight: bold;
    color: #995a25;
    cursor: pointer;
}
</style>