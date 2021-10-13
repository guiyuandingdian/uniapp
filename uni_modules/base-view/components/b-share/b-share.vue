<template>
	<view>
		
		<!-- 遮罩层 -->
		<b-animate :ref="`${refId}_mask`" v-if="mask" :value="maskInitValue">
			
			<view class="fixed wp7" 
				:style="wrapperStyle"
				@tap="_onMask" 
				@touchmove.stop.prevent="()=>{}">
				
				<slot name="content"></slot>
				
			</view>

		</b-animate>
		
		<view class="fixed bottom safeBottom z20" :style="zIndexStyle">
			
			<b-animate 
				:ref="`${refId}_body`"
				:in-class="inClass"
				:out-class="outClass"
				:value="initValue"
				:duration="duration"
				:destory-on-hide="false"
				@beforeHide="_beforeChange"
				@beforeShow="_beforeChange"
				@change="_onChange">
				
				<view class="whiteBg bt text-center" id="menuPanel">
					<view class="grid g4 gray fz12 ptb20">
						
						<view @tap="share(item)" :class="{mt10 : index > 3}" v-for="( item , index) in list" :key="index">
							<image v-if="item.name == 'timeline'" src="./static/timeline.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<image v-else-if="item.name == 'wechat'" src="./static/wechat.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<image v-else-if="item.name == 'mpweixin'" src="./static/mpweixin.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<image v-else-if="item.name == 'qqchat'" src="./static/qqchat.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<image v-else-if="item.name == 'qqtimeline'" src="./static/qqtimeline.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<image v-else-if="item.name == 'qqtimeline'" src="./static/qqtimeline.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<image v-else-if="item.name == 'weibo'" src="./static/weibo.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<image v-else-if="item.name == 'album'" src="./static/album.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<image v-else-if="item.name == 'copy'" src="./static/copy.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<image v-else-if="item.name == 'more'" src="./static/more.png" mode="widthFix" class="center-block w40 h40 mb5"></image>
							<view>{{item.title}}</view>
						</view>
						
						<slot></slot>
						
					</view>
					
					<view class="grayBg ptb5"></view>
					<view @tap="_onCancel" class="text-center ptb fz15">
						取消
					</view>
				</view>
				
			</b-animate>
			
		</view>
		
		<b-scopes :ref="`${refId}_scope`" name="saveImageToPhotosAlbum" @success="_save"></b-scopes>
		
	</view>
</template>

