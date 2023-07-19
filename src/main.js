import { createApp } from 'vue'
import '../src/stylesheet/main.css'
import App from './App.vue'
import router from './router'


import { library } from '@fortawesome/fontawesome-svg-core'
import { faFacebookSquare, faInstagram} from '@fortawesome/free-brands-svg-icons'
import { faShoppingCart , faTrash , faFileCirclePlus  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faShoppingCart, faInstagram, faFacebookSquare , faTrash ,faFileCirclePlus)
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router)



app.mount('#app')



