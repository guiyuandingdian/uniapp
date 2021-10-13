export default {
	checkAuth: {
		type: [Boolean, String],
		default () {
			return uni.$b.getValue("checkAuth", false)
		}
	},
	authUrl: [String, Array],
	usable: {
		type: [Boolean, String],
		default: true
	},
	apiType: {
		default () {
			return uni.$b.getValue("apiType", "uniCloud")
		},
		validator(v) {
			return uni.$b.isOneOf("apiType", v, ['uniCloud', 'http']);
		}
	},
	url: String,
	params: {
		type: Object,
		default () {
			return {};
		}
	},
	pageParams: [Boolean, String],
	cache: {
		type: [String, Boolean],
		default: false
	},
	handled: {
		type: [Boolean, String],
		default: true
	},
	loading: {
		type: Object,
		default: function(e) {
			return {};
		}
	},
	method: {
		type: String,
		default: "get",
		validator(v) {
			return uni.$b.isOneOf('method', v, ['post', 'get']);
		}
	},
	header: {
		type: Object,
		default: function(e) {
			return {};
		}
	},
	callOnCreated: {
		type: [Boolean, String],
		default: true
	},
	hideOnLoading: {
		type: [String, Boolean],
		default: undefined
	},
	rate: {
		type: [Number, String],
		default: 300
	},
	options: { //兼容小程序
		type: [Object, Array],
		default () {
			return {}
		}
	}
}
