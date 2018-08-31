<template>
	<div class='back_body'>
		<!-- 
			color: String类型。默认'#dedede'。粒子颜色。
			particleOpacity: Number类型。默认0.7。粒子透明度。
			particlesNumber: Number类型。默认80。粒子数量。
			shapeType: String类型。默认'circle'。可用的粒子外观类型有："circle","edge","triangle", "polygon","star"。
			particleSize: Number类型。默认80。单个粒子大小。
			linesColor: String类型。默认'#dedede'。线条颜色。
			linesWidth: Number类型。默认1。线条宽度。
			lineLinked: 布尔类型。默认true。连接线是否可用。
			lineOpacity: Number类型。默认0.4。线条透明度。
			linesDistance: Number类型。默认150。线条距离。
			moveSpeed: Number类型。默认3。粒子运动速度。
			hoverEffect: 布尔类型。默认true。是否有hover特效。
			hoverMode: String类型。默认true。可用的hover模式有: "grab", "repulse", "bubble"。
			clickEffect: 布尔类型。默认true。是否有click特效。
			clickMode: String类型。默认true。可用的click模式有: "push", "remove", "repulse", "bubble"
		 -->
		<vue-particles 
			color="#fff" 
			:particleOpacity="0.8" 
			:particlesNumber="100" 
			shapeType="circle" 
			:particleSize="4" 
			linesColor="#dedede"
		    :linesWidth="1" 
			:lineLinked="true" 
			:lineOpacity="0.4" 
			:linesDistance="150" 
			:moveSpeed="3" 
			:hoverEffect="true" 
			hoverMode="grab"
		    :clickEffect="true" 
			clickMode="repulse"
		>
		</vue-particles>
		<div class='back_body_c'>
			<i-form>
				<Form ref="formValidate" :model="formValidate">
					<Form-item prop="mail">
						<Input v-model="formValidate.mail" size="large" placeholder="请输入您的邮箱">
						<Icon type="ios-mail" slot="prepend"></Icon>
						</Input>
					</Form-item>
					<Form-item prop="password">
						<Input v-model="formValidate.password" type="password" size="large" placeholder="请输入您的密码">
						<Icon type="ios-lock" slot="prepend"></Icon>
						</Input>
					</Form-item>
					<Form-item prop="verification">
						<Input v-model="formValidate.verification" @on-enter="handleSubmit" size="large" style='width:150px;float:left' placeholder="请输入验证码">
						<Icon type="md-checkbox" slot="prepend"></Icon>
						</Input>
						<div style='float:right'>
							<a href="javascript:;" @click="getValidateCode">
								<img :src="iurl" alt="验证码" />
							</a>
						</div>
					</Form-item>
					<Form-item>
						<Button @on-enter="handleSubmit" @click="handleSubmit" class="bg_color" long large>登录</Button>
					</Form-item>
				</Form>
			</i-form>
		</div>

		<div class="footer">
			Copyright © 2014-2017 北京易才博普奥管理顾问有限公司版权所有 备案号：京ICP 备11033355号-3 京公网安备：1101050202266
		</div>
	</div>
</template>

<script>
	import md5 from 'md5'
	import {
	  login
	} from '../../api/index'
	export default {
	  name: 'Login',
	  data () {
	    return {
	      formValidate: {
	        password: '',
	        mail: '',
	        verification: ''
	      },
	      timestamp: '',
	      iurl: ''
	    }
	  },
	  mounted () {
	    this.getValidateCode()
	  },
	  methods: {
	    // 获取登陆时间格式化
	    getNowFormatDate () {
	      var date = new Date()
	      var seperator1 = '-'
	      var year = date.getFullYear()
	      var month = date.getMonth() + 1
	      var strDate = date.getDate()
	      var hovers = '08:00:00'
	      let currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + hovers
	      var num = 24 * 60 * 60 * 1000
	      var oldTime = new Date(currentdate).getTime() + num // 要对比的时间
	      localStorage.setItem('startDate', oldTime)
	    },
	    getValidateCode: function () {
	      var timestamp = (new Date()).valueOf()
	      this.timestamp = timestamp
	      const self = this
	      let url = `${this.$root.baseUrl}/qlth-wf-base/api/user/validateCode/${this.timestamp}`
	      this.iurl = url
	    },
	    handleSubmit () {
	      let list = this.formValidate
	      // 登录规则验证
	      let re = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, // 邮箱
	        reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/ // 6-18字母数字
	      if (list.mail == '' || !re.test(list.mail)) {
	        this.$Message.info({
	          content: '邮箱格式错误！',
	          duration: 5,
	          closable: true
	        })
	        this.getValidateCode()
	        return false
	      }
	      if (list.password == '') {
	        this.$Message.info({
	          content: '密码不可为空！',
	          duration: 5,
	          closable: true
	        })
	        this.getValidateCode()
	        return false
	      }
	      if (list.verification == '' || list.verification.length < 4) {
	        this.$Message.info({
	          content: '验证码格式错误！',
	          duration: 5,
	          closable: true
	        })
	        this.getValidateCode()
	        return false
	      }
	      let sendMsg = {
	        email: list.mail,
	        password: md5(md5(md5(list.password))),
	        validateCode: list.verification,
	        time: this.timestamp
	      }
	      login(sendMsg).then(res => {
	        let {
	          code,
	          message,
	          result
	        } = res
	        if (code === 2026) {
	          var userInf = JSON.stringify(result)
	          localStorage.setItem('inf', userInf)
	          this.getNowFormatDate()
	          this.$Message.success(message)
	          console.log(this.$route.query.redirect)
	          if (this.$route.query.redirect) {
	            this.$router.push({
	              path: this.$route.query.redirect
	            })
	          } else {
	            this.$router.push({
	              path: '/'
	            })
	          }
	        } else {
	          this.$Message.error({
	            content: res.message,
	            duration: 5,
	            closable: true
	          })
	          this.getValidateCode()
	        }
	      }).catch(res => {
	        this.$Message.error(res.message)
	      })
	    }
	  }
	}
</script>

<style>
	.back_body {
		width: 100%;
		height: 100%;
		background:url(../../static/img/5.jpg); 
		background-repeat:no-repeat; 
		background-size:100% 100%;
		-moz-background-size:100% 100%;
	}

	.back_body .back_body_c {
		width: 300px;
		height: 300px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -150px;
		margin-top: -150px;
	}

	.footer {
		text-align: center;
		position: absolute;
		color:#fff;
		bottom: 20px;
		width: 100%;
	}
</style>