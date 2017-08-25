import axios from 'axios'
import {base64encode, des, utf16to8, utf8to16, base64decode, hexToString, Handle} from '../util/des';

export default {
    /**
     * 设置cookie
     * @param name
     * @param value
     * @param iDay
     */
    setCookie: function (name, value, iDay) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + iDay);
        document.cookie = name + '=' + value + ';expires=' + oDate;
    },
    /**
     * 获取cookie
     * @param name
     * @returns {*}
     */
    getCookie: function (name) {
        var arr = document.cookie.split('; ');
        for (var i = arr.length - 1; i >= 0; i--) {
            var arr2 = arr[i].split('=');
            if (arr2[0] === name) {
                return arr2[1];
            }
        }
        return '';
    },
    /**
     * 删除cookie
     * @param name
     */
    delCookie: function (name) {
        cookie.set(name, 1, -1);
    },
    /**
     * 随机的16为字符串 X-Dola-Code
     * @returns {string}
     */
    getRrandomStr: function () {
        var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var result = "";
        for (var i = 0; i < 16; i++) {
            var r = Math.floor(Math.random() * 62);
            result += data[r];
        }
        return result;
    },
    /**
     * 毫秒时间戳.随机数
     */
    getRrandomTime: function () {
        var d = new Date().getTime();
        var num = "";
        for (var i = 0; i < 5; i++) {
            num += Math.floor(Math.random() * 10);
        }
        return d + '.' + num;
    },
    /**
     * 获取时间戳
     * @returns {number}
     */
    getSeconds: function () {
        return new Date().getTime();
    },
    /**
     * 生成36位的uuid
     * @returns {string}
     */
    getGuid(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    /**
     *
     * @param Codekey 加密的key
     * @param str  加密的str
     * @param name
     * @returns {*}
     */
    encryption(Codekey, str, name){
        if (Codekey) {
            return base64encode(des(Codekey, utf16to8(str), 1, 0, hexToString(name), 1))
        }
    },
    /**
     *
     * @param key 解密的key
     * @param str 解密的str
     * @param name
     * @returns {*}
     */
    decrypt(key, str, name){
        if (key) {
            return Handle(utf8to16(des(key, base64decode(String(str)), 0, 0, hexToString(name), 0)))
        }
    },
    /**
     *
     * @param platform 平台标志
     * @param token 身份验证
     * @returns {*}
     */
    getParams(platform, token, params){
        if (platform) {
            var params = {
                platform: 'wechat',
                proglang: 'javascript',
                sn: this.getRrandomTime(),
                params: params,
                token: token
            }
            return JSON.stringify(params);
        }
    },
    getMethod(url, Codekey, params){
        return axios.get(url, {
            params: {
                data: params
            },
            headers: {
                'X-Dola-Code': Codekey,
                'X-Dola-Time': this.getSeconds(),
                'X-Dola-ClientID': this.getGuid()
            }
        })
    },
    postMethod(url, Codekey, params){
        return axios.post(url, {
            data: params
        }, {
            headers: {
                'X-Dola-Code': Codekey,
                'X-Dola-Time': this.getSeconds(),
                'X-Dola-ClientID': this.getGuid()
            }
        })
    },
    trim(str){
        return str.replace(/^\s+|\s+$/gm, '');
    }
}