<script>
	export default {
		name : "b-share",
		props:{
			value : {
				type : Boolean ,
				default : false 
			},
			inClass : {
				type : String,
				default : "fadeInUpSm"
			},
			outClass: {
				type : String,
				default : "fadeOutDownSm"
			},
			duration : Number,
			mask : {
				type : Boolean ,
				default : true 
			},
			closeByMask : {
				type : Boolean ,
				default : true 
			},
			wechat : {
				type : Boolean ,
				default : true 
			},
			timeline : {
				type : Boolean ,
				default : true 
			},
			mpweixin : {
				type : Boolean ,
				default : true 
			},
			qqchat : {
				type : Boolean ,
				default : true 
			},
			qqtimeline : {
				type : Boolean ,
				default : true 
			},
			weibo : {
				type : Boolean ,
				default : true 
			},
			copy : {
				type : Boolean ,
				default : true 
			},
			more : {
				type : Boolean ,
				default : true 
			},
			album : {
				type : Boolean ,
				default : true 
			},
			zIndex : {
				type : Number ,
				default : 20
			},
			shareData:{
				type : Object ,
				default(){
					return {} ;
				}
			},
			type:{
				type: Number ,
				default : 0
			},
			title : String ,
			summary : String ,
			href : String ,
			imageUrl : String ,
			mediaUrl : String ,
			miniProgram : {
				type : Object ,
				default(){
					return {} ;
				}
			}
		},
		data() {
			return {
				rect:{
					height : 200
				},
				// #ifdef MP-TOUTIAO
				refId : uni.$b.buuid() ,
				// #endif
				// #ifndef MP-TOUTIAO
				refId : "modal" ,
				// #endif
				maskInitValue : false ,
				initValue : false ,
				isShowSync : false ,
				status : "",
				services : [] ,
				basicList : [
					{title : "微信好友" , name : "wechat" , provider : "weixin" , scene : "WXSceneSession"},
					{title : "微信朋友圈" , name : "timeline" , provider : "weixin" , scene : "WXSenceTimeline"},
					{title : "微信收藏" , name : "favorite" , provider : "weixin" , scene : "WXSceneFavorite"},
					{title : "微信小程序" , name : "mpweixin" , provider : "weixin" , scene : "WXSceneSession"},
					{title : "QQ好友" , name : "qqchat" , provider : "qq" },
					{title : "QQ空间" , name : "qqtimeline" , provider : "qq" },
					{title : "新浪微博" , name : "weibo" , provider : "sinaweibo" },
					{title : "保存到相册" , name : "album"  },
					{title : "复制" , name : "copy"  },
					{title : "更多" , name : "more" }
				]
			}
		},
		computed: {
			zIndexStyle(){
				return uni.$b.getStyle({
					'z-index' : this.zIndex 
				});
			},
			wrapperStyle(){
				return uni.$b.getStyle({
					'padding-bottom' : `${this.rect.height}px` 
				},this.zIndexStyle);
			},
			list() {
				return this.basicList.filter(item => {
					let isShow =  (!item.provider || this.services.includes(item.provider)) && this[item.name] ;
					let isMinShow = item.name != "mpweixin" || (!!this.miniProgram.id && !!this.miniProgram.path) ;
					return isShow && isMinShow ;
				});
			}
		},
		watch:{
			value(isShow , o){
				if(this.isShowSync === isShow){
					return ;
				}
				this.$nextTick(()=>{
					if (isShow) {
						this.show() ;
					}else{
						this.hide() ;
					}
				});
			},
			mask(){
				this.maskInitValue = this.isShowSync ;
			}
		},
		created() {
			let value = this.value ;
			this.initValue = value ;
			this.maskInitValue = value ;
			this.isShowSync = value ;
			
			this.getServices();
		},
		mounted() {
			this.queryRect();
		},
		methods: {
			
			queryRect(){
				this.$nextTick(async ()=>{
					this.rect = await uni.$b.select("#menuPanel",this);
				})
			},
			
			getServices(){
				// #ifdef APP-PLUS
				plus.share.getServices(services => {
					services = services.filter(item=>item.nativeClient)
					services = services.map(e => e.id);
					uni.getProvider({
						service:"share",
						success: ({provider}) => {
							this.services = services.filter(item => provider.includes(item));
						},
						fail: (err) => {
							uni.$b.showToast(JSON.stringify(err));
						}
					});
				});
				// #endif
			},
			
			share({provider , name , scene}){
				this.hide();
				let type = this._getType(name);
				if (provider) {
					uni.share({
						type ,
						provider ,
						scene,
						title : this.title ,
						imageUrl : this.imageUrl ,
						mediaUrl : this.mediaUrl ,
						summary : this.summary ,
						href : this.href,
						success: this._onSucces,
						fail: this._onFail
					})
					return ;
				}
				if (name == "copy") {
					uni.setClipboardData({
						data:this.href ,
						success: (e) => {
							this._onSuccess(e);
							this.$nextTick(()=>{
								uni.$b.showToast("复制成功");
							});
						},
						fail : this._onFail
					});
					return ;
				}
				if (name == "more") {
					plus.share.sendWithSystem({
						type: "text",
						title : this.title ,
						content : this.summary ,
						href : this.href
					}, this._onSuccess , this._onFail );
					return ;
				}
				if (name == "album") {
					this.save();
					return ;
				}
			},
			
			_getType(name){
				let type = this.type ;
				if (name == "weibo" && type == 2) {
					return 0 ;
				}
				if (name == "mpweixin") {
					return 5 ;
				}
				if (name == "qq" && type == 0) {
					return 2 ;
				}
				return type ;
			},
			
			_onSuccess(res){
				this.$emit("success" , res);
			},
			
			_onFail(res){
				console.log("share error: ",res);
				uni.$b.showToast("分享失败");
				this.$emit("fail" , res);
			},
			
			_$emit(type){
				this.$emit( type , {type} );
			},
			
			_onCancel(){
				this.hide();
				this._$emit("cancel");
			},
			
			_onMask(e){
				if(this.closeByMask){
					this.hide();
				}
			},
			
			_onChange(isShow){
				this.status = "" ;
				this.isShowSync = isShow ;
				this.$emit("change" , isShow);
				this.$emit("input" , isShow);
				if (isShow) {
					this.queryRect();
					
				}
			},
			
			_beforeChange(isShow){
				if (isShow) {
					this.status = "showing" ;
					this.$emit("beforeShow" , true );
					return ;
				}
				
				this.status = "hiding" ;
				this.$emit("beforeHide" , false );
			},
			
			toggle(callBack , data){
				if (this.status == 'showing') {
					return this.hide(callBack) ;
				}
				if (this.status == 'showing') {
					return this.show(callBack , data) ;
				}
				if (this.isShowSync) {
					this.hide();
				}else{
					this.show();
				}
			},
			
			hide( callBack ){
				let bodyRef = `${this.refId}_body` ;
				let maskRef = `${this.refId}_mask` ;
				this.$refs[bodyRef] && this.$refs[bodyRef].hide(callBack);
				this.$refs[maskRef] && this.$refs[maskRef].hide();
			},
			
			/**
			 * @description 手动调用该方法时，可以传入该参数赋值给modal
			 * @param {Object} data
			 */
			show( callBack , data ){
				//允许只传入一个参数
				if (uni.$b.isObject(data)) {
					this.scopedData = uni.$b.clone(data) ;
				}else if (uni.$b.isObject(callBack)) {
					this.scopedData = uni.$b.clone(callBack) ;
				}
				
				let bodyRef = `${this.refId}_body` ;
				let maskRef = `${this.refId}_mask` ;
				this.$refs[bodyRef] && this.$refs[bodyRef].show(callBack , data);
				this.$refs[maskRef] && this.$refs[maskRef].show();
			},
			
			save(){
				// #ifdef APP-PLUS
				this._save();
				// #endif
				
				// #ifndef APP-PLUS
				this.$refs[`${this.scopeId}_scope`].get() ;
				// #endif
			},
			
			_save(){
				var downloadTask = uni.downloadFile({
					url : this.imageUrl ,
					success : ({tempFilePath})=>{
						let data = {filePath:tempFilePath} ;
						uni.saveImageToPhotosAlbum({
							...data ,
							success: (e) => {
								uni.showToast({
									title: '已保存到相册',
									icon : 'success'
								});
								this.$emit("success" , data );
							},
							fail:(err)=>{
								// #ifndef APP-PLUS
								this._saveImageFail(err);
								// #endif
								
								// #ifdef APP-PLUS
								this.$refs[`${this.scopeId}_scope`].get() ;
								// #endif
							}
						})
					},
					fail : this._saveImageFail 
				});
				
				downloadTask.onProgressUpdate((res) => {
					uni.showLoading({
						title: `${res.progress}%`
					});
				    if (res.progress >= 100) {
				        uni.hideLoading();
				    }
				});
			},
			
			_saveImageFail(e){
				uni.$b.showModal({
					content:JSON.stringify(e),
					showCancel:false
				})
				this.$emit("fail" , e);
			},
		}
	}
</script>
