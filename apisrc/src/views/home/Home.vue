<template>
    <div>
  	    <NavHeader></NavHeader>
        <section class="page">
            <el-col :span="3" class="section-left">
                <el-menu  class="el-menu-vertical-demo" unique-opened router>
                    <el-menu-item index="/home"><i class="el-icon-menu"></i>主页</el-menu-item>
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>接口管理</template>
                        <el-menu-item  index="/home/api">接口测试</el-menu-item>
                        <el-menu-item  index="/home/apilist">接口列表</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col :span="21" class="section-right">
                <keep-alive>
                    <router-view class="router-view"></router-view>
                </keep-alive>
            </el-col>
        </section>
    </div>
</template>
<script>
	import NavHeader from '../common/Nav.vue'
    export default {
        name: 'home',
        data() {
            return {
               
            }
        },
        mounted(){

        },
        watch: {

        },
        methods:{

        },
        components: {
            NavHeader
        }
    }
</script>
<style scoped>

</style>
