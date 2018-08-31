<template>
	<div id="saleManageDetails">
		<div class="t_head">
			<Button type="info" class="commonbtn smal" v-if='roleList[316]' @click="patTrue">修改线索</Button>
			<Button type="primary" class="commonbtn smal" v-if='roleList[319]' @click="refresh">刷新</Button>
		</div>
		<Card>
			<p slot="title">基本信息</p>
			<p>
				<Row>
					<Col span="12">
						<p style='line-height:45px'><b>咨询类型：</b><cite>{{saleInf.typeName?saleInf.typeName:'暂无'}}</cite></p>
					</Col>
					<Col span="12">
						<p style='line-height:45px'><b>联系人：</b><cite>{{saleInf.linker?saleInf.linker:'暂无'}}</cite></p>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<p style='line-height:45px'><b>对方公司：</b><cite>{{clueCompany.fCompName?clueCompany.fCompName:'暂无'}}</cite></p>
					</Col>
					<Col span="12">
						<p style='line-height:45px'><b>我方公司：</b><cite>{{allInf.companyName?allInf.companyName:'暂无'}}</cite></p>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<p style='line-height:45px'><b>联系电话：</b><cite>{{saleInf.mobile?saleInf.mobile:'暂无'}}</cite></p>
					</Col>
					<Col span="12">
						<p style='line-height:45px'><b>跟踪销售：</b><cite>{{saleInf.saleName?saleInf.saleName:'暂无'}}</cite></p>
					</Col>
				</Row>
				<Row v-if="clueMessage[0]">
					<Col span="24">
						<p style='line-height:45px'><b>备注：</b>{{clueMessage[0].message}}</p>
					</Col>
				</Row>
			</p>
		</Card>
		<Card style='margin-top:10px;'>
			<p slot="title">跟踪分级</p>
			<p>
				<Row>
					<Col span="12">
						<p style='line-height:45px'>
							<b>线索分级：</b>
							<i-Select style="width:80px;overflow:auto" v-model="saleInf.clueLevel" :disabled="disabled" size="small">
								<i-Option v-for="(item,index) in starList" :value="item.code" :key="index">{{ item.name }}</i-Option>
							</i-Select>
							<Button type="warning" v-if="disabled && roleList[320]" @click="disabled=false" class="smal sty" size="small">修改</Button>
							<Button type="primary" v-if="!disabled && roleList[320]" class="smal sty" @click="clueLevelClick" size="small">提交</Button>
						</p>
					</Col>
					<Col span="12">
						<p style='line-height:45px'>
							<b>跟踪状态：</b>
							<i-Select style="width:80px;overflow:auto" v-model="saleInf.traceStatus" :disabled="disableds" size="small">
								<i-Option v-for="(item,index) in traceStatus" :value="item.value" :key="index">{{ item.label }}</i-Option>
							</i-Select>
							<Button type="warning" v-if="disableds && roleList[321]" @click="disableds=false" size="small">修改</Button>
							<Button type="primary" v-if="!disableds && roleList[321]" @click="traceStatusClick"  size="small">提交</Button>
						</p>
					</Col>
				</Row>
			</p>
		</Card>
		<Card style='margin-top:10px;'>
			<p slot="title">上传附件</p>
			<p>
				<Row style='line-height:30px;background:#eee;padding:0 5px;'>
					<Col span="6">文件名</Col>
					<Col span="6">日期</Col>
					<Col span="6">上传人</Col>
					<Col span="6">操作</Col>
				</Row>
				<Row v-for="(x,index) in attachments" :key="index" style='padding:5px;'>
					<Col span="6"><a v-bind:href="x.dicImgUrl" target="_blank">{{x.dicImgName}}</a></Col>
					<Col span="6">{{x.dicImgCreateTime}}</Col>
					<Col span="6">{{x.dicImgOperName}}</Col>
					<Col span="6">
						<span style='cursor:pointer' @click="delli=true,dFiles(x.dicImgUrl)">
							<Icon type="md-trash" />
						</span>
					</Col>
				</Row>
			</p>
			<p>
				<Button v-if='roleList[322]' type="primary" size="small" @click="upload=true"
					style="margin-top:10px;">
					<span v-if="attachments.length!=0">继续添加</span><span v-else>上传附件</span>
				</Button>
			</p>
		</Card>
		
		<Card style='margin-top:10px;'>
			<p slot="title">跟踪记录</p>
			<p>
				<Row>
					<Col>
						<i-Select style="width:130px;float:left" v-model="attenType">
							<i-Option :value="3">@ 写操作日志</i-Option>
							<i-Option :value="1">@ 写私有备注</i-Option>
						</i-Select>
					</Col>
					<Col>
						<Input placeholder="请选择记录类型并填写" style="width:260px;float:left;margin-left:10px;" :max-length="250" v-model="message"></Input>
					</Col>
					<Col>
						<Button type="info" style="width:80px;height:32px;margin-left:10px;float:left" @click="traceInfo">提交</Button>
					</Col>
				</Row>
			</p>
			<p style='margin-top:10px;'>
				<Timeline>
					<Timeline-item :color="index==0?'red':'blue'" v-for="(item,index) in dicTraceInfoList" :key="index">
						<span v-if="item.attenType!=3">【{{item.senderName}}】@{{item.attenName}} : </span>
						<span>{{item.message}}</span>
						<p>{{item.createTime}}</p>
					</Timeline-item>
				</Timeline>
			</p>
			<p style="margin-left:20px;color:#4eaeab;cursor:pointer" @click="viewMore" v-if="this.pagetotal>5">查看更多</p>
		</Card>
		<!-- 转交线索 -->
		<div style='height:0;overflow:hidden'>
			<!-- 删除 -->
			<Modal title="删除" v-model="delli" :mask-closable="false" width="400">
				<div style="text-align:center">
					<Icon type="md-alert" size='36' color='red' />
					<strong>确认删除此项?</strong>
				</div>
				<div slot="footer" style='text-align:center'>
					<Button type="default" @click="delli=fasle">取消</Button>
					<Button type="primary" @click="delfile" >提交</Button>
				</div>
			</Modal>
			<!-- 上传附件 -->
			<Modal title="上传附件" :mask-closable="false" v-model="upload" width="700">
				<div style='line-height:40px;border-radius:5px;background:orange;color:#fff;padding:0 10px;'>
					<Icon type="md-alert" size='18' color='red' />
					温馨提示：最多可添加五个文件
				</div>
				<Row style='line-height:30px;padding:0 5px;'>
					<Col span="12">文件名</Col>
					<Col span="12">上传进度</Col>
				</Row>
				<Row style='line-height:30px;padding:0 5px;' v-for="(x,index) in uploadList" :key="index">
					<Col span="10">{{x.dicImgName}}</Col>
					<Col span="10"><Progress :percent="x.percentage" style="width:90%"></Progress></Col>
					<Col span="4">
						<span @click="delmation(x,index)">
							<Icon type="ios-close" style="font-size:18px;color:red;cursor:pointer"></Icon>
						</span>
					</Col>
				</Row>
				<Upload ref="upload" :multiple="false" :show-upload-list="false" :format="['jpg','jpeg','png','doc','txt','docx','pdf','rtf','wps','xls','xlsx']"
					:data="{userId:this.aid,type:'sales_clues'}" :action="aurlss" :headers="{token:this.token,email:this.email}"
					:on-format-error="handleFormatErrors" :on-success="onUploadedList" :before-upload="handleBeforeUpload"
					:on-exceeded-size="handleMaxSize" style="padding:10px;">
					<Button type="default" size="small" icon="ios-cloud-upload-outline">上传文件</Button>
				</Upload>
				<div slot="footer" style='text-align:center'>
					<Button type="default" @click="upload=false,uploadList=[]">取消</Button>
					<Button type="primary" @click="upbtn" >提交</Button>
				</div>
			</Modal>
			<!-- 刷新 -->
			<Modal v-model="refreshModel" title="刷新提示" width="400">
				<div class="box">
					<p>线索刷新成功！</p>
					<p>线索的提交日期更新为{{messageResult}}</p>
				</div>
				<div slot="footer">
				</div>
			</Modal>
			<Modal title="修改线索" v-model="patKeymtk" :mask-closable="false" width="400" >
				<div class="key-body">
					<ul>
						<li class="form-list">
							<div class="form-l">
								<label>您的公司:</label>
								<p>
									<Input v-model="patchInf.fCompName"></Input>
								</p>
							</div>
						</li>
						<li class="form-list">
							<div class="form-l">
								<label>所在地:</label>
								<p>
									<Cascader :render-format="format" @on-visible-change="changBlur" :data="this.$root.cityArr" v-model="cityArr"
									    change-on-select></Cascader>
								</p>
							</div>
						</li>
						<li class="form-list">
							<div class="form-l">
								<label>联系人:</label>
								<p>
									<Input v-model="patchMsg.linker"></Input>
								</p>
							</div>
						</li>
						<li class="form-list">
							<div class="form-l">
								<label>联系电话:</label>
								<p>
									<Input v-model="patchMsg.mobile"></Input>
								</p>
							</div>
						</li>
					</ul>
				</div>
				<div slot="footer" style="text-align:center">
					<Button type='default' @click="patKey" class="ivu-btn-text">取消</Button>
					<Button type="primary" :disabled="delAllDis" @click="patKeyOk">确认</Button>
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
		saleInf,
		record,
		updateStar,
		updateStatus,
		refreshApi,
		uploadFile,
		delFiles,
		updateSaleInf,
		addTrace
	} from '../../api/index'
	export default {
		name: 'SaleManageDetails', //组件名称    
		data() { //组件数据
			const baseUrl = this.$root.baseUrl;
			return {
				aurlss: baseUrl + '/qlth-wf-base/api/file/upload',
				refreshModel: false,
				loading3: false,
				delAllDis: false,
				upload: false,
				disabled: true,
				disableds: true,
				isActive: false,
				messageResult: '',
				// 线索基本 信息
				saleInf: {},
				attachments: [],
				pageSize: 5,
				attenType: 1,
				message: '',
				dicTraceInfoList: [],
				pagetotal: 0,
				dicTraceInfoList: [],
				pagetotal: "",
				uploadList: [],
				delli: false,
				scaleList: [],
				urls: '',
				aid: "",
				boundMtk: false,
				message: "",
				token: "",
				email: "",
				index_i: '',
				starList: [],
				clueCompany: {},
				patKeymtk: false,
				compIds: '',
				attenType: 3,
				city: [],
				verdict: false,
				cityArr: [],
				traceStatus: [{
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
					},
				],
				clueMessage: [],
				companiesList: [],
				patchMsg: {},
				patchInf: {},
				allInf: {},
				roleList: [],
			}
		},
		created() {
			this.addTab = this.$parent.$parent.$parent.$parent.$parent.addTab;
		},
		mounted() {
			this.getRouterId()
			this.getCom()
			this.token = JSON.parse(window.localStorage.inf).token;
			this.email = JSON.parse(window.localStorage.inf).email;
			this.aid = JSON.parse(window.localStorage.inf).id;
			this.getSaleInf()
			this.getRecord()
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
			// 跳转单位
			goComp() {
				this.addTab({
					path: '/clientmanagement/unitfile/' + this.allInf.companyId,
					name: this.allInf.companyName + '档案',
					selected: true
				})
			},
			//公司动态检索
			remoteMethod9(query) {
				if (query) {
					this.loading3 = true;
					setTimeout(() => {
						let types = [];
						getCompany(query).then(res => {
							this.loading3 = false;
							let {
								code,
								message,
								result
							} = res
							if (code == 0) {
								let list = result;
								this.companiesList = list
							}
						}).catch(res => {
							this.loading3 = false;
							this.$Message.error(res.message)
						})
					}, 1000);
				} else {
					this.compoptions = [];
				}
			},
			// 修改线索
			patKey() {
				this.patKeymtk = false
			},
			patKeyOk() {
				if (!this.patchMsg.mobile || !this.patchMsg.linker || !this.patchInf.fCompName || !this.cityArr.length) {
					this.$Message.warning("带 ‘*’ 为必填项！")
				} else if (!this.cityArr[1]) {
					this.$Message.warning("地区必须到市！")
				} else if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(this.patchMsg.mobile))) {
					this.$Message.error("手机号码非法！")
				} else {
					let vvs = {
						clueInfo: {
							id: this.$route.params.id,
							province: this.cityArr[0],
							city: this.cityArr[1],
							district: this.cityArr[2],
							mobile: this.patchMsg.mobile,
							linker: this.patchMsg.linker
						},
						clueCompany: {
							id: this.patchInf.id,
							fCompName: this.patchInf.fCompName,
						}
					}
					updateSaleInf(vvs).then(res=>{
						let {code,message,result}=res
						if(code==0){
							this.$Message.success(message)
							this.patKeymtk = false
							this.getSaleInf()
						}else {
							this.$Message.warning(message)
						}
					}).catch(res=>{
						this.$Message.error(res.message)
					})
				}
			},
			//级联回显判断
			changBlur() {
				this.verdict = true
			},
			//级联组件回显
			format(labels, selectedData) {
				if (this.verdict) {
					return labels.join("/")
				} else {
					return this.liveStr
				}
			},
			patTrue() {
				saleInf(this.$route.params.id).then(res => {
					let {
						code,
						message,
						result
					} = res
					if (code == 0) {
						this.patchMsg = result.clueInfoVO ?result.clueInfoVO : {};
						this.patchInf = result.clueCompany ? result.clueCompany : {};
						result.clueInfoVO.district ? this.cityArr = [result.clueInfoVO.province, result.clueInfoVO.city,
							result.clueInfoVO.district
						] : this.cityArr = [result.clueInfoVO.province, result.clueInfoVO.city]
						this.liveStr = result.clueInfoVO.district ? result.clueInfoVO.provinceName + '/' + result.clueInfoVO
							.cityName + '/' + result.clueInfoVO.districtName : result.clueInfoVO.provinceName + '/' + result.clueInfoVO
							.cityName
					}
				}).catch(res => {
					this.$Message.error(res.message)
				})
				this.patKeymtk = true
			},
			//刷新
			refresh() {
				refreshApi(this.$route.params.id).then(res=>{
					let {code,message,result} =res;
					if(code==0){
						this.messageResult = result
						this.refreshModel = true
						setTimeout(() => {
							this.refreshModel = false
						}, 2500)
					}else {
						this.$Message.error(res.message)
					}
				}).catch(res=>{
					this.$Message.error(res.message)
				})
			},
			//线索分级
			clueLevelClick() {
				if (!this.saleInf.clueLevel) {
					this.$Message.warning("请选择线索分级")
				}
				let vvs = {
					clueInfo: {
						id: this.$route.params.id,
						clueLevel: this.saleInf.clueLevel
					}
				}
				updateStar(vvs).then(res=>{
					let {code, result, message} = res
					if(code==0){
						this.$Message.success(message)
						this.disabled = true
						this.getSaleInf()
					}
				}).catch(res=>{
					this.$Message.error(res.message)
				})
			},
			//跟踪状态
			traceStatusClick() {
				if (!this.saleInf.traceStatus) {
					this.$Message.warning("请选择跟踪状态")
				}
				let vvs = {
					clueInfo: {
						id: this.$route.params.id,
						traceStatus: this.saleInf.traceStatus

					}
				}
				updateStatus(vvs).then(res=>{
					let {code, result, message} = res
					if(code==0){
						this.$Message.success(message)
						this.disableds = true
						this.getSaleInf()
					}else {
						this.$Message.error(message)
					}
				}).catch(res=>{
					this.$Message.error(res.message)
				})
			},
			//初始化跟踪记录
			getRecord() {
				let vvs = {
					busiId: this.$route.params.id,
					cgroup: "saleClue",
					pageNum: 1,
					pageSize: this.pageSize
				}
				record(vvs).then(res=>{
					let {
						code,
						pageMessage,
						message,
						result
					} = res
					if (code == 0) {
						this.dicTraceInfoList = result
						this.pagetotal = pageMessage.total
					} else {
						this.$Message.warning(message)
					}
				}).catch(res=>{
					this.$Message.error(res.message)
				})
			},
			//提交跟踪记录
			traceInfo() {
				let attenId, attenName
				if (this.attenType == 1) {
					attenId = JSON.parse(window.localStorage.inf).id;
					attenName = JSON.parse(window.localStorage.inf).username;
				} else if (this.attenType == 3) {
					attenId = null
					attenName = null
				}
				let vvs = {
					busiId: this.$route.params.id,
					cgroup: "saleClue",
					senderId: JSON.parse(window.localStorage.inf).id,
					senderName: JSON.parse(window.localStorage.inf).username,
					attenType: this.attenType,
					message: this.message,
					attenId: attenId,
					attenName: attenName
				}
				addTrace(vvs).then(res=>{
					let {code,message,result}=res
					if (code == 0) {
						this.$Message.success(message)
						this.attenType = ""
						this.message = ""
						this.getRecord()
					} else {
						this.$Message.warning(message)
					}
				}).catch(res=>{
					this.$Message.error(res.message)
				})
			},
			//查看更多
			viewMore() {
				if (this.dicTraceInfoList.length == this.pagetotal) {
					this.$Message.warning("没有更多了！")
				} else {
					this.pageSize += 5
					let vvs = {
						busiId: this.$route.params.id,
						cgroup: "saleClue",
						pageNum: 1,
						pageSize: this.pageSize
					}
					record(vvs).then(res=>{
						let {code,message,pageMessage,result}=res
						if (code == 0) {
							this.dicTraceInfoList = result
							this.pagetotal =pageMessage.total
						} else {
							this.$Message.warning(message)
						}
					}).catch(res=>{
						this.$Message.error(res.message)
					})
				}
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
				}).catch(res => {
					this.$Message.error(res.message)
				})
			},
			//   获取销售线索基本信息
			getSaleInf() {
				saleInf(this.$route.params.id).then(res => {
					let {
						code,
						message,
						result
					} = res
					if (code == 0) {
						this.clueMessage = result.clueMessage
						this.clueCompany = result.clueCompany ? result.clueCompany : {};
						this.saleInf =result.clueInfoVO;
						this.attachments = result.attachments;
						this.allInf = result
					}
				}).catch(res => {
					this.$Message.error(res.message)
				})
			},
			// 删除附件
			dFiles(a) {
				this.urls = a
			},
			delfile() {
				const self = this;
				var getHostUrl = this.$root.baseUrl;
				let vv = {
					busiIds: [{
						id: this.$route.params.id
					}],
					cgroup: 'sales_clues',
					imgUrls: [{
						dicImgUrl: this.urls
					}]
				};
				delFiles(vv).then(res=>{
					let {code,message,result}=res
					if(code==0){
						this.$Message.success(message);
						this.delli=false;
						this.getSaleInf()
					}else{
						this.$Message.warning(message);
					}
				}).catch(res=>{
					this.$Message.error(res.message);
				})
			},
			// 附件上传
			upbtn() {
				let list = this.uploadList
				for (let i in list) {
					delete list[i].percentage
				}
				const self = this;
				var getHostUrl = this.$root.baseUrl;
				let vv = {
					clueInfo: {
						id: this.$route.params.id
					},
					dicAttachments: list
				};
				uploadFile(vv).then(res=>{
					let {code,message,result}=res;
					if (code == 0) {
						this.$Message.success(message)
						this.uploadList = [];
						this.getSaleInf();
						this.upload = false
					}
				}).catch(res=>{
					this.$Message.error(res.message)
				})
			},
			delmation(file, index) {
				this.uploadList.splice(this.uploadList.indexOf(file), 1)
			},
			//--------------上传附件
			handleFormatErrors(file) {
				this.$Notice.warning({
					title: '附件格式不正确',
					desc: '附件 ' + file.name + ' 格式不正确，请上传jpg,jpeg,png,doc,txt,docx,pdf,rtf,wps,xls,xlsx格式的附件。'
				});
			},
			handleMaxSize(file) {
				this.$Notice.warning({
					title: '超出附件大小限制',
					desc: '附件 ' + file.name + ' 太大，不能超过 10M。'
				});
			},
			handleBeforeUpload() {
				const check = this.uploadList.length < 5;
				if (!check) {
					this.$Notice.warning({
						title: '最多只能上传 5 张图片。'
					});
				}
				return check;
			},
			onUploadedList(a, b, c) {
				if (a.code == 801 || a.code == 802 || a.code == 803 || a.code == 804) {
					this.$Message.error(a.message);
					this.$router.push({
						path: '/login'
					})
				} else {
					if (!a.code) {
						this.uploadList.push({
							dicImgName: b.name,
							percentage: b.percentage,
							dicImgUrl: b.response.result,
							dicImgBusiId: this.$route.params.id,
							dicImgCgroup: "sales_clues",
							dicImgOperId: JSON.parse(window.localStorage.inf).id,
							dicImgOperName: JSON.parse(window.localStorage.inf).username
						})
					} else {
						this.$Message.error(a.message)
					}
				}
			}
		},
	}
</script>

<style lang='less' scoped>
#saleManageDetails{
	width:100%;
	height:100%;
	padding:0 10px;
	.t_head{
		width:100%;
		height:52px;
		margin: 10px 0;
		padding:10px 5px;
		border-radius: 5px;
		border:1px solid #eee;
	}	
}
</style>