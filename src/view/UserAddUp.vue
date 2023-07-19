<script>
//import DrVueCharts from 'dr-vue-echarts';
import * as echarts from "echarts";

export default {
    data() {
        return {
            formsId: sessionStorage.getItem('formsId'),
            formsName: sessionStorage.getItem('formsName'),
            questionNames: [],
            text: null,
            status: true,
            myChart: {},
            pieDataList: [],
            pieData: [],
            pieName: [],
            myChartStyle: { float: "left", width: "100%", height: "400px" }
        }
    },
    methods: {

        initDate(pie) {
            this.pieData = pie;
            for (let i = 0; i < this.pieData.length; i++) {
                // this.xData[i] = i;
                // this.yData =this.xData[i]*this.xData[i];
                this.pieName[i] = this.pieData[i].name;
            }
        },
        initEcharts(index, questionName) {
            // 饼图
            const option = {
                // legend: {
                //     // 图例
                //     data: this.pieName,
                //     right: "10%",
                //     top: "30%",
                //     orient: "vertical"
                // },
                title: {
                    // 设置饼图标题，位置设为顶部居中
                    text: questionName,
                    top: "3%",
                    left: "center",
                },
                series: [
                    {
                        type: "pie",
                        label: {
                            show: true,
                            // formatter: "{b} : {c} ({d}%)" // b代表名称，c代表对应值，d代表百分比
                            formatter: "{b}:({d}%)",
                            fontSize:"20px",
                            color:'#995a25'
                        },
                        radius: "70%", //饼图半径
                        data: this.pieData
                    }
                ]
            };
            this.myChart = echarts.init(document.getElementById(index));
            this.myChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                this.myChart.resize();
            });
        }
    },
    mounted() {
        console.log(this.formsId)
        this.selectBody = {
            formsId: this.formsId
        }
        fetch("http://localhost:8080/searchRespondentsAns", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(this.selectBody),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                for (const index in data.ansSum_list) {
                    this.pieDataList.push(data.ansSum_list[index])
                }

                const selectFormsDetailsBody = {
                    formsId: this.formsId,
                }
                fetch("http://localhost:8080/findAllByformsId", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(selectFormsDetailsBody),
                })
                    .then(response => response.json())
                    .then(data => {
                        for (const formDetail of data.formsDetails) {
                            this.questionNames.push(formDetail.questionsName)
                        }
                    })
                    .then(() => {
                        for (const index in this.pieDataList) {
                            this.initDate(this.pieDataList[index]);
                            this.initEcharts(index, this.questionNames[index]);
                        }
                        //this.initDate(); //数据初始化
                        //this.initEcharts();
                    })

            })
    }
}
</script>
<template>
    <ul class="formsAddMenu">
        <!-- <li>
            <RouterLink to="/formUpdate" class="pageSearch">修改問卷</RouterLink>
            <RouterLink to="/questionUpdate" class="pageSearch">修改題目</RouterLink>
            <RouterLink to="/answerGiveBack" class="pageSearch">反饋</RouterLink>
            <RouterLink to="/addUp" class="pageSearch">統計</RouterLink>
        </li> -->
        <div class="addUpBox">
            <div class="titleText">
                {{ this.formsName }}
            </div>
            <div class="questionText">
                <ul>
                    <li v-for="(item, index) in pieDataList">
                        <div class="echart" :id="index" :style="myChartStyle">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </ul>
</template>
<style lang="scss" scoped>
.formsAddMenu {
margin: 1% 15% 0 15%;

}

.addUpBox {
    background-color: cornflowerblue;
    width: 1000px;
    display: flex;
    flex-direction: column;


    .titleText {
        padding: 25px;
        font-size: 36px;
        font-weight: bold;
    }

    .questionText {
        padding: 25px;
    }


    .box {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.chart {
    width: 100%;
    height: 500px;
}
</style>