import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Vant组件
import { 
  Button, 
  Cell, 
  CellGroup, 
  NavBar, 
  Tabbar, 
  TabbarItem,
  Icon,
  Toast,
  Dialog,
  Field,
  Form,
  Picker,
  Popup,
  Swipe,
  SwipeItem,
  Lazyload,
  PullRefresh,
  List,
  Image as VanImage,
  Uploader,
  Tag,
  Divider,
  Skeleton,
  Empty,
  ActionSheet,
  ShareSheet,
  Loading
} from 'vant';

// Vant样式
import 'vant/lib/index.css';

// 全局样式
import './styles/index.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

// 注册Vant组件
const vantComponents = [
  Button, Cell, CellGroup, NavBar, Tabbar, TabbarItem,
  Icon, Toast, Dialog, Field, Form, Picker, Popup,
  Swipe, SwipeItem, Lazyload, PullRefresh, List,
  VanImage, Uploader, Tag, Divider, Skeleton, Empty,
  ActionSheet, ShareSheet, Loading
];

vantComponents.forEach(component => {
  app.use(component);
});

app.mount('#app');
