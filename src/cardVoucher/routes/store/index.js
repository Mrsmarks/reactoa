import list from './list'
import add from './add'
import check from './check'
import edit from './edit'

export default {
	path: '/card-voucher/store/index',
	name: '门店系统',
	component: list,
	childRoutes: [{
		path: '/card-voucher/store/store-add',
		name: '新建门店',
		component: add
	},{
		path: '/card-voucher/store/store-check',
		name: '查看门店',
		component: check
	},{
		path: '/card-voucher/store/store-edit',
		name: '编辑门店',
		component: edit
	}]
}