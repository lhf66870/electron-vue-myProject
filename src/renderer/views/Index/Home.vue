<template>
	<div id="home">
		<div class="index-title title-fontSize clearfix">
			<div class="left index-title-text" @click="doPrint">
				<!-- 前道客服工作看板 -->
				{{typeList[type]}}
			</div>
			<div class="left" v-if='type == 1'>
				<i-Select v-model="billDate" @on-change="billMonthChange" style="width:110px">
					<i-Option v-for="(x,index) in billDateArr" :value="x" :key="index">{{x.substring(0,7)}}</i-Option>
				</i-Select>
			</div>
			<div class="right clearfix">
				<div class="left">
					<i-Select v-model="type" style="width:130px;height: 30px;" placeholder="切换看板">
						<i-Option v-show="roleList[466]" :value='1'>前道客服工作看板</i-Option>
						<i-Option v-show="roleList[467]" :value='2'>现金流看板</i-Option>
						<i-Option v-show="roleList[468]" :value='3'>业务运营工作看板</i-Option>
					</i-Select>
				</div>
				<div class="single-options-icon right" @click="refresh"></div>
			</div>
		</div>
		<div class='home-contant'>
			<div v-if='type == 1' class="home-left">
				<div class="main-panel">
					<!-- 个人选项 -->
					<div class="single-options">

						<div class="loopBox clearfix" v-if="listData.length">
							<!-- 最新政策变更： -->
							<ul class="con1">
								<div style="width:80px;float:left">政策变更提醒:</div>
								<div style="width:25px;cursor:pointer;float:right" @click="lookMore">更多</div>
								<div style="margin:0 30px 0 80px">
									<marquee loop="-1" scrollamount="5">
										<li v-for="(x,index) in listData" :key="index">
											<span>{{x.name}}:</span>
											<span v-for="(i,index) in x.value" :key="index">
												【{{i.city}}】 {{i.policyName}} — {{i.createTime}}；
											</span>
										</li>
									</marquee>
								</div>
							</ul>
						</div>
						<div class="clearfix">
							<div class="left">易才博普奥-客服部</div>
						</div>
						<div class="panel-content">
							<ul class="single-wrap clearfix">
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">单位客户</div>
								</li>
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">合同</div>
								</li>
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">项目</div>
								</li>
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">在缴人数</div>
								</li>
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">社保申报</div>
								</li>
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">公积金申报</div>
								</li>
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">月结账单</div>
								</li>
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">新增客户</div>
								</li>
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">新增合同</div>
								</li>
								<li class="single-item left">
									<div class="single-num">-</div>
									<div class="single-name">新增项目</div>
								</li>
							</ul>
						</div>
					</div>
					<!-- 常用操作 -->
					<div class="clearfix custom-options">
						<div class="left panel-title">常用操作</div>
						<div class="clearfix panel-item-box">
							<div class="left custom-options-item" v-for="(item, index) in customList" @click="handleOption({
								path: item.path, 
								name: item.label
							})" :key="index">
								{{ item.label }}
							</div>
						</div>
					</div>
					<!-- 日清提醒 -->
					<div class="clearfix handle-options">
						<div class="left panel-title">日清提醒</div>
						<div class="panel-item-box">
							<p class="panel-label" v-for="(item, index) in remind" @click="handleRemind(item)" :key="index">
								{{ item.name }}(
								<span>{{ item.coun }}</span> )
							</p>
						</div>
					</div>
					<!-- 今日新增 -->
					<div class="clearfix today-new">
						<div class="left panel-title">今日新增</div>
						<div class="panel-item-box">
							<p class="panel-label" v-for="(item,index) in todayNew" :key="index">{{ item.label }}(
								<span>{{ item.number }}</span> )</p>
						</div>
					</div>
					<!-- 即将到期 -->
					<div class="clearfix pass-date">
						<div class="left panel-title">即将到期</div>
						<div class="panel-item-box">
							<p class="panel-label" v-for="(item,index) in passDate" :key="index">{{ item.label }}(
								<span>{{ item.number }}</span> )</p>
						</div>
					</div>
					<!-- 我的业绩  -->
					<div class="mine-options">
						<div class="mine-charts clearfix">
							<div style="height:240px;">
								<!-- 客服产能排行 -->
								<div class="panel-content">
									<strong style="margin-bottom:20px; display:inline-block">客服产能排行</strong>
									<div style="height:200px;overflow-y: scroll;">
										<table class="panel-table" cellspacing="0" cellpadding="0" border="0">
											<thead>
												<tr>
													<th>排名</th>
													<th>客服部</th>
													<th>客服</th>
													<th>单位数</th>
													<th>项目数</th>
													<th>产能</th>
												</tr>
											</thead>
											<tbody>
												<tr v-if="individualCapacity.length==0">
													<td colspan="6">暂无数据</td>
												</tr>
												<tr v-for="(x,index) in individualCapacity" :key="index">
													<td>{{x.no}}</td>
													<td>{{x.deptName}}</td>
													<td>{{x.sysName}}</td>
													<td>{{x.comNum}}</td>
													<td>{{x.proNum}}</td>
													<td>{{x.userNum}}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
								<!-- 团队产能排行 -->
								<div class="panel-content" style="margin-left:4%">
									<strong style="margin-bottom:20px; display:inline-block">团队产能排行</strong>
									<div style="height:150px;max-height:200px;overflow-y: scroll;">
										<table class="panel-table" cellspacing="0" cellpadding="0" border="0">
											<thead>
												<tr>
													<th>排名</th>
													<th>客服部</th>
													<th>总产能</th>
													<th>账单客户数</th>
													<th>客服数</th>
													<th>人均产能</th>
												</tr>
											</thead>
											<tbody>
												<tr v-if="individualCapacity.length==0">
													<td colspan="6">暂无数据</td>
												</tr>
												<tr v-for="(x,index) in teamCapacity" :key="index">
													<td>{{index+1}}</td>
													<td>{{x.deptName}}</td>
													<td>{{x.userNum}}</td>
													<td>{{x.comNum}}</td>
													<td>{{x.customNum}}</td>
													<td>{{x.avgNum}}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 产品经理 -->
				<div class="producters">
					<div class="producters-wrap clearfix">
						<div class="producters-item left clearfix">
							<div class="producters-item-icon left">
								<img src="" alt="" class="">
							</div>
							<div class="producters-item-content">
								<div class="">
									产品经理
								</div>
								<div class="producters-item-call" style="line-height:24px">
									联系我
								</div>
							</div>
						</div>
						<div class="producters-item left clearfix">
							<div class="producters-item-icon left">
								<img src="" alt="" class="">
							</div>
							<div class="producters-item-content">
								<div class="">
									质控经理
								</div>
								<div class="producters-item-call" style="line-height:24px">
									联系我
								</div>
							</div>
						</div>
						<div class="producters-item left clearfix">
							<div class="producters-item-icon left">
								<img src="" alt="" class="">
							</div>
							<div class="producters-item-content">
								<div class="">
									前道客服总监
								</div>
								<div class="producters-item-call" style="line-height:24px">
									联系我
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="home-right">
				<div class="wrok-panel">
					<Card>
						<!-- 卡片标题 -->
						<div class="card-title clearfix" slot="title">
							<div class="left">最近申报截止日</div>
							<div class="right more">
								<span>更多</span>
								<Icon type="chevron-right"></Icon>
							</div>
						</div>
						<!-- 卡片内容 -->
						<div class="panel-wrap">
							<table class="panel-table" cellspacing="0" cellpadding="0" border="0">
								<thead>
									<tr>
										<th>城市</th>
										<th>险种</th>
										<th>类型</th>
										<th>截止日</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item,index) in tableListData" :key="index">
										<td>{{ item.city }}</td>
										<td>{{ item.insurance }}</td>
										<td>{{ item.type }}</td>
										<td>{{ item.date }}</td>
									</tr>
								</tbody>
							</table>

						</div>
					</Card>
					<!-- 通知 -->
					<div class="inform">
						<div class="inform-title clearfix">
							<div class="left">通知</div>
							<div class="right more">
								<span>更多</span>
								<Icon type="chevron-right"></Icon>
							</div>
						</div>
						<ul>
							<li class="clearfix">
								<div class="left">北京地区政策调整通知</div>
								<div class="right">12分钟前</div>
							</li>
							<li class="clearfix">
								<div class="left">领导力不够？做好这三</div>
								<div class="right">12分钟前</div>
							</li>
							<li class="clearfix">
								<div class="left">大数据时代：乾通易才</div>
								<div class="right">12分钟前</div>
							</li>
							<li class="clearfix">
								<div class="left">互联网+HR的理想照进</div>
								<div class="right">02-06</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {functions, getMonth, disBoad, policyChange, customService} from '../../api/index'
