<template>
    <el-row class="mainpage">
        <el-col :span="12" class="mainpage-l">
            <el-form :model="api" :rules="rules" ref="api" label-width="100px">
                <el-form-item label="接口地址" prop="link">
                    <el-autocomplete style="width: 400px;" v-model="api.link" placeholder="请填写接口地址" :fetch-suggestions="querySearchlink"
                                     @select="handleSelectlink"></el-autocomplete>
                </el-form-item>
                <el-form-item label="接口作者" prop="author" style="width: 500px;">
                    <el-autocomplete style="width: 400px;" v-model="api.author" placeholder="请填写接口作者" :fetch-suggestions="querySearch"
                                     @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item label="接口说明" prop="explain" style="width: 500px;">
                    <el-input v-model="api.explain" placeholder="请填写接口说明" type="text"></el-input>
                </el-form-item>
                <el-form-item label="接口方法" prop="method">
                    <el-select v-model="api.method" placeholder="请选择接口类型" style="width: 400px">
                        <el-option label="GET" value="get"></el-option>
                        <el-option label="POST" value="post"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="tokenflag">
                    <el-form-item label="token" style="width: 500px;">
                        <el-input v-model="api.token" placeholder=""></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="接口参数" prop="isParams">
                    <el-switch on-text="" off-text="" v-model="api.isParams" :change="onChange(api.isParams)"></el-switch>
                </el-form-item>
                <el-form-item label="接口备注" prop="desc" style="width: 500px;">
                    <el-input type="textarea" v-model="api.desc"></el-input>
                </el-form-item>
                <template v-if="params_visible">
                    <el-form-item style="width:250px;white-space: nowrap" v-for="(domain, index) in api.domains" :label="'参数' + index" :key="domain.index">
                        <el-input v-model="domain.key" placeholder="key"></el-input>
                        <el-input v-model="domain.value" placeholder="value"></el-input>
                        <el-input v-model="domain.explain" placeholder="explain"></el-input>
                        <el-button style="margin-left: 10px" @click.prevent="removeDomain(domain)">删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="addDomain">新增参数</el-button>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('api')" :loading="loading">检测接口</el-button>
                    <el-button @click="resetForm('api')">重置</el-button>
                </el-form-item>
            </el-form>
            <el-button v-if="saveflag" type="success" @click="onSave('api')" class="savebutton">保存接口数据</el-button>
        </el-col>
        <el-col :span="12" class="codeview">
            <p ref="dom" v-show="flag"></p>
        </el-col>
    </el-row>
