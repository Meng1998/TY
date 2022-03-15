// eslint-disable-next-line
import { api as UrlMain,map as Url}  from './address' 
// 接口集合
const constant =  {
  //智慧仓储
  MaingetStorage : `${UrlMain}/largescreen/largeScreen/getScreenData/storage`,
  //智慧分拣
  MaingetSorting : `${UrlMain}/largescreen/largeScreen/getScreenData/sorting`,
  
  //获取人脸信息
  Faceinfo:`${Url}/DispatchCrmerl`,
  //分拣动画一
  DispatchInfoOne : `${Url}/DispatchInfoOne`,
   //分拣动画计总
   DispatchInfoOneExist : `${Url}/DispatchInfoOneExist`,
  //分拣动画二
  DispatchInfoTwo : `${Url}/DispatchInfoTwo`,
  //分拣动画三
  DispatchInfoThree : `${Url}/DispatchInfoThree`,
  //获取表格记录
  DispatchInfoText : `${Url}/DispatchInfoText`
  
} 
export default constant;