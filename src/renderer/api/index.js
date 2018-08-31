import http from '../utils/http'

/**
 *
 *@author LHF
 * @modal common
 * @returns <Map> / <List>
 */
// 查询星级
export function starArr () {
  return http.get('/qthl-wf-policy/api/supplierManager/supplierType/24')
}
// 查询来源
export function increaseArr () {
  return http.get('/qthl-wf-policy/api/supplierManager/supplierType/35')
}
// 查询咨询类型
export function consultArr () {
  return http.get('/qthl-wf-policy/api/supplierManager/supplierType/33')
}
// 查询归属销售
export function saleArr (params) {
  return http.post('/qlth-wf-base/api/companySystem/getEmployees', params)
}
// 检索公司API
export function getCompany(params) {
  return http.get('/qthl-wf-policy/api/contractManager/contractCompany/like/' + params)
}
// 跟踪记录
export function record(params) {
  return http.post('/qlth-wf-base/api/traceInfo/getRecord' , params)
}
// 修改线索分级
export function updateStar(params) {
  return http.post('/qthl-wf-busi/api/clueInfo/update/clue', params)
}
//修改跟踪状态
export function updateStatus(params) {
  return http.post('/qthl-wf-busi/api/clueInfo/update/clue', params)
}
//刷新线索
export function refreshApi(params) {
  return http.get('/qthl-wf-busi/api/clueInfo/update/clue/refresh/'+ params)
}





/**
 * 业务模块
 */
// 系统登陆模块
export function login (params) {
  return http.post('/qlth-wf-base/api/user/login', params)
}
// 系统菜单接口
export function menuTree (params) {
  return http.post('/qlth-wf-base/api/rolemanage/menutree', params)
}
// 系统权限接口
export function functions (params) {
  return http.post('/qlth-wf-base/api/rolemanage/role/menu/page/functions', params)
}
/**
 * 业务工作台API
 */
// 获取6个月数组
export function getMonth () {
  return http.get('/qthl-wf-busi/website/home/getMonth/6')
}
// 获取日清提醒
export function disBoad (params) {
  return http.post('/qthl-wf-report/api/workTable/disBoad', params)
}
// 获取城市变更记录
export function policyChange () {
  return http.get('/qthl-wf-customer/website/hr/policyChange')
}
// 获取团队产能看板
export function customService (params) {
  return http.post('/qthl-wf-busi/api/clueInfo/setSumNumber', params)
}

/**
 * @modal 销售管理模块
 *
 * @export
 * @param {*} id
 * @returns
 */
// 获取列表
export function getSaleArr (params) {
  return http.post('/qthl-wf-busi/api/clueInfo/record', params)
}
// 添加销售线索
export function addSale (params) {
  return http.post('/qthl-wf-busi/api/clueInfo/add', params)
}
//获取线索详情
export function saleInf(params) {
  return http.get('/qthl-wf-busi/api/clueInfo/clue/' + params)
}
//上传附件
export function uploadFile(params) {
  return http.post('/qthl-wf-busi/api/clueInfo/update/clue' , params)
}
//删除附件
export function delFiles(params) {
  return http.post('/qlth-wf-base/api/imgInfo/del',params)
}
// 修改销售线索
export function updateSaleInf(params) {
  return http.post('/qthl-wf-busi/api/clueInfo/update/clue' , params)
}
//添加跟踪记录
export function addTrace (params) {
  return http.post('/qlth-wf-base/api/traceInfo/add', params)
}
