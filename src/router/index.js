import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/formAdd",
            name: "formAdd",
            component: () => import("../view/FormAdd.vue")
        },
        {
            path: "/backGroundPage",
            name: "backGroundPage",
            component: () => import("../view/Background.vue")
        },
        {
            path: "/formQuestionAdd",
            name: "formQuestionAdd",
            component: () => import("../view/FormQuestionAdd.vue")
        },
        {
            path: "/",
            name: "homePage",
            component: () => import("../view/HomePage.vue")
        },
        {
            path: "/formUpdate",
            name: "formUpdate",
            component: () => import("../view/FormUpdate.vue")
        },
        {
            path: "/questionUpdate",
            name: "questionUpdate",
            component: () => import("../view/QuestionUpdate.vue")
        },
        {
            path: "/frontGroundPage",
            name: "frontGroundPage",
            component: () => import("../view/FrontGround.vue")
        },
        {
            path: "/answerPage",
            name: "/answerPage",
            component: () => import("../view/AnswerPage.vue")
        },
        {
            path: "/answerCheck",
            name: "/answerCheck",
            component: () => import("../view/AnswerCheck.vue")
        },
        {
            path: "/addUp",
            name: "/addUp",
            component: () => import("../view/AddUp.vue")
        },
        {
            path: "/answerGiveBack",
            name: "/answerGiveBack",
            component: () => import("../view/AnswerGiveBack.vue")
        },
        {
            path: "/giveBackDetail",
            name: "/giveBackDetail",
            component: () => import("../view/GiveBackDetail.vue")
        },
        {
            path: "/userAddUp",
            name: "/userAddUp",
            component: () => import("../view/UserAddUp.vue")
        },
    ]
})

export default router