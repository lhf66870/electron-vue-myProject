<template>
	<div class="layout" id="index">
		<Layout>
			<Header :style="{width: '100%'}">
				<div class='f_box'>
					<div class='f_box_l f_box_l_t'>
						蜂巢引擎
					</div>
					<div class='f_box_c'>
						<div style='position: relative;'>
							<div style='position: absolute;' ref="scrollOuter">
								<div class='sliderNav' ref="scrollBody" :style="{left: tagBodyLeft + 'px'}">
									<Tag checkable v-for="(item, index) in menuTopList" :key="index" :name="index" type="dot" :closable='index!==0'
										@on-close="deleteTab(index)">
										<a :title="item.name" @click="gotoPage(item, index)" @contextmenu="closeAll(index,$event)">{{item.name}}</a>
									</Tag>
								</div>
							</div>
						</div>
						

						<div id='closeTab' class='closeTab' :style='closeTab'>
							<ul>
								<li @click='closeSelect(1)'>
									<Icon type="md-close-circle" style='padding-right:5px;' />关闭全部</li>
								<li @click='closeSelect(2)'>
									<Icon type="md-arrow-dropleft-circle" style='padding-right:5px;' />关闭左侧</li>
								<li @click='closeSelect(3)'>
									<Icon type="md-arrow-dropright-circle" style='padding-right:5px;' />关闭右侧</li>
							</ul>
						</div>
					</div>
					<div class='f_box_r'>
						<Button type="success" shape="circle" icon="md-arrow-dropleft-circle" @click='handleScroll(240)' style='margin:0 2px;'></Button>
						<Button type="success" shape="circle" icon="md-arrow-dropright-circle" @click='handleScroll(-240)' style='margin:0 2px;'></Button>
						<Button type="primary" shape="circle" v-if='allTrue' icon="md-contract" @click='exitFullscreen' style='margin:0 2px;'></Button>
						<Button type="primary" shape="circle" v-else icon="md-expand" @click='requestFullScreen' style='margin:0 2px;'></Button>
						<Button type="info" shape="circle" icon="md-lock" @click='setClock' style='margin:0 2px;'></Button>
						<Button type="error" @click='getOut' shape="circle" style='margin-left:2px;' icon="md-log-out"></Button>
					</div>
				</div>

			</Header>
			<Layout>
				<Sider>
					<Menu :theme="theme1" accordion>
						<Submenu :name="menu.id" v-for="(menu, index) in Menus" v-if="menu.id!=54 && menu.children" :key="index">
							<template slot="title">
								<Icon :type="iconName(menu.imgUrl).name" /> {{menu.name}}
							</template>
							<Menu-item :name="index+'-'+child_i" v-for="(child, child_i) in menu.children" :key="child_i">
								<div @click="menuRouter(menuPath(child.routeId), child)">{{child.name}}</div>
							</Menu-item>
						</Submenu>
					</Menu>
				</Sider>
				<Layout :style="{padding: '10px'}">
					<Content :style="{ background: '#fff'}">
						<keep-alive>
							<router-view></router-view>
						</keep-alive>
					</Content>
				</Layout>
			</Layout>
		</Layout>
		<div style="height:0;overflow:hidden">
			<!-- 解锁 -->
			<Modal v-model="clockModal" fullscreen :mask-closable='false' :closable='false' footer-hide>
				<div>
					<Input search type='password' v-model="password" @on-search='unclock' enter-button="解锁" placeholder="请输入密码解锁..." />
				</div>
			</Modal>
			<!-- 设置密码 -->
			<Modal v-model="setPawMtk" :mask-closable='false' :closable='false' title="设置锁屏密码">
				<div style='margin:20px 10px'>
					<Input prefix="md-lock" v-model="newPaw" type='password' style='margin-bottom:30px' placeholder="请输入密码···" />
					<Input prefix="md-lock" v-model="againPaw" type='password' placeholder="请确认密码..." />
				</div>
				<div slot="footer" style='text-align:center'>
					<Button type="default" @click="setNo">取 消</Button>
					<Button type="primary" @click="setOk">确 认</Button>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import md5 from 'md5'
	import {
		menuTree,
		functions
	} from '../../api/index'
	document.onclick = function () {
		var closeTab = document.getElementById('closeTab')
		if (closeTab !== null) closeTab.style.display = 'none'
	}

	export default {
		name: 'Index', // 组件名称
		beforeCreate() {
			let flagTime = window.localStorage.getItem('startDate')
			var date = new Date().getTime()
			if (flagTime < date) {
				this.$Message.warning('登陆已过期，请重新登陆！')
				localStorage.clear()
				sessionStorage.clear()
				this.$router.push({
					path: '/login',
					query: {
						redirect: this.$route.path
					}
				})
			}
		},
		created() {
			if (window.localStorage.inf == null) {
				this.$router.push({
					path: '/login',
					query: {
						redirect: this.$route.path
					}
				})
			}
			/**
			 * 头部menu路由状态读取session缓存
			 */
			if (window.sessionStorage.menuTopList != null) {
				if (window.sessionStorage.menuTopList) {
					this.menuTopList = JSON.parse(window.sessionStorage.menuTopList)
				}
				if (window.sessionStorage.selectedMenu) {
					this.selectedMenu = parseInt(window.sessionStorage.selectedMenu)
				}
			}
			if (window.sessionStorage.setPawNum == 1) {
				this.clockModal = true
			}
		},
		data() {
			return {
				tagBodyLeft: 0,
				newPaw: '',
				againPaw: '',
				password: '',
				setPawMtk: false,
				clockModal: false,
				allTrue: false,
				closeTab: {
					'display': 'none'
				},
				/***********************************************************
				 * 头部menu路由必须状态
				 */
				menuTopList: [{
					path: '/',
					name: '业务工作台',
					query: '',
					show: true
				}],
				selectedMenu: 0,
				/*********************************************************/
				theme2: 'light',
				theme1: 'dark',
				personInfo: {
					companyName: '',
					departmentName: '',
					username: ''
				},
				roleList: {},
				Menus: [], // 菜单权限
				aid: '',
				cityInf: {},
				packageIdSup: ''
			}
		},
		watch: {
			/*******************************************************************
			 * 头部menu路由缓存
			 */
			menuTopList(list) {
				window.sessionStorage.menuTopList = JSON.stringify(list)
				// setTimeout(() => {
				// 	this.initMenuTop();
				// }, 50)
			},
			selectedMenu(index) {
				window.sessionStorage.selectedMenu = index
			}
		},
		mounted() {
			if (window.localStorage.inf != null) {
				const self = this
				this.getInf()
				this.aid = JSON.parse(window.localStorage.inf).id
				// 获取菜单权限
				this.getMenus()
				this.getRouterId()
			};
		},
		methods: {
			handleScroll (offset) {
				const outerWidth = this.$refs.scrollOuter.offsetWidth
      			const bodyWidth = this.$refs.scrollBody.offsetWidth
				if (offset > 0) {
					this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
				} else {
					if (outerWidth < bodyWidth) {
					if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
						this.tagBodyLeft = this.tagBodyLeft
					} else {
						this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
					}
					} else {
					this.tagBodyLeft = 0
					}
				}
			},
			// 权限配置
			getRouterId() {
				let roleIdArr = []
				let roleId = JSON.parse(window.localStorage.inf).roles
				roleId.forEach((itemId, index) => {
					roleIdArr.push(itemId.id)
				})
				let sendMsg = {
					roleIds: roleIdArr,
					menuId: 55
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
			// 一键缩屏功能
			setClock() {
				if (window.sessionStorage.setPawNum == 1) {
					this.clockModal = true
				} else {
					this.newPaw = ''
					this.againPaw = ''
					this.setPawMtk = true
				}
			},
			setNo() {
				this.newPaw = ''
				this.againPaw = ''
				this.setPawMtk = false
			},
			setOk() {
				if (!this.newPaw) {
					this.$Message.info('请输入密码！')
					return false
				}
				if (!this.againPaw) {
					this.$Message.info('请确认密码！')
					return false
				}
				if (this.newPaw !== this.againPaw) {
					this.$Message.info('两次密码不一致！')
					return false
				}
				sessionStorage.setItem('setPawNum', 1)
				sessionStorage.setItem('paw', this.newPaw)
				this.setPawMtk = false
				this.clockModal = true
			},
			// 解锁功能
			unclock() {
				if (this.password == window.sessionStorage.paw) {
					this.clockModal = false
					this.password = ''
					sessionStorage.clear()
				} else {
					this.$Message.warning('密码不正确！')
				}
			},
			// 一键全屏
			requestFullScreen() {
				this.$Message.info({
					content: '按 ESC 键 / 缩屏按钮可退出全屏',
					duration: 3,
					closable: true
				})
				this.allTrue = true
				var de = document.documentElement
				if (de.requestFullscreen) {
					de.requestFullscreen()
				} else if (de.mozRequestFullScreen) {
					de.mozRequestFullScreen()
				} else if (de.webkitRequestFullScreen) {
					de.webkitRequestFullScreen()
				}
			},
			// 一键退出全屏
			exitFullscreen() {
				this.allTrue = false
				var de = document
				if (de.exitFullscreen) {
					de.exitFullscreen()
				} else if (de.mozCancelFullScreen) {
					de.mozCancelFullScreen()
				} else if (de.webkitCancelFullScreen) {
					de.webkitCancelFullScreen()
				}
			},
			// 退出系统
			getOut() {
				this.$Message.success('退出成功！')
				localStorage.clear()
				sessionStorage.clear()
				this.$router.push({
					path: '/login'
				})
			},
			// 通过菜单urlImg字段，返回菜单的icon
			iconName(imgUrl) {
				let obj = {
					name: '',
					code: ''
				}
				switch (imgUrl) {
					case 1:
						obj.name = ''
						obj.code = ''
						break
					case 2:
						obj.name = 'md-laptop'
						obj.code = ''
						break
					case 3:
						obj.name = 'md-contact'
						obj.code = ''
						break
					case 4:
						obj.name = 'ios-people'
						obj.code = ''
						break
					case 5:
						obj.name = 'ios-clipboard'
						obj.code = ''
						break
					case 6:
						obj.name = 'md-pulse'
						obj.code = ''
						break
					case 7:
						obj.name = 'logo-usd'
						obj.code = ''
						break
					case 8:
						obj.name = 'ios-funnel'
						obj.code = ''
						break
					case 9:
						obj.name = 'md-build'
						obj.code = ''
						break
					case 10:
						obj.name = 'ios-globe'
						obj.code = ''
						break
					case 11:
						obj.name = 'logo-yen'
						obj.code = ''
						break
					case 12:
						obj.name = 'md-construct'
						obj.code = ''
						break
					case 13:
						obj.name = 'md-bookmarks'
						obj.code = ''
						break
				}
				return obj
			},
			// 通过菜单id，返回菜单的路由
			menuPath(id) {
				sessionStorage.setItem('menuRouterID', id)
				let routerStr = ''
				switch (id) {
					case 1:
						routerStr = '/'
						break
					case 2:
						routerStr = '/login'
						break
					case 3:
						break
					case 30:
						routerStr = '/businessManagement/salesLeads'
						break
					case 31:
						routerStr = '/staffManage/contractManage'
						break
					case 32:
						routerStr = '/staffManage/projectManage'
						break
					case 33:
						routerStr = '/business/businessTesting'
						break
					case 4:
						break
					case 40:
						routerStr = '/clientmanagement/unitCustomer'
						break
					case 41:
						routerStr = '/clientmanagement/personClient'
						break
					case 5:
						routerStr = ''
						break
					case 50:
						routerStr = '/socialServices/beforeFiling'
						break
					case 51:
						routerStr = '/socialServices/afterFiling'
						break
					case 52:
						routerStr = '/socialServices/sendTable'
						break
					case 53:
						routerStr = '/socialServices/beforePool'
						break
					case 54:
						routerStr = '/socialServices/afterPool'
						break
					case 55:
						routerStr = '/socialServices/areTracking'
						break
					case 7:
						routerStr = ''
						break
					case 71:
						routerStr = '/socialCancel/practiceBillManage'
						break
					case 72:
						routerStr = '/socialCancel/differentialRecord'
						break
					case 73:
						routerStr = '/socialCancel/policyAdjustment'
						break
					case 12:
						routerStr = ''
						break
					case 120:
						routerStr = '/salary/salaryDetail'
						break
					case 6:
						routerStr = ''
						break
					case 61:
						routerStr = '/adjustment/CitySurvey'
						break
					case 62:
						routerStr = '/adjustment/businessAdjustmentTables'
						break
					case 63:
						routerStr = '/adjustment/CustomerSurvey'
						break
					case 64:
						routerStr = '/adjustment/SupplierSurvey'
						break
					case 65:
						routerStr = '/adjustment/SystemAdjustment'
						break
					case 10:
						routerStr = ''
						break
					case 100:
						routerStr = '/financeBilling/systemFundpool'
						break
					case 101:
						routerStr = '/financeBilling/systemIncomeExpend'
						break
					case 102:
						routerStr = '/financeBilling/clientMonthbill'
						break
					case 103:
						routerStr = '/financeBilling/supplierMonthbill'
						break
					case 104:
						routerStr = '/financeBilling/invoiceManagement'
						break
					case 105:
						routerStr = '/financeBilling/advancefundManagement'
						break
					case 106:
						routerStr = '/financeBilling/returnMoneyManagement'
						break
					case 107:
						routerStr = '/financeBilling/clientBalance'
						break
					case 108:
						routerStr = '/financeBilling/supplierBalance'
						break
					case 13:
						routerStr = ''
						break
					case 130:
						routerStr = '/organiManage/staffManage'
						break
					case 131:
						routerStr = '/organiManage/roleAuthority'
						break
					case 14:
						routerStr = ''
						break
					case 141:
						routerStr = '/sysconfiguration/PackageService'
						break
					case 142:
						routerStr = '/sysconfiguration/IndividualServices'
						break
					case 143:
						routerStr = '/sysconfiguration/productconfiguration'
						break
					case 144:
						routerStr = '/sysconfiguration/changerecord'
						break
					case 145:
						routerStr = '/sysconfiguration/editmenu'
						break
					case 146:
						routerStr = '/system/Log'
						break
					case 11:
						routerStr = ''
						break
					case 110:
						routerStr = '/supplier/suppliermanagement'
						break
					case 15:
						routerStr = ''
						break
					case 150:
						routerStr = '/operamanage/contentCms'
						break
					case 151:
						routerStr = '/operamanage/approvalProcess'
						break
					case 152:
						routerStr = '/operamanage/superStatement'
						break
					case 153:
						routerStr = '/financeBilling/clientBalance'
						break
					case 154:
						routerStr = '/financeBilling/supplierBalance'
						break
					case 155:
						routerStr = '/financeBilling/qualityControl'
						break
					case 156:
						routerStr = '/operamanage/bordereauxTab'
						break
					case 157:
						routerStr = '/operamanage/financialTab'
						break
					case 158:
						routerStr = '/setting/feedback'
						break
					case 159:
						routerStr = '/financeBilling/overduePage'
						break
				}
				return routerStr
			},
			// 左边菜单点击的时候，跳转路由
			menuRouter(path, obj) {
				var closeTab = document.getElementById('closeTab')
				closeTab.style.display = 'none'
				if (path) {
					this.addTab({
						path: path,
						name: obj.name,
						selected: true
					})
				}
			},
			// 根据当前账户角色id来查询其拥有的所有菜单
			getMenus() {
				let roleIdArr = []
				let roleId = JSON.parse(window.localStorage.inf).roles
				roleId.forEach((itemId, index) => {
					roleIdArr.push(itemId.id)
				})
				let sendMsg = {
					'ids': roleIdArr
				}
				menuTree(sendMsg).then(res => {
					let {
						code,
						message,
						result
					} = res
					if (code == 0) {
						this.Menus = result
					}
				}).catch(res => {
					this.$Message.error(res.message)
				})
			},

			deleteTab(index) {
				if (index === this.selectedMenu) {
					this.menuTopList.splice(index, 1)
					const pageObj = this.menuTopList[index - 1]
					this.$router.push({
						path: pageObj.path,
						query: pageObj.query
					})
					setTimeout(() => {
						this.selectedMenu = index - 1
					}, 10)
				} else {
					this.menuTopList.splice(index, 1)
					setTimeout(() => {
						if (index < this.selectedMenu) {
							let hasHide = this.menuTopList.some((item) => {
								return !item.show
							})
							this.selectedMenu = index
						}
					}, 10)
				}
			},
			/*
			 * 头部menu路由必须方法
			 */
			addTab(obj) {
				this.$router.push({
					path: obj.path,
					query: obj.query
				})
				let index = 0
				const isNewRouter = this.menuTopList.some((item, item_i) => {
					index = item_i
					return item.path === obj.path
				})
				if (!isNewRouter) {
					index = this.menuTopList.length == undefined ? 0 : this.menuTopList.length
					obj.show = true
					this.menuTopList.push(obj)
				}
				setTimeout(() => {
					this.selectedMenu = index
				}, 10)
			},
			closeSelect(type) {
				let pageObj
				switch (type) {
					case 1:
						this.menuTopList.splice(1, this.menuTopList.length)
						pageObj = this.menuTopList[0]
						this.$router.push({
							path: pageObj.path,
							query: pageObj.query
						})
						setTimeout(() => {
							this.selectedMenu = 0
						}, 10)
						break
					case 2:
						pageObj = this.menuTopList.filter((item, index) => index == this.showTabIndex)
						this.menuTopList.splice(1, this.showTabIndex - 1)
						this.$router.push({
							path: pageObj[0].path,
							query: pageObj[0].query
						})
						setTimeout(() => {
							this.selectedMenu = 1
						}, 10)
						break
					case 3:
						pageObj = this.menuTopList.filter((item, index) => index == this.showTabIndex)
						this.menuTopList.splice(this.showTabIndex + 1, this.menuTopList.length - this.showTabIndex - 1)
						this.$router.push({
							path: pageObj[0].path,
							query: pageObj[0].query
						})
						setTimeout(() => {
							this.selectedMenu = this.showTabIndex
						}, 10)
						break
				}
			},
			closeAll(index, $event) {
				$event.preventDefault()
				if (index !== 0) {
					this.showTabIndex = index

					var closeTab = document.getElementById('closeTab')
					closeTab.style.display = 'block'

					this.closeTab = {
						left: $event.clientX + 'px',
						top: $event.clientY + 'px'
					}
				}
			},
			gotoPage(obj, index) {
				var closeTab = document.getElementById('closeTab')
				closeTab.style.display = 'none'
				this.selectedMenu = index
				this.$router.push({
					path: obj.path,
					query: obj.query,
					params: obj.params
				})
			},
			getInf: function () {
				const self = this
				var userInf = JSON.parse(localStorage.getItem('inf'))
				if (userInf !== null) {
					self.personInfo = userInf
				}
			}
		}
	}
</script>
<style>
	html,
	body,
	body>div#app,
	.ivu-layout {
		width: 100%;
		height: 100%;
	}
</style>

<style scoped>
	.layout {
		border: 1px solid #d7dde4;
		background: #f5f7f9;
		/* position: relative; */
		border-radius: 4px;
		/* overflow: hidden; */
	}

	.layout-logo {
		width: 100px;
		height: 30px;
		background: #5b6270;
		border-radius: 3px;
		float: left;
		position: relative;
		top: 15px;
		left: 20px;
	}

	.layout-nav {
		width: 420px;
		margin: 0 auto;
		margin-right: 20px;
	}

	.ivu-layout-sider {
		padding: 0
	}

	.ivu-layout-header {
		padding: 0;
		height: 45px;
		background: #515a6e;
		border-bottom: 1px solid darkred
	}

	.ivu-tag-default {
		margin-top: -19px;
	}

	.ivu-menu-vertical {
		width: 200px !important;
		height: 100%;
	}

	.f_box {
		display: flex;
		width: 100%;
		height: 45px;
		background:#515a6e;
		overflow: hidden;
	}

	.f_box_l,
	.f_box_r {
		position: relative;
		z-index:999;
		width: 200px;
		line-height: 45px;
		background:#515a6e;
	}

	.f_box_l_t {
		color: #fff;
		text-align: center;
		font-size: 18px;
	}

	.f_box_c {
		flex: 1;
	}

	.sliderNav {
		height: ~"calc(100% - 1px)";
		display: inline-block;
		padding: 1px 4px 0;
		position: absolute;
		z-index:1;
		overflow: visible;
		white-space: nowrap;
		transition: left .3s ease
	}

	.ivu-tag-dot-inner {
		transition: background .2s ease;
	}
</style>
<style lang="less">
	#index {
		width: 100%;
		height: 100%;
	}

	#index .closeTab {
		position: fixed;
		z-index: 999;
		border: 1px solid #00b0b0;

		ul {
			li {
				display: block;
				width: 90px;
				height: 30px;
				line-height: 20px;
				background: #fff;
				padding: 5px 10px;
				color: #000;
				cursor: pointer;
			}

			li:hover {
				background: #00b0b0;
				color: #fff;
			}
		}
	}
</style>