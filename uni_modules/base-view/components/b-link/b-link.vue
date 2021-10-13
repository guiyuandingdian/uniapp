<template>
	<button v-if="hasAuth" 
		:class="classSync" 
		:style="styleSync" 
		class="b-link pointer" 
		@tap="onTap">
		
		<slot></slot>
		
		<view class="father underline" v-if="underlineSync != false">
			<view class="abs bottom h1 mt4" :style="{'background-color' : color || '#0081ff'}"></view>
		</view>
		
	</button>
</template>

<script>
	export default {
		name: "b-link" ,
		props: {
			color : {
				type : String ,
				default : "" 
			},
			disabled: {
				type: Boolean,
				default: false
			},
			visitedClass: String ,
			authUrl: String ,
			url: String ,
			params : Object ,
			urls: Array ,
			underline: {
				type : [String,Boolean] ,
				default : false ,
				validator(v){
					let types = ['hover' , 'auto' , false , true , 'true' , 'false'] ;
					return uni.$b.isOneOf("underline" , v , types ) ;
				}
			},
			openType: {
				type : String ,
				default : "navigate" ,
				validator(v){
					let types = ['navigate' , 'redirect' , 'switchTab' , 'reLaunch' , 'navigateBack', 'webView','_blank'] ;
					return uni.$b.isOneOf("openType" , v , types ) ;
				}
			} ,
			delta: Number ,
			// #ifdef APP-PLUS
			animationType: String ,
			animationDuration : {
				type : Number ,
				default : 300
			},
			// #endif
			// #ifdef MP
			webViewOpenType : {
				type : String ,
				default : uni.$b.getValue("components.link.webViewOpenType"),
				validator(v){
					let types = ['navigateTo' , 'redirectTo' , 'switchTab' , 'reLaunch'] ;
					return uni.$b.isOneOf("webViewOpenType" , v , types ) ;
				}
			},
			webViewPath : {
				type : String ,
				default : uni.$b.getValue("components.link.webViewPath")
			},
			webViewKey : {
				type : String ,
				default : uni.$b.getValue("components.link.webViewKey")
			}
			// #endif
		},
		
		data(){
			return {
				visited : false 
			};
		},
		
		computed:{
			
			hasAuth(){
				return uni.$b.isNull(this.authUrl) || uni.$b.hasAuth(this.authUrl) ;
			},
			
			/**
			 * @description 从链接组或默认链接中拼接带参数的url
			 */
			urlSync(){
				//链接组
				let url = this.getByUrls();
				if (!uni.$b.isNull(url)) {
					return url ;
				}
				//链接
				return uni.$b.toUrl( this.url , this.params ) ;
			},
			
			open(){
				if ( uni.$b.isArray(this.urls) && this.urls.length > 0) {
					let u = this.urls.find(item=>item.usable) ;
					if (u && u.openType) {
						return u.openType ;
					}
				}
				return this.openType || 'navigate';
			},
			
			styleSync(){
				return this.color && !this.visited ? `color:${this.color}` : '' ;
			},
			
			underlineSync(){
				if( this.underline == 'hover'){
					return 'hover' ;
				}
				if (this.underline == 'auto') {
					return uni.$b.isPc()  ? 'hover' : true ;
				}
				return uni.$b.isTrue(this.underline) ;
			},
			
			classSync(){
				if (this.visited) {
					return this.visitedClass ;
				}
				let names = [];
				if (this.disabled) {
					names.push("disabled")
				}
				if (this.underlineSync === 'hover') {
					names.push("hover-underline") ;
				}
				return names.join(" ");
			}
			
		},
		
		created() {
			this.onTap = uni.$b.once( this.onTap , 1000 , true ) ;
		},
		
		methods:{
			
			onTap(e){
				if (this.disabled) {
					return ;
				}
				if ( uni.$b.isNull(this.urlSync) || uni.$b.isNull(this.open) ) {
					console.error(`both url and openType are empty`);
					this.$emit("fail" , e ) ;
					return ;
				}
				//打开新页面
				this.openNewPage(e);
				//跳转页面
				this.go(e);
				//返回上一页
				this.back(e);
				
				if (!uni.$b.isNull(this.visitedClass)) {
					this.visited = true ;
				}
			},
			
			getByUrls(){
				if ( !uni.$b.isArray(this.urls) || this.urls.length == 0) {
					return ;
				}
				let u = this.urls.find(item=>item.usable) ;
				if (u) {
					return uni.$b.toUrl(u.url , u.params) ;
				}
			},
			
			/**
			 * @description 打开新页面
			 */
			openNewPage(e){
				if ( this.open != 'webView' && this.open != '_blank' ) {
					return ;
				}
				// #ifdef H5
				window.open( this.getLocalFullLink() , this.open === '_blank' ? '_blank' : "_self" );
				this.$emit("success" , e ) ;
				// #endif
				
				// #ifdef APP-PLUS
				plus.runtime.openURL(this.urlSync , (err)=>{
					console.error(err);
					this.$emit("fail" , err ) ;
				}) ;
				this.$emit("success" , e ) ;
				// #endif
				
				// #ifdef MP
				uni[webViewOpenType]({
					url: `${this.webViewPath}?${this.webViewKey}=${encodeURIComponent(this.urlSync)}`,
					success: () => {
						this.$emit("success" , e ) ;
					},
					fail: (err) => {
						console.error(err);
						this.$emit("fail" , err ) ;
					}
				})
				// #endif
			},
			
			
			go(e){
				let index = ['navigate' , 'redirect' , 'switchTab' , 'reLaunch'].indexOf(this.open) ;
				if ( index === -1) {
					return ;
				}
				let fnName = index < 2 ? `${this.open}To` : this.open ;
				uni[fnName]({
					url : this.urlSync ,
					// #ifdef APP-PLUS
					animationType : this.animationType ,
					animationDuration : this.animationDuration ,
					// #endif
					success:(res)=>{
						this.$emit("success" , e);
					},
					fail : (err)=>{
						console.error(err) ;
					}
				});
			},
			
			back(e){
				if ('navigateBack' !== this.open ) {
					return ;
				}
				uni.navigateBack({
					delta: this.delta ,
					// #ifdef APP-PLUS
					animationType : this.animationType ,
					animationDuration : this.animationDuration ,
					// #endif
					success:(res)=>{
						this.$emit("success" , e);
					},
					fail:(err)=>{
						console.error(err);
					}
				})
			},
			
			
			// #ifdef H5
			/**
			 * @description 打开新标签页时，获取本地页面完整链接
			 */
			getLocalFullLink(){
				//本地绝对路径
				if ( this.open == '_blank' && this.urlSync && this.urlSync.indexOf("/pages/") === 0 ) {
					let rootPath = location.href.split("#")[0] ;
					return `${rootPath}#${this.urlSync}` ;
				}
				return this.urlSync ;
			},
			// #endif
			
		}
	}
</script>
<style lang="scss">
	.hover-underline{
		.underline{
			display: none;
		}
		&:hover{
			.underline{
				display: block;
			}
		}
	}
	.b-link{
		&:hover{
			opacity: .8;
		}
		&.disabled{
			&:hover{
				opacity: .5;
			}
		}
	}
</style>