// 引用api公共地址
import constant from './constent'
// 引用接口公共方法
import request from './request'

// export function getLogin(paramsData) {
//     return request({
//         url: constant.getLogin,
//         method: 'post',
//         data: paramsData
//     })
// }
export function getStorage() {
    return request({
        url: constant.MaingetStorage,
        method: 'get'
    })
}
export function getSorting() {
    return request({
        url: constant.MaingetSorting,
        method: 'get'
    })
}
export function DispatchInfoOne() {
    return request({
        url: constant.DispatchInfoOne,
        method: 'get'
    })
}
export function DispatchInfoOneExist() {
    return request({
        url: constant.DispatchInfoOneExist,
        method: 'get'
    })
}
export function DispatchInfoTwo() {
    return request({
        url: constant.DispatchInfoTwo,
        method: 'get'
    })
}
export function DispatchInfoThree() {
    return request({
        url: constant.DispatchInfoThree,
        method: 'get'
    })
}
export function DispatchInfoText() {
    return request({
        url: constant.DispatchInfoText,
        method: 'get'
    })
}
export function getfaceinfo() {
    return  constant.Faceinfo
}