</template>
<script>
    import Util from '../../util/index'
    import hljs from 'highlight'
    import 'highlight.js/styles/atelier-seaside-light.css'

    export default {
        name: 'api',
        data() {
            return {
                restaurants: [],
                restaurantslink: [],
                loading: false,
                flag: false,
                tokenflag: false,
                saveflag: false,
                params_visible: false,
                apidata: '',
                paramsjson: '',
                paramsexplain: '',
                api: {
                    link: '',
                    author: '',
                    explain: '',
                    method: 'get',
                    token: '',
                    isParams: false,
                    desc: '',
                    domains: [{
                        key: '',
                        value: '',
                        explain: ''
                    }]
                },
                rules: {
                    author: [
                        {required: true, message: '请填写接口作者', trigger: 'change'}
                    ],
                    link: [
                        {required: true, message: '请输入接口地址', trigger: 'change'}
                    ],
                    explain: [
                        {required: true, message: '请输入接口说明', trigger: 'change'}
                    ]
                }
            }
        },
        mounted(){
            this.restaurants = this.loadAll();
            this.restaurantslink = this.loadAlllink();
            if (sessionStorage.getItem('token') != null) {
                this.tokenflag = true;
                this.api.token = sessionStorage.getItem('token');
            } else {
                this.api.token = '';
                this.tokenflag = false;
            }
        },
        methods: {
            removeDomain(item) {
                var index = this.api.domains.indexOf(item)
                if (index !== -1) {
                    this.api.domains.splice(index, 1)
                }
            },
            addDomain() {
                this.api.domains.push({
                    value: '',
                    key: '',
                    explain: ''
                });
            },
            onChange(value){
                if (value) {
                    this.params_visible = true;
                } else {
                    this.params_visible = false;
                }
            },
            onSubmit(formName) {
                var self = this,
                    el = self.$refs.dom,
                    link = Util.trim(self.api.link),
                    Codekey = Util.getRrandomStr();
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        //清空code
                        el.innerHTML = '';
                        self.loading = true;
                        self.saveflag = false;
                        var domainsparams = self.api.domains;
                        //参数转化json
                        var mapParmas = {};
                        if (self.api.isParams) {
                            for (let i in domainsparams) {
                                mapParmas[domainsparams[i].key] = domainsparams[i].value;
                            }
                        }
                        if (this.api.method == 'get') {
                            var params = Util.getParams('wechat', '', mapParmas);
                            // 未加密的params
                            self.paramsjson = params;
                            params = Util.encryption(Codekey, params, 'code');
                            self.flag = false;
                            Util.getMethod(link, Codekey, params).then((res) => {
                                //解密数据
                                var key = res.headers['x-dola-edoc'];
                                var data = res.data;
                                var str = Util.decrypt(key, data, 'code');
                                var objdata = JSON.parse(JSON.parse(str));
                                var codedata = JSON.stringify(objdata, undefined, 4);

                                // 存取token
                                if (link.indexOf('signin') != -1) {
                                    sessionStorage.removeItem('token');
                                    if (objdata.code == 0 && objdata.msg == 'success') {
                                        sessionStorage.setItem('token', objdata.data['usr_token']);
                                        this.api.token = sessionStorage.getItem('token');
                                        this.tokenflag = true;
                                    }
                                }

                                el.innerHTML = '<pre ref=' + Codekey + '><code class="json">' + codedata + '</code></pre>'
                                self.apidata = codedata;
                                setTimeout(() => {
                                    self.flag = true;
                                    self.loading = false;
                                    let blocks = self.$refs.dom.querySelectorAll('pre code');
                                    self.saveflag = true;
                                    blocks.forEach((block) => {
                                        hljs.highlightBlock(block)
                                    });
                                }, 0)
                            }, (error) => {
                                self.loading = false;
                                self.$message({
                                    type: 'error',
                                    duration: 2000,
                                    message: '请检查配置'
                                });
                            });
                        } else if (this.api.method == 'post') {
                            var params = Util.getParams('wechat', self.api.token, mapParmas);
                            self.paramsjson = params;
                            params = Util.encryption(Codekey, params, 'code');
                            self.flag = false;
                            Util.postMethod(link, Codekey, params).then((res) => {
                                var key = res.headers['x-dola-edoc'];
                                var data = res.data;
                                var str = Util.decrypt(key, data, 'code');
                                var objdata = JSON.parse(JSON.parse(str));
                                var codedata = JSON.stringify(objdata, undefined, 4);

                                // 存取token
                                if (link.indexOf('signin') != -1) {
                                    sessionStorage.removeItem('token');
                                    if (objdata.code == 0 && objdata.msg == 'success') {
                                        sessionStorage.setItem('token', objdata.data['usr_token']);
                                        this.api.token = sessionStorage.getItem('token');
                                        this.tokenflag = true;
                                    }
                                }

                                el.innerHTML = '<pre ref=' + Codekey + '><code class="json">' + codedata + '</code></pre>'
                                self.apidata = codedata;
                                setTimeout(() => {
                                    self.flag = true;
                                    self.loading = false;
                                    let blocks = self.$refs.dom.querySelectorAll('pre code');
                                    self.saveflag = true;
                                    blocks.forEach((block) => {
                                        hljs.highlightBlock(block)
                                    });
                                }, 0)
                            }, (error) => {
                                self.loading = false;
                                self.$message({
                                    type: 'error',
                                    duration: 2000,
                                    message: '请检查配置'
                                });
                            });
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$refs.dom.innerHTML = '';
                this.saveflag = false;
            },
            onSave(formName){
                var self = this;
                var link = Util.trim(self.api.link);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post('/apisave', {
                            link: link,
                            desc: self.api.desc,
                            explain: self.api.explain,
                            method: self.api.method,
                            author: self.api.author,
                            params: self.paramsjson,
                            response: self.apidata
                        }).then((res) => {
                            if (res.data.status) {
                                self.$message({
                                    type: 'success',
                                    duration: 1000,
                                    message: '保存成功'
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearchlink(queryString, cb) {
                var restaurantslink = this.restaurantslink;
                var results = queryString ? restaurantslink.filter(this.createFilterlink(queryString)) : restaurantslink;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurantslink) => {
                    return (restaurantslink.value.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            createFilterlink(queryString) {
                return (restaurant) => {
                    return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
            },
            handleSelectlink(item){
            },
            loadAll() {
                return [
                    {"value": "梁建民"},
                    {"value": "锋哥"},
                    {"value": "陶季富"}
                ];
            },
            loadAlllink() {
                return [
                    {"value": "https://apigateway.dola.dev:442/v1/homepage/appindex"},
                    {"value": "https://apigateway.dola.dev:442/v1/regular/index"},
                    {"value": "https://apigateway.dola.dev:442/v1/user/signin"},
                    {"value": "https://apigateway.dola.dev:442/v1/user/detail"}
                ];
            }
        }
    }
</script>
<style scoped>
    .mainpage-l {
        position: relative;
    }

    .savebutton {
        position: absolute;
        top: 30px;
        right: 0;
    }
</style>
