<script>
export default {
    data() {
        return {
            selectActionTime: "",
            selectEndTime: "",
            name: "",
            newForms: null
        }

    },
    methods: {
        selectAll() {
            this.selectAllBody = {
                selectActionTime: this.selectActionTime,
                selectEndTime: this.selectEndTime,
                name: this.name,
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
                    this.newForms = data.forms;
                    this.push()
                })

        },
        selectTime() {
            this.selectTimeBody = {
                selectActionTime: this.selectActionTime,
                selectEndTime: this.selectEndTime,
            }
            // if (!this.selectActionTime || !this.selectEndTime) {
            //     alert('需輸入完整日期!')
            //     return
            // }
            fetch("http://localhost:8080/selectTime", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(this.selectTimeBody),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.newForms = data.forms;
                    this.push()
                })

        },
        selectTitle() {
            this.selectNameBody = {
                name: this.name
            }
            fetch("http://localhost:8080/selectName", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(this.selectNameBody),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.newForms = data.forms;
                    this.push()
                })
        },
        search() {
            if (!this.name && !this.selectActionTime && !this.selectEndTime) {
                console.log("都沒有值")
                this.selectAll()
            } else if (!this.name) {
                if(!this.selectActionTime || !this.selectEndTime){
                    this.selectTime()
                }else{
                    if(this.selectActionTime > this.selectEndTime){
                        alert("開始日期不得超過結束日期")
                        return
                    }
                }
                //console.log("時間")
            } else if (!this.selectActionTime && !this.selectEndTime){
                this.selectTitle()
            }
        },
        push() {
            //console.log(this.inputText)
            //1.執行的方法 2.方法帶入的參數
            this.$emit("callOutside", this.newForms)
        }
    },
    mounted() {
        this.selectAll()
    },
}


</script>

<template>
    <div class="searchBox">
        <li class="line">
            <label>
                問卷標題
                <input type="text" class="formsName" v-model="name">
            </label>
        </li>
        <div class="searchAndDate">
            <li class="line">
                <label>
                    開始日期
                    <input type="date" class="actionDate" v-model="selectActionTime">
                </label>
                <label>
                    結束日期
                    <input type="date" class="endDate" v-model="selectEndTime">
                </label>
            </li>
            <button type="button" class="btn btn-outline-dark searchBtn" @click="search">搜尋</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.searchBox {
    margin: 10% 25% 0 25%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 2px solid black;
    background-color: white;


    li {
        font-size: 20px;
        line-height: 1.5;
    }

    .searchAndDate {
        display: flex;
        justify-content: space-between;
    }

    .searchBtn {
        margin-right: 200px;
        background-color: black;
        color: white;
    }

}
</style>