const Home = resolve => require(['./views/home/Home.vue'], resolve)
const Start = resolve => require(['./views/home/Start.vue'], resolve)
const Api = resolve => require(['./views/api/Index.vue'], resolve)
const ApiList = resolve => require(['./views/api/List.vue'], resolve)

export  default[
    {
        path: '/home',
        component: Home,
        children: [
            {
                name: '首页',
                path: '',
                component: Start
            },
            {
                path: 'api',
                component: Api,
                name: "api接口测试"
            },
            {
                path: 'apilist',
                component: ApiList,
                name: "接口列表"
            }
        ]
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '*',
        redirect: '/home'
    }
];