function formatUrl (param = {}) {
  let {
      url = '', name = ''
    } = param,
    pathList = url.split('?'),
    path = pathList[0],
    paramList = pathList[1].split('&'),
    formatSet = {},
    obj = {}

  if (paramList.length > 0) {
    paramList.forEach((item, index) => {
      let itemArr = item.split('=')
      obj[itemArr[0]] = itemArr[1]
    })
  }

  return {
    path: path,
    query: obj,
    name
  }
};
export default {
  name: 'Home', // 组件名称
  data () { // 组件数据
    return {
      roleList: {},
      typeList: ['', '前道客服工作看板', '', '业务运营工作看板'],
      type: 1,
      individualCapacity: [],
      billDateArr: [],
      billDate: '',
      teamCapacity: [],
      listData: [{
        name: '暂无数据'
      }],
      animate: false,
      timeLine: 1,
      watchPanel: 1,
      userId: null,
      // 日清提醒
      remind: [{
        label: '待审核申报',
        number: '-',
        path: '/socialServices/beforeFiling'
      },
      {
        label: '待交接申报',
        number: '-',
        path: '/socialServices/beforeFiling'
      },
      {
        label: '3日内确认账单',
        number: '-',
        path: '/financeBilling/clientMonthbill'
      },
      {
        label: '3日内待确认账单',
        number: '-',
        path: '/financeBilling/clientMonthbill'
      },
      {
        label: '已超期账单',
        number: '-',
        path: '/financeBilling/clientMonthbill'
      },
      {
        label: '审核挂起申报',
        number: '-',
        path: '/socialServices/beforeFiling'
      },
      {
        label: '核销挂起申报',
        number: '-',
        path: '/socialServices/beforeFiling'
      },
      {
        label: '垫资待回款',
        number: '-',
        path: '/financeBilling/advancefundManagement'
      }
      ],
      // 今日新增
      todayNew: [{
        label: '待审核申报',
        number: '-'
      },
      {
        label: '待审核申报',
        number: '-'
      }
      ],
      passDate: [{
        label: '待审核申报',
        number: '-'
      },
      {
        label: '待审核申报',
        number: '-'
      }
      ],
      // 申报截止日
      tableListData: [{
        city: '北京市',
        insurance: '社保',
        type: '减员',
        date: '12月15'
      }
      ],
      customList: [{
        label: '前道申报',
        path: '/socialServices/beforeFiling'
      },
      {
        label: '客户月结单',
        path: '/financeBilling/clientMonthbill'
      },
      {
        label: '回款管理',
        path: '/financeBilling/returnMoneyManagement'
      }
      ]
    }
  },
  methods: {
    // 首页刷新
    refresh () {
      this.initCustomList()
      this.getBillDate()
      this.getCityChange()
    },
    lookMore () {
      this.addTab({
        path: '/adjustment/CitySurvey',
        name: '城市政策变更记录',
        selected: true
      })
    },
    // 打印
    doPrint () {
      window.print()
    },
    goToLogin () {
      this.$router.push({
        path: 'login'
      })
    },
    initCustomList () {
      let sendMsg = {
        roleType: 2,
        userId: this.userId
      }
      disBoad(sendMsg).then(res => {
        let {code, message, result} = res
        if (code == 0) {
          this.remind = result.displayBoard
        } else {
          this.$Message.error(message)
        }
      }).catch(res => {
        this.$Message.error(res.message)
      })
    },
    handleRemind (param = {}) {
      let {
        path,
        query,
        name
      } = formatUrl(param)

      query.fromPath = 'homePlan'

      this.addTab({
        path,
        name,
        query,
        selected: true
      })
    },
    handleOption ({
      path,
      name
    }) {
      this.addTab({
        path,
        name,
        selected: true
      })
    },
    getCityChange () {
      policyChange().then(res => {
        let {code, message, result} = res
        if (code == 0) {
          if (result.length > 5) {
            this.listData = result.slice(0, 5)
          } else {
            this.listData = result
          }
        } else {
          this.$Message.error(message)
        }
      }).catch(res => {
        this.$Message.error(res.message)
      })
    },
    getCustomService () {
      let sendMsg = {
        beginBillDate: this.billDate,
        endBillDate: this.billDate
      }
      customService(sendMsg).then(res => {
        let {code, message, result} = res
        if (code == 0) {
          if (code == 0) {
            this.individualCapacity = result.cOut
            this.teamCapacity = result.cAvg
          } else {
            this.$Message.error(message)
          }
        } else {
          this.$Message.error(message)
        }
      }).catch(res => {
        this.$Message.error(res.message)
      })
    },
    getBillDate () {
      getMonth().then(res => {
        let {code, message, result} = res
        if (code == 0 && result[0]) {
          this.billDate = result[0]
          this.billDateArr = result
          this.getCustomService()
        } else {
          this.$Message.error(message)
        }
      }).catch(res => {
        this.$Message.error(res.message)
      })
    },
    billMonthChange (a) {
      this.billDate = a
      this.getCustomService()
    },
    getRouterId () {
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
        let {code, message, result} = res
        if (code == 0) {
          this.roleList = result
          if (this.roleList[466]) {
            this.type = 1
          } else if (this.roleList[467]) {
            this.type = 2
          } else if (this.roleList[468]) {
            this.type = 3
          }
        }
      }).catch(res => {
        this.$Message.error(res.message)
      })
    }
  },
  mounted () {
    if (window.localStorage.inf != null) {
      this.getRouterId()
      this.userId = JSON.parse(window.localStorage.inf).id
      this.initCustomList()
      this.addTab = this.$parent.$parent.$parent.addTab
      this.getBillDate()
      this.getCityChange()
    }
  }

}
</script>

