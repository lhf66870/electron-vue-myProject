import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			component: resolve => {
				require(['@/views/Index/index.vue'], resolve)
			},
			children: [{
					name: 'Home',
					path: '',
					component: resolve => {
						require(['@/views/Index/Home.vue'], resolve)
					}
				},
				{
					name: 'SalesLeads',
					path: '/businessManagement/salesLeads',
					component: resolve => {
						require(['@/views/businessManagement/salesLeads.vue'], resolve)
					}
				},
				{
					name: 'SaleManageDetails',
					path: '/businessManagement/saleManageDetails/:id',
					component: resolve => {
						require(['@/views/businessManagement/saleManageDetails.vue'], resolve)
					}
				}
			]
		},
		{
			path: '/login',
			name: 'Login',
			component: resolve => {
				require(['@/views/Login/login.vue'], resolve)
			}
		},
		{
			path: '*',
			redirect: '/'
		}
	]
})