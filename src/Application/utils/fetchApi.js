import axios from 'axios'
import { hashHistory } from 'react-router'
export const api = window.WX_CONFIG.baseURL

/**
 * 发送ajax
 * @param  {String}  *options.url    
 * @param  {String}  options.method   请求方式
 * @param  {Number}  options.download 是否为下载请求
 * @param  {Boolean} options.process  是否处理post数据
 * @param  {Object}  options.data     请求对象数据
 */
export default function load({ url, method = 'get', download = 0, data = {} }) {
    
    if (download) {
        const form = document.createElement('form')
        form.method = method
        form.action = api + url
        for(let i in data) {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = i
            input.value = data[i]
            form.appendChild(input)
        }
        document.body.appendChild(form)
        form.submit()
        form.remove()
    } else {
        let urlArg = ''
        if(method === 'get' && Object.keys(data).length) {
            urlArg = '?'+ Object.keys(data).reduce(function(a,k){data[k] !== undefined && data[k] !== null && a.push(k+'='+encodeURIComponent(data[k]));return a},[]).join('&')
        }
        urlArg = urlArg === '?' ? '' : urlArg

        if(method === 'post') {
            data = formData(data)
        }

        return new Promise((resolve, reject) => {

            axios({
                method,
                url: api + url + urlArg,
                data: method === 'get' ? null : data
            }).then(res => {
                switch(res.data.errorcode) {
                    case 0:
                        resolve(res.data, res)
                        break
                    case 10001:
                        resolve({
                            result: {
                                list: [],
                                page: 0,
                                count: 0
                            }
                        })
                        break
                    default:
                        // 后台API不健壮，只能这样写了
                        if (!res.data) {
                            res.data = {
                                errormsg: '操作失败'
                            }
                        }
                        reject({
                            err: res.data,
                            request: {
                                path: url,
                                data
                            }
                        })
                        break
                }
                
            }).catch(err => {
                // 未登录
                if (err.status === 401) {
                    reject({ status: 401 })
                    return hashHistory.push({
                        pathname: '/login',
                        state: {
                            message: '请登录后再操作',
                            type: 'warn'/*,
                            redirect: location.hash*/
                        }
                    })
                }

                // TODO decorators的onError的提示和这里的错误提示不一致

                let msg = '系统异常，请联系管理员！'

                if (err.status === 403) {
                    msg = '操作失败，你没有足够的权限访问该资源！'
                }

                reject({
                    err: {
                        errormsg: msg,
                        ...err
                    },
                    request: {
                        path: url,
                        data
                    }
                })
            })
        })
    }
}
function formData(data) {
    const form = new FormData()
    for(let i in data) {
        if (data[i] instanceof File) {
            form.append('file', data[i])
        } else if(data[i] !== undefined && data[i] !== null) {
            form.append(`formData[${i}]`, data[i])
        }
        
        
    }
    return form
}