<style lang="less">
	#home .loopBox {
		width: 100%;
		padding: 0 10px;
		height: 30px;
		line-height: 30px;
		background: #fff7ea;
		color: #ffb202;
		margin-bottom: 10px;
		overflow: hidden;
		border: 1px solid #ccc;
		transition: all 3.5s;
		.con1 {
			display: block;
			height: 30px;
			overflow: hidden
		}
		li {
			display: inline-block;
			line-height: 30px;
			padding-right: 5px;
			height: 30px;
		}
	}
	#home {
		ul{
			list-style: none
		}
		.ivu-select-selection {
			border: none;
			box-shadow: none !important;
			background: #f6f6f6;
		}
		.left .ivu-select {
			margin-left: 20px;
		}
		position: relative;
		background: #f6f6f6;
		.index-title {
			height: 40px;
			padding-right: 320px;
			&-text {
				font-size: 18px;
				font-weight: 700;
			}
		}
		.title {
			padding-bottom: 10px;
		}
		.title-fontSize {
			font-size: 16px;
		}
		.panel-title {
			height: 32px;
			line-height: 34px;
			font-size: 14px;
			padding-left: 20px;
			margin-right: 20px;
			position: relative;
		}
		.panel-title::before {
			content: '';
			display: block;
			width: 5px;
			height: 5px;
			position: absolute;
			top: 50%;
			left: 7px;
			transform: translateY(-50%);
			background-color: #00b0b0;
		}

		.panel-item-box {
			overflow: hidden;
		}

		.more {
			cursor: pointer;
		}
	}

	.home-left {
		margin-right: 320px; // 选择框覆盖
		// 主面板样式
		.main-panel {
			border-radius: 10px;
			padding: 20px;
			background-color: #fff; // 小选项卡样式
			.panel-label {
				width: 140px;
				height: 32px;
				line-height: 32px;
				border-radius: 5px;
				text-align: center;
				display: inline-block;
				background-color: #f6f6f5;
				font-size: 12px;
				margin-right: 10px;
				margin-bottom: 10px;
				cursor: pointer;
				span {
					color: #ff4200;
				}
			}
		}
		.single-options {
			width: 100%;

			.single-item {
				width: 16.666666666666668%;
				padding: 10px 0;
				text-align: center;
				cursor: pointer;
			}
			.single-num {
				padding: 10px 0;
				color: #01999a;
				font-size: 18px;
			}
			.single-name {
				font-size: 12px;
			} // &-change {
			//     margin-left: 10px;
			//     color: #01999a;
			//     cursor: pointer;
			// }
			&-icon {
				width: 30px;
				height: 30px;
				background-repeat: no-repeat;
				background-position: center center;
				cursor: pointer;
			}
			&-msg {
				height: 30px;
				line-height: 30px;
				border-radius: 15px;
				padding-left: 30px;
				padding-right: 10px;
				background-repeat: no-repeat;
				background-position: 10px center;
				background-color: #fe9e37;
				color: #fff;
			}
			.single-item:hover .single-num {
				color: #017D7D;
			}
			.single-item:hover .single-name {
				color: #666666;
			}

		} // 常用操作
		.custom-options {
			.panel-item-box {
				padding-bottom: 36px;
				.left+.left {
					margin-left: 30px;
				}
				img {
					margin-right: 10px;
				}
			}
			.icon_wrap {
				height: 34px;
				float: left;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.active_icon {
				display: none;
			}

			&-item {

				height: 36px;
				line-height: 36px;
				cursor: pointer;
			}

			&-item:hover {
				color: #00b0b0;
			}

			&-item:hover .active_icon {
				display: inline-block;
			}

			&-item:hover ._icon {
				display: none;
			}
		} // 日清， 新增， 到期样式
		.today-new,
		.pass-date,
		.handle-options {
			margin-bottom: 10px;
		}
		.mine-options {
			width: 100%;
			.mine-item {
				width: 25%;
				padding-left: 10px;
				&-num {
					padding-top: 27px;
					width: 100px;
				}

			}

			.panel-content {
				display: block;
				margin-top: 20px;
				width: 48%;
				float: left;
				strong {
					font-weight: 500;
					line-height: 20px;
					font-size: 14px;
				}
				.panel-table {
					text-align: center;
					width: 100%;
					border: 1px solid #eee;
					thead {
						tr {
							background: #eef9f9;
							th {
								height: 30px;
								line-height: 30px;
								border-right: 1px solid #eee;
								&:last-child {
									border-right: none;
								}

							}
						}
					}
					tbody {
						tr {
							height: 28px;
							line-height: 28px;
							td {
								border-right: 1px solid #eee;
								height: 28px;
								line-height: 28px;
								&:last-child {
									border-right: none;
								}

							}
							&:nth-child(even) {
								background: #f9fcfc;
							}

						}
					}
				}
			}

			.charts-water {
				padding: 15px 10px 0 10px;
			}
		}
		.producters {
			height: 140px;
			margin-top: 10px;
			position: relative;
			background-color: #fff;
			border-radius: 10px;
			&-wrap {
				width: 100%;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				height: 60px;
			}
			&-item {
				width: 25%;
				position: relative;
				font-size: 14px;
				&-call {
					width: 80px;
					height: 24px;
					line-height: 28px;
					background-repeat: no-repeat;
					background-position: 10px center;
					padding-left: 26px;
					background-color: #cccccc;
					color: #fff;
					border-radius: 5px;
				}
				&-call:hover {
					background-color: #01999a;
				}
				&-icon {
					height: 60px;
					width: 60px;
					margin: 0 20px 0 20px;
					border-radius: 50%;
					border: 1px solid #ccc;
				}
				&-content {
					position: absolute;
					left: 100px;
					top: 50%;
					transform: translateY(-50%);
					overflow: hidden;
				}
			}
		}

	}

	.home-right {
		width: 320px;
		padding-left: 10px;
		position: absolute;
		top: 10px;
		right: 0;
		.ivu-card {
			overflow: hidden;
			padding-bottom: 10px;
		}
		.ivu-card-head {
			background-color: #fff;
			box-sizing: border-box;
			.card-title {
				color: #666;
			}
		}
		.ivu-card-body {
			padding: 10px !important;
		}
		.panel-wrap {
			height: 460px;
			line-height: 22px;
			overflow-y: auto;
			.panel-table {
				border-collapse: collapse;
				width: 100%;
				thead {
					th {
						width: 60px;
						height: 33px;
						font-weight: 200;
						border: 1px solid #eee;
						background-color: #eef9f9;
					}
					th:last-of-type {
						width: 70px;
					}
				}
				td {
					height: 40px;
					text-align: center;
					border: 1px solid #eee;
				}

			} // .panel-item {
			//     font-size: 12px;
			//     &-title-l {
			//         width: 93px;
			//         padding-left: 30px;
			//         background-image: url(../static/img/index/home-time-icon.png);
			//         background-repeat: no-repeat;
			//         background-position: 12px center;
			//         border-radius: 10px;
			//         background-color: #019999;
			//         color: #fff;
			//     }
			//     .panel-item-content-wrap {
			//         margin-left: 5px;
			//         margin-top: 18px;
			//         border-left: 1px dashed  #019999;
			//     }
			//     .panel-item-content {
			//         padding: 0px 8px 0 8px;
			//         /* border-left: 1px solid #ccc; */
			//     }
			//     .panel-item-footer {
			//         padding: 0 8px 0 8px;
			//     }
			//     .panel-item-btn {
			//         color: #01999a;
			//         cursor: pointer;
			//     }
			// }
		}
		.inform {
			margin-top: 10px;
			padding: 0 10px 10px 10px;
			border-radius: 5px;
			background-color: #fff;
			&-title {
				padding: 20px 0 0px 0;
			}
			li {
				line-height: 28px;
			}
			li:before {
				content: '';
				width: 5px;
				height: 5px;
				display: block;
				float: left;
				border-radius: 50%;
				margin: 12px 5px;
				background-color: #657180;
			}
		}
	}

	/*浮动相关*/

	.clearfix:after {
		content: '';
		height: 0;
		display: block;
		visibility: hidden;
		clear: both;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}
</style>