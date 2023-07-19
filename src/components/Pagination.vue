<script>
import paginate from 'vuejs-paginate';
export default {
    name: 'Pagination',
    components: {
        paginate
    },
    data() {
        return {
            currentPageNum: this.pageNum,
        }
    },
    props: {
        pageNum: {
            type: Number,
            default: 1,
        },
        totalPageCount: {
            type: Number,
        }
    },
    methods: {
        clickCallback: function (page) {
            console.log(page)
        },
        changePage(num) {
            this.currentPageNum = num;
            this.$emit('updatePageNum', num);
        }
    }
}

</script>
<template>
    <paginate :value="currentPageCount" :pageCount="10" :containerClass="pagination"
        :clickHandler="clickCallback" :page-range="3" :margin-pages="1" :prev-text="'Prev'" :next-text="'Next'"></paginate>
</template>
<style scoped lang="scss">

</style>