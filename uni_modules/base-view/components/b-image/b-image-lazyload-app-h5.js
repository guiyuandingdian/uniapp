// #ifdef APP-PLUS || H5
import lazyLoad from "../../js_sdk/mixins/base-lazyload-mixins.js";
// #endif
export default {
	// #ifdef APP-PLUS || H5
	mixins: [lazyLoad],
	computed: {
		marginTop() {
			return 400;
		},
		marginRight() {
			return 400;
		},
		marginBottom() {
			return 400;
		},
		marginLeft() {
			return 400;
		}
	}
	// #endif
};
