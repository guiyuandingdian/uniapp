export default {
	data(){
		return {
			watchTimer : null
		}
	},
	computed:{
		marginTop(){
			return 0 ;
		},
		marginRight(){
			return 0 ;
		},
		marginBottom(){
			return 0 ;
		},
		marginLeft(){
			return 0 ;
		}
	},
	
	mounted() {
		this.$nextTick(()=>{
			this._beforeCreate();
			//APP端偶发会建立失败，重新建立一次
			this.watchTimer = setTimeout( this._beforeCreate , 200);
		})
	},
	
	beforeDestroy() {
		this._disconnect();
	},
	
	methods:{
		
		//子组件覆盖使用
		_beforeCreate(){
			this._createObserver();
		},
		
		_$watch(rect , rate){} ,
		
		/**
		 * @description 创建区域监听对象
		 * @param {String} 监听的区域ID
		 * 注意： 应使用selector选取元素成功后调用
		 */
		_createObserver(selector = "#observer"){
			this._disconnect();
			this.$nextTick(()=>{
				if (null != this.observer) {
					return ;
				}
				let observer = uni.createIntersectionObserver( this, {
					thresholds :  Array.from({length: 11}, (_, i) => i/10 ) ,
					initialRatio : -1
				});
				
				observer.relativeToViewport({
					top : this.marginTop  ,
					right : this.marginRight ,
					bottom :  this.marginBottom ,
					left : this.marginLeft
				}).observe(selector, ({boundingClientRect , intersectionRatio}) => {
					clearTimeout(this.watchTimer);
					this._$watch(boundingClientRect , intersectionRatio);
				});
				this.observer = observer ;
			});
		},
		
		_disconnect(){
			try{
				this.observer.disconnect()
			}catch(e){}
		}
	}
	
}