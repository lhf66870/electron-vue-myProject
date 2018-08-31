<template>
	<div id="SaleManage" class="filter-box">
		<!-- 头部搜索信息 -->
		<div class="box-header clearfix">
			<div class="header-left">
				<div class="clearfix">
					<div class="box-item left">
						<div class="box-item-border">
							<label class="box-item-label">关键字</label>
							<div style="padding-left: 42px;">
								<Input size="small" placeholder="单位名、姓名、电话等" v-model="sendMsg.keyWord" :maxlength="64" @on-enter="searchStaff"></Input>
							</div>
						</div>
					</div>
					<div class="box-item left">
						<div class="box-item-border" id="tc">
							<label class="box-item-label">更新日期:</label>
							<div style="padding-left: 54px;">
								<Date-picker format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择日期" :value="timeVal"
								    @on-change="timeChange"></Date-picker>
							</div>
						</div>
					</div>
					<div class="box-item left">
						<div class="box-item-border">
							<label class="box-item-label">归属销售:</label>
							<div style="padding-left: 54px;">
								<i-Select size="small" v-model="sendMsg.saleId">
									<i-Option v-for="(item,index) in saleList" :value="item.id" :key="index">{{ item.name }}</i-Option>
								</i-Select>
							</div>
						</div>
					</div>
					<div class="box-item left">
						<div class="box-item-border">
							<label class="box-item-label">咨询类型:</label>
							<div style="padding-left: 54px;">
								<i-Select size="small" v-model="sendMsg.type">
									<i-Option v-for="(item,index) in consultList" :value="item.value" :key="index">{{ item.label }}</i-Option>
								</i-Select>
							</div>
						</div>
					</div>
					<div class="box-item left">
						<div class="box-item-border">
							<label class="box-item-label">地区:</label>
							<div style="padding-left: 32px;">
								<Cascader :data="$root.cityArr" v-model="cityArr" @on-change="citychange" change-on-select></Cascader>
							</div>
						</div>
					</div>
					<div class="box-item left">
						<div class="box-item-border">
							<label class="box-item-label">来源:</label>
							<div style="padding-left: 32px;">
								<i-Select size="small" v-model="sendMsg.source">
									<i-Option :value="sources">不限</i-Option>
									<i-Option v-for="(item,index) in increaseList" :value="item.code" :key="index">{{ item.name }}</i-Option>
								</i-Select>
							</div>
						</div>
					</div>

					<div class="box-item left">
						<div class="box-item-border">
							<label class="box-item-label">星级:</label>
							<div style="padding-left: 32px;">
								<i-Select size="small" v-model="sendMsg.clueLevel">
									<i-Option v-for="(item,index) in starList" :value="item.code" :key="index">{{ item.name }}</i-Option>
								</i-Select>
							</div>
						</div>
					</div>
					<div class="box-item left">
						<div class="box-item-border">
							<label class="box-item-label">跟踪状态:</label>
							<div style="padding-left: 54px;" class="clearfix">
								<i-Select size="small" v-model="sendMsg.traceStatus">
									<i-Option v-for="(item,index) in  traceStatus" :value="item.value" :key="index">{{ item.label }}</i-Option>
								</i-Select>
							</div>
						</div>
					</div>
				</div>
				<div class="header-right">
					<Button type="success" class="commonbtn search-button" @click="searchStaff">搜索</Button>
					<Button type="info" class="cancelbtn clear-button" @click="clearStaff">清空</Button>
				</div>
			</div>
		</div>
		<!-- 头部搜索结束 -->
		<!-- 表头操作开始 -->
		<div class="action-wrap">
			<Button type="info" @click="addKeyMtk" size="small" shape="circle" v-if='roleList[216]' icon="md-add-circle">新增线索</Button>
			<Button type="error" @click="delAlllist" size="small" shape="circle" v-if='roleList[217]' icon="md-trash">批量删除</Button>
		</div>
		<!-- 表头操作结束 -->
		<!-- 表格数据开始 -->
		<Table border :columns="columns5" :data="saleTable" size="small" @on-selection-change='selectsupplier'></Table>
		<div style="margin-top:10px;padding-bottom:20px;">
			<span style="float:left">
				小计：共
				<b style="color:#ff0000">{{ pageOp.total == null ? 0 : pageOp.total }}</b>
				条线索,有
				<b style="color:#ff0000">{{ saleTip == null ? 0 : saleTip }}</b>
				条待处理线索
			</span>
			<Page v-model="pageOp" :current="pageOp.pageNum" :total="pageOp.total" style="float:right" :page-size="pageOp.pageSize"
			    size="small" show-sizer placement="top" @on-change="pages" @on-page-size-change="listchange">
			</Page>
		</div>
		<!-- 表格数据结束 -->
		<div style='height:0;overflow:hidden'>
			<Modal title="批量删除" :mask-closable="false" v-model="delAllmtk" width="400">
				<div style="text-align:center">
					<Icon type="md-alert" size='36' color='red' />
					<strong>批量删除所选线索</strong>
					<p style="margin-bottom:20px;">已选择
						<b>{{selectNum==''?0:selectNum}}</b>条,可删除
						<b>{{delselectNum==''?0:delselectNum}}</b>条
					</p>
				</div>
				<div slot="footer" style="text-align:center">
					<Button type='default' @click="delAllHide">取消</Button>
					<Button type="error" :disabled="delAllDis" @click="delAll">确认</Button>
				</div>

			</Modal>
			<Modal title="删除" :mask-closable="false" v-model="delAllmtks" width="400">
				<div style="text-align:center">
					<Icon type="md-alert" size='36' color='red' />
					<strong>确认删除此项？</strong>
				</div>
				<div slot="footer" style="text-align:center">
					<Button type='default' @click="delAllHides">取消</Button>
					<Button type="error" :disabled="delAllDis" @click="delAlls">确认</Button>
				</div>
			</Modal>
			<Modal title="新增线索" v-model="addKey" width="500" :mask-closable="false" :closable='false
				' class-name="vertical-center-modal">
				<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
					<FormItem label="咨询类型:" prop="typePat">
						<i-Select v-model="formValidate.typePat">
							<i-Option v-for="(item,index) in consultLists" :value="item.value" :key="index">{{ item.label }}</i-Option>
						</i-Select>
					</FormItem>
					<FormItem label="数据来源:" prop="source">
						<i-Select v-model="formValidate.source">
							<i-Option v-for="(item,index) in increaseLists" :value="item.code" :key="index">{{ item.name }}</i-Option>
						</i-Select>
					</FormItem>
					<FormItem label="单位:" prop="fCompName">
						<Input :maxlength="40" v-model="formValidate.fCompName"></Input>
					</FormItem>
					<FormItem label="地区:" prop="cityList">
						<Cascader :data="$root.cityArr" v-model="formValidate.cityList" change-on-select></Cascader>
					</FormItem>
					<FormItem label="联系人:" prop="linker">
						<Input :maxlength="12" v-model="formValidate.linker"></Input>
					</FormItem>
					<FormItem label="联系电话:" prop="mobile">
						<Input :maxlength="11" type='text' v-model="formValidate.mobile"></Input>
					</FormItem>
					<FormItem label="跟踪分级:" prop="clueLevel">
						<i-Select v-model="formValidate.clueLevel">
							<i-Option v-for="(item,index) in starLists" :value="item.code" :key="index">{{ item.name }}</i-Option>
						</i-Select>
					</FormItem>
					<FormItem label="跟踪状态:" prop="traceStatus">
						<i-Select v-model="formValidate.traceStatus">
							<i-Option v-for="(item,index) in traceStatu" :value="item.value" :key="index">{{ item.label }}</i-Option>
						</i-Select>
					</FormItem>
					<FormItem label="线索描述:" prop="remark">
						<Input type="textarea" v-model="formValidate.remark" :max-length="200"></Input>
					</FormItem>
				</Form>
				<div slot="footer" style="text-align:center">
					<Button type="default" @click="addKeyCancel">取消</Button>
					<Button type="primary" :disabled="delAllDis" @click="addKeyOk('formValidate')">确认</Button>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import {
		functions,
		getSaleArr,
		starArr,
		increaseArr,
		consultArr,
		saleArr,
		addSale
	} from '../../api/index'
	export default {
		name: 'SaleManage',
		data() {
			return {
				ruleValidate: {
					typePat: [{
						required: true,
						message: '请选择咨询类型',
						trigger: 'change'
					}],
					source: [{
						required: true,
						message: '请选择数据来源',
						trigger: 'change'
					}],
					fCompName: [{
						required: true,
						message: '请输入单位名称',
						trigger: 'blur'
					}],
					cityList: [{
						required: true,
						type: 'array',
						min: 2,
						message: '至少选择到市区',
						trigger: 'change'
					}],
					linker: [{
						required: true,
						message: '请输入联系人',
						trigger: 'blur'
					}],
					mobile: [{
							required: true,
							message: '请输入联系电话',
							trigger: 'blur'
						},
						{
							type: 'string',
							message: '请输入合法联系电话',
							trigger: 'blur'
						}
					],
					clueLevel: [{
						required: true,
						message: '请选择跟踪分级',
						trigger: 'change'
					}],
					traceStatus: [{
						required: true,
						message: '请选择跟踪状态',
						trigger: 'change'
					}],
					remark: [{
							required: true,
							min: 1,
							message: '请输入备注',
							trigger: 'blur'
						},
						{
							type: 'string',
							max: 200,
							message: '最多200个字符',
							trigger: 'blur'
						}
					]
				},
				sources: -1,
				// 新增线索
				addKey: false,
				// 批量操作数据
				delAllmtk: false,
				delAllmtks: false,
				selectNum: 0,
				delselectNum: 0,
				delAllDis: false,
				cityArr: [],
				timeVal: [],
				sendMsg: {
					keyWord: null,
					upTimeBegin: null,
					upTimeEnd: null,
					saleId: -1,
					type: -1,
					provinceId: null,
					cityId: null,
					source: -1,
					clueLevel: -1,
					traceStatus: -1,
					orderBy: ''
				},
				saleList: [],
				saleTip: 0,
				relation: [],
				consultList: [],
				consultLists: [],
				increaseList: [],
				increaseLists: [],
				starList: [],
				starLists: [],
				traceStatus: [{
						value: -1,
						label: '不限'
					},
					{
						value: 1,
						label: '待处理'
					},
					{
						value: 2,
						label: '已追踪'
					},
					{
						value: 3,
						label: '待下单'
					},
					{
						value: 4,
						label: '已成单'
					},
					{
						value: 5,
						label: '已中止'
					},
					{
						value: 6,
						label: '已暂停'
					}
				],
				traceStatu: [{
						value: '1',
						label: '待处理'
					},
					{
						value: '2',
						label: '已追踪'
					},
					{
						value: '3',
						label: '待下单'
					},
					{
						value: '4',
						label: '已成单'
					},
					{
						value: '5',
						label: '已中止'
					},
					{
						value: '6',
						label: '已暂停'
					}
				],
				city: [],
				saleTable: [],
				pageOp: {},
				columns5: [{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '编号',
						key: 'id',
						width: 180,
						align: 'center'
					},
					{
						title: '单位',
						align: 'center',
						key: 'companyName',
						width: 160
					},
					{
						title: '联系人',
						align: 'center',
						key: 'linker',
						width: 120
					},
					{
						title: '咨询业务',
						align: 'center',
						key: 'typeName',
						width: 120
					},
					{

						title: '联系电话',
						align: 'center',
						key: 'mobile',
						width: 120
					},
					{
						title: '来源地区',
						align: 'center',
						key: 'provinceName',
						width: 160,
						render(h, params) {
							let text = ''
							if (params.row.provinceName) {
								text += params.row.provinceName
							}
							if (params.row.cityName) {
								text += '-' + params.row.cityName
							}
							if (params.row.districtName) {
								text += '-' + params.row.districtName
							}
							return h('div', {}, text)
						}
					},
					{
						title: '评级',
						align: 'center',
						key: 'clueLeveName',
						width: 100
					},
					{
						title: '跟踪状态',
						align: 'center',
						key: 'traceStatus',
						width: 120,
						render(h, params) {
							let text = ''
							switch (parseInt(params.row.traceStatus)) {
								case 1:
									text = '待处理'
									break
								case 2:
									text = '已追踪'
									break
								case 3:
									text = '待下单'
									break
								case 4:
									text = '已成单'
									break
								case 5:
									text = '已中止'
									break
								case 6:
									text = '已暂停'
									break
							}
							return h('div', {}, text)
						}
					},
					{
						title: '处理销售',
						align: 'center',
						key: 'saleName',
						width: 120
					},
					{
						title: '渠道来源',
						align: 'center',
						key: 'sourceName',
						width: 120
					},
					{
						title: '更新日期',
						align: 'center',
						width: 150,
						key: 'upTimeDate'
					},
					{
						title: '操作',
						align: 'center',
						key: 'action',
						fixed: 'right',
						width: 150,
						render: (h, params) => {
							let paramData = []
							if (this.roleList[314]) {
								paramData.push(h('Button', {
									props: {
										type: 'info',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.addTab({
												path: '/businessManagement/saleManageDetails/' + params.row.id,
												name: params.row.id,
												selected: true
											})
										}
									}
								}, '线索管理'))
							}
							if (this.roleList[315]) {
								paramData.push(h('Button', {
									props: {
										type: 'error',
										size: 'small'
									},
									on: {
										click: () => {
											this.delAllmtks = true
											this.alldelesupplierID = [params.row.id]
										}
									}
								}, '删除'))
							}
							return h('div', paramData)
						}
					}
				],
				formValidate: {
					mobile: '',
					linker: '',
					typePat: '',
					traceStatus: 1,
					clueLevel: '',
					cityList: [],
					source: '',
					fCompName: '',
					remark: ''
				},
				roleList: []
			}
		},
		mounted() {
			this.getSaleList()
		},
		created() {
			this.getRouterId()
			this.addTab = this.$parent.$parent.$parent.$parent.$parent.addTab
			this.getCom()
		},
		methods: {
			// 权限配置
			getRouterId() {
				let roleIdArr = []
				let roleId = JSON.parse(window.localStorage.inf).roles
				roleId.forEach((itemId, index) => {
					roleIdArr.push(itemId.id)
				})
				let sendMsg = {
					roleIds: roleIdArr,
					menuId: 20
				}
				functions(sendMsg).then(res => {
					let {
						code,
						message,
						result
					} = res
					if (code == 0) {
						this.roleList = result
					}
				}).catch(res => {
					this.$Message.error(res.message)
				})
			},
			// 获取销售线索列表
			getSaleList() {
				this.$Spin.show({
					render: (h) => {
						return h('div', [
							h('div', 'Loading')
						])
					}
				})
				let sendMsg = {
					keyWord: this.sendMsg.keyWord ? this.$root.strTrim(this.sendMsg.keyWord) : null,
					saleId: this.sendMsg.saleId == -1 ? null : this.sendMsg.saleId,
					type: this.sendMsg.type == -1 ? null : this.sendMsg.type,
					source: this.sendMsg.source == -1 ? null : this.sendMsg.source,
					clueLevel: this.sendMsg.clueLevel == -1 ? null : this.sendMsg.clueLevel,
					traceStatus: this.sendMsg.traceStatus == -1 ? null : this.sendMsg.traceStatus,
					pageSize: this.pageOp.pageSize ? this.pageOp.pageSize : 10,
					pageNum: this.pageOp.pageNum ? this.pageOp.pageNum : 1,
					orderBy: this.sendMsg.orderBy,
					upTimeBegin: this.sendMsg.upTimeBegin,
					upTimeEnd: this.sendMsg.upTimeEnd,
					provinceId: this.sendMsg.provinceId,
					cityId: this.sendMsg.cityId
				}
				getSaleArr(sendMsg).then(res => {
					let {
						code,
						pageMessage,
						message,
						result
					} = res
					if (code == 0) {
						this.$Spin.hide()
						this.saleTable = result
						this.pageOp = pageMessage
						if (res.specialResult) {
							this.saleTip = res.specialResult.trace ? res.specialResult.trace : 0
						}
					} else {
						this.$Spin.hide()
						this.$Message.warning(message)
					}
				}).catch(res => {
					this.$Spin.hide()
					this.$Message.error(res.message)
				})
			},
			// 获取公共字典
			getCom() {
				starArr().then(res => {
					let {
						code,
						message,
						result
					} = res
					if (code == 0) {
						this.starLists = result
						let list = [{
							name: '不限',
							code: -1
						}]
						if (code == 0) {
							for (let i in result) {
								list.push({
									code: result[i].code,
									name: result[i].name
								})
							}
							this.starList = list
						}
						this.sendMsg.clueLevel = -1
					}
				}).catch(res => {
					this.$Message.error(res.message)
				})
				increaseArr().then(res => {
					let {
						code,
						message,
						result
					} = res
					if (code == 0) {
						let list = result
						this.increaseList = list
						this.sendMsg.source = -1
						this.increaseLists = result
					}
				}).catch(res => {
					this.$Message.error(res.message)
				})
				consultArr().then(res => {
					let {
						code,
						message,
						result
					} = res
					let list = [{
							value: -1,
							label: '不限'
						}],
						clist = []
					if (code == 0) {
						for (let i = 0; i < result.length; i++) {
							list.push({
								value: result[i].code,
								label: result[i].name
							})
							clist.push({
								value: result[i].code,
								label: result[i].name
							})
						}
					}
					this.consultList = list
					this.consultLists = clist
					this.sendMsg.type = -1
				}).catch(res => {
					this.$Message.error(res.message)
				})
				saleArr({
					roleId: 4
				}).then(res => {
					let {
						code,
						message,
						result
					} = res
					result.unshift({
						name: '不限',
						id: -1
					})
					if (code == 0) {
						this.saleList = res.result
					}
					this.sendMsg.saleId = -1
				}).catch(res => {
					this.$Message.error(res.message)
				})
			},
			/**
			 * @event 翻页操作
			 * @param type {nummber}
			 **/
			pages(a) {
				this.pageOp.pageNum = a
				this.getSaleList()
			},
			/**
			 * @event 列表尺寸改变
			 * @param type {nummber}
			 **/
			listchange(a) {
				this.pageOp.pageNum = 1
				this.pageOp.pageSize = a
				this.getSaleList()
			},
			// 列表搜索方法
			searchStaff() {
				this.pageOp.pageNum = 1
				this.getSaleList()
			},
			// 搜索条件清空
			clearStaff() {
				this.sendMsg = {
						keyWord: null,
						upTimeBegin: null,
						upTimeEnd: null,
						saleId: -1,
						type: -1,
						provinceId: null,
						cityId: null,
						source: -1,
						clueLevel: -1,
						traceStatus: -1,
						orderBy: ''
					},
					this.cityArr = []
				this.timeVal = []
			},
			// 赋值地区参数
			// type array
			citychange(a) {
				if (a[0]) {
					this.sendMsg.provinceId = a[0]
				}
				if (a[1]) {
					this.sendMsg.cityId = a[1]
				}
				if (a[2]) {
					this.sendMsg.districtName = a[2]
				}
			},
			// 时间选择器change事件
			// type array
			timeChange(a) {
				if (a) {
					this.sendMsg.upTimeBegin = a[0]
					this.sendMsg.upTimeEnd = a[1]
				}
			},
			/**
			 * /@event 列表全选事件
			 * /@param 当前列表所选数据集合
			 * /@type array
			 **/
			selectsupplier(allSelectlen) {
				const self = this
				let deleteSuppliers = []
				self.selectNum = allSelectlen.length
				allSelectlen.forEach((ite, index) => {
					deleteSuppliers.push(ite.id)
				})
				self.alldelesupplierID = deleteSuppliers
				self.delselectNum = deleteSuppliers.length
			},
			// 全部删除事件
			delAlllist() {
				if (this.selectNum === 0) {
					this.$Message.warning('请选择要删除的销售线索！')
				} else {
					this.delAllmtk = true
				}
			},
			delAll() {
				const self = this
				var getHostUrl = this.$root.baseUrl
				self.$http.post(getHostUrl + '/qthl-wf-busi/api/clueInfo/delete/batch',
					JSON.stringify({
						ids: this.alldelesupplierID
					}), {
						emulateJSON: true
					}).then(response => {
					let resd = response.data
					if (resd.code == 0) {
						this.$Message.success(resd.message)
						this.delAllmtk = false
						this.selectNum = 0
						this.delselectNum = 0
						this.getSaleList()
					} else {
						this.$Message.error(resd.message)
					}
				}, response => {
					console.log('error:', response) // for debug
				})
			},
			delAllHide() {
				this.delAllmtk = false
			},
			// 单个删除
			delAlls() {
				const self = this
				var getHostUrl = this.$root.baseUrl
				self.$http.post(getHostUrl + '/qthl-wf-busi/api/clueInfo/delete/batch',
					JSON.stringify({
						ids: this.alldelesupplierID
					}), {
						emulateJSON: true
					}).then(response => {
					let resd = response.data
					if (resd.code == 0) {
						this.$Message.success(resd.message)
						this.delAllmtks = false
						this.getSaleList()
					} else {
						this.$Message.error(resd.message)
					}
				}, response => {
					console.log('error:', response) // for debug
				})
			},
			delAllHides() {
				this.delAllmtks = false
			},
			// 新增线索
			addKeyMtk() {
				this.addKey = true
			},
			addKeyCancel() {
				this.formValidate = {
					mobile: '',
					linker: '',
					typePat: '',
					traceStatus: '',
					clueLevel: '',
					source: '',
					fCompName: '',
					remark: ''
				}
				this.addKey = false
			},
			addKeyOk(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(this.formValidate.mobile))) {
							this.$Message.error('手机号码非法！')
						} else {
							let vvs = {
								clueInfo: {
									province: this.formValidate.cityList[0] ? this.formValidate.cityList[0] : null,
									city: this.formValidate.cityList[1] ? this.formValidate.cityList[1] : null,
									district: this.formValidate.cityList[2] ? this.formValidate.cityList[2] : null,
									mobile: this.formValidate.mobile,
									linker: this.formValidate.linker,
									type: this.formValidate.type,
									traceStatus: this.formValidate.traceStatus,
									clueLevel: this.formValidate.clueLevel,
									source: this.formValidate.source,
									clType: 1
								},
								clueCompany: {
									fCompName: this.formValidate.fCompName,
									type: 'clue'
								},
								clueMessage: {
									message: this.formValidate.remark
								}
							}
							addSale(vvs).then(res => {
								let {
									code,
									message,
									result
								} = res
								if (code == 0) {
									this.$Message.success(message)
									this.addKey = false
									this.addKeyCancel()
									this.getSaleList()
								} else {
									this.$Message.error(message)
								}
							}).catch(res => {
								this.$Message.error(res.message)
							})
						}
					} else {
						this.$Message.error('Fail!')
					}
				})
			}
		}
	}
</script>
<style scoped>
	.demo-spin-icon-load {
		animation: ani-demo-spin 1s linear infinite;
	}

	#SaleManage {
		width: 100%;
		padding: 10px;
	}

	#SaleManage .action-wrap {
		width: 100%;
		height: 40px;
		line-height: 40px;
		border: 1px solid #ddd;
		padding: 0 5px;
		border-bottom: none
	}
</style>