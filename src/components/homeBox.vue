<script>
//回首頁
export default {
    methods: {
        backToIndexPage(){
            this.$router.push('/')
        }
    },
};
</script>

<template>
    <div class="homeBox" @click="backToIndexPage">首頁
    </div>
</template>

<style lang="scss" scoped>
.homeBox {
    width: 80px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    box-shadow: 2px 2px 2px gray;
    background-color: #edd76a;
    opacity: 0.5;
    cursor: pointer;
    z-index: 1;

    font-size: 36px;
    color: #995a25;
    

    &:hover {
        opacity: 1;
        font-weight: bold;
        border-radius: 50%;

    }
}
</style>