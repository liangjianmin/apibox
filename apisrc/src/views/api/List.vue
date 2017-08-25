<template>
    <el-row class="listpage">
        <el-col :span="24">
            <el-table :data="pagelist" border v-loading="pagelist == undefined " element-loading-text="拼命加载中">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="接口响应内容（json）：">
                                <div class="codeview">
                                    <pre>{{ props.row.response }}</pre>
                                </div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column property="id" label="ID" width="80"></el-table-column>
                <el-table-column prop="author" label="接口作者" width="100"></el-table-column>
                <el-table-column prop="link" label="接口地址" width="500"></el-table-column>
                <el-table-column prop="params" label="接口参数" width="400"></el-table-column>
                <el-table-column property="explain" label="接口说明"></el-table-column>
                <el-table-column property="method" label="接口方法" width="100" align="center"></el-table-column>
                <el-table-column prop="from" label="接口来源" width="100" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="page.limit" layout="total,prev, pager, next, jumper" :total="page.count"></el-pagination>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        name: 'apilist',
        data() {
            return {
                currentPage: 1
            }
        },
        computed: mapState({
            page: state => state.api.apilist,
            pagelist (state) {
                var obj = Object.assign(state.api.apilist);
                if (obj.hasOwnProperty('list')) {
                    return obj.list.data;
                }
            }
        }),
        mounted(){
            this.init();
        },
        watch: {
            $route(to){
                var path = to.path.substring(1);
                if (path == 'home/apilist') {
                    this.init();
                }
            }
        },
        methods: {
            init(){
                this.$store.dispatch({
                    type: 'apilist',
                    queryStr: this.currentPage
                });
            },
            handleEdit(index, row) {

            },
            handleDelete(index, row){
                var self = this;
                this.$confirm('确定删除该接口嘛？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.$http.post('delapi', {
                        id: row.id
                    }).then((res) => {
                        if (res.data.status) {
                            this.$message({
                                type: 'success',
                                duration: 1000,
                                message: '删除成功!',
                                onClose: function () {
                                    self.init();
                                }
                            });
                        }
                    });
                }).catch(() => {
                });
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.$store.dispatch({
                    type: 'user',
                    queryStr: this.currentPage
                });
            }
        }
    }
</script>
<style scoped>
    .codeview {
        width: 800px;
        height: 600px;
        overflow: hidden;
        overflow-y: auto;
    }

    .restext {
        white-space: normal;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .page-block {
        padding: 40px 10px 0px 40px;
        text-align: right;
    }

    .listpage {
        width: 100%;
        overflow: hidden;
        overflow-y: auto;
    }
</style>
