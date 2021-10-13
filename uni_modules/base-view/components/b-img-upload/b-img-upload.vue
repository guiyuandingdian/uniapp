<template>
	<view class="b-img-uplaod form-item">
		
		<b-label
			:title="title" 
			:title-width="titleWidth" 
			:position="position" 
			:align="align" 
			:requiredMark="_requiredMark" 
			:required="_required"
			:errorContent="errorTip">
			
			<b-images
				:removable="editable"
				:movable="editable && _movable"
				:src="listData"
				:src-key="urlKey"
				:pressSave="false"
				:width="width"
				:height="height"
				:showAppend="editable && count > 0"
				@change="_onSorted"
				@remove="_onRemove">
				
				
				<!-- 上传按钮 -->
				<template slot="append">
					
					<view @tap="chooseImg">
						
						<view class="_uploader square" :style="uploaderStyle">
							
							<slot v-if="defaultSlot"></slot>
							
							<view v-else class="grayBg rds4 flex ct fz20 grey hover9 bd" style="border-color: #f1f1f1;">
								<view class="text-center">
									<view :class="uploadIcon"></view>
									<view class="fz12 op7" v-if="sizeText">{{sizeText}}</view>
								</view>
							</view>
							
						</view>
						
					</view>
					
				</template>
				
				
			</b-images>
			
		</b-label>
		
		
		<!-- 上传进度 -->
		<view class="fixed z20 wp1" v-if="_showProgress"></view>
		<view class="fixed z20 center" v-if="_showProgress" style="margin-top: -100rpx;">
			
			<b-animate :destory-on-hide="true" v-model="showProgressSync" in-class="fadeInDownSm" out-class="fadeOutUpSm">
				<view class="rds7 wp7 pd10">
					
					<view class="w100 white father">
						
						<b-progress mode="circle"
							:percent="progressData.progress" 
							:type="progressType"
							:duration="10"
							:size="4"
							:active-color="activeColor"
							:gradual-color="gradualColor"
							:background-color="backgroundColor"
							@complete="_complete">
							
							<template v-slot:default="{percent}">
								<view>
									<view class="fz18 bold">{{percent}}%</view>
								</view>
							</template>
							
						</b-progress>
						
						<view v-if="_cancel" @tap="abort()" class="abs right top hover7">
							<view class="bIcon-multiply fz12 "></view>
						</view>
						
					</view>
					
					
				</view>
			</b-animate>
			
		</view>
		
	</view>
</template>

<script>
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	import formMixins from "../../js_sdk/mixins/base-form-mixins.js" ;
	export default {
		name : 'b-img-upload' ,
		mixins:[ formMixins , mediaMixins ],
		props: {
			showProgress:{
				type:Boolean,
				default : true
			},
			width:{
				type : [String , Number , Array],
				default(){
					return "25%,20%,16.666%,80"
				}
			},
			height : {
				type : [String , Number, Array] ,
				default(){
					return "100%" ;
				}
			},
			checkAuth: {
				type: [Boolean, String],
				default () {
					return uni.$b.getValue("checkAuth", false)
				}
			},
			authUrl: [String, Array],
			apiType: {
				type : String ,
				default () {
					return uni.$b.getValue("request.apiType", "uniCloud")
				}
			},
			url: String,
			uploadName : {
				type : String,
				default : "upfile"
			} ,
			deleteUrl : String ,
			deleteName : {
				type : String,
				default : "url"
			},
			deleteMethod:{
				type : String,
				default : "get"
			},
			deleteHeader:{
				type : Object,
				default(){
					return {} 
				}
			},
			header:{
				type : Object,
				default(){
					return {} 
				}
			},
			params:{
				type : Object ,
				default(){
					return {} ;
				}
			},
			min : {
				type : [String , Number],
				default : 1
			},
			max : {
				type : [String , Number],
				default : -1
			},
			withData:[String,Boolean],
			movable:[String,Boolean],
			autoUpload:[String,Boolean],
			sizeLimit:[String,Boolean],
			uploadIcon:{
				type : String ,
				default : "bIcon-photoFill"
			},
			urlKey:{
				type : String ,
				default : "url"
			},
			sourceType : [String , Array] ,
			sizeType : [String , Array] ,
			extension : [String,Array] ,
			progressType:{
				type : String ,
				default : "color"
			},
			backgroundColor:{
				type : String ,
				default : "rgba(0,0,0,0.2)"
			},
			activeColor:{
				type : String ,
				default : "#fff"
			},
			gradualColor:String,
			srcKey:{
				type : String ,
				default : 'url'
			},
			spliter:{
				type : String ,
				default : ','
			},
			cancel:{
				type : [String,Boolean] ,
				default : true
			}
		},
		data() {
			return {
				valueSync : [] ,
				tasks : null ,
				progressData : {},
				showProgressSync: false ,
				rect : {}
			}
		},
		computed:{
			
			_showProgress(){
				return this.showProgress && this.showProgressSync ;
			},
			
			hasUploadAuth(){
				let {isNull , isFalse , hasAuth } = uni.$b ;
				return (isNull(this.url) && isNull(this.authUrl)) || isFalse(this.checkAuth) || hasAuth( this.authUrl || this.url ) ;
			},
			
			hasDeleteAuth(){
				let {isNull , isFalse , hasAuth } = uni.$b ;
				return ( isNull(this.deleteUrl) && isNull(this.authUrl) ) || isFalse(this.checkAuth) || hasAuth( this.authUrl || this.deleteUrl ) ;
			},
			
			editable(){
				return !this._disabled && this.hasUploadAuth ;
			},
			
			defaultSlot(){
				return uni.$b.hasSlots.call(this) ;
			},
			
			_cancel(){
				return this.apiType != "uniCloud" && uni.$b.isTrue(this.cancel);
			},
			
			_sizeLimit(){
				return uni.$b.isTrue(this.sizeLimit);
			},
			
			_movable(){
				return uni.$b.isTrue(this.movable);
			},
			
			sizeText(){
				return this._sizeLimit && this.rect.width ? 
					`${uni.$b.localeB("imgUpload.width")}${this.rect.width}:${uni.$b.localeB("imgUpload.height")}${this.rect.height}` : '' ;
			},
			
			_sourceType(){
				let type = uni.$b.parseArray(this.sourceType) ;
				return type.length == 0 ? ["album","camera"] : type ;
			},
			
			_sizeType(){
				let type = uni.$b.parseArray(this.sizeType) ;
				return type.length == 0 ? ["original","compressed"] : type ;
			},
			
			_autoUpload(){
				return uni.$b.isTrue(this.autoUpload) ;
			},
			
			_extension(){
				return uni.$b.parseArray(this.extension) ;
			},
			
			uploaderStyle(){
				return uni.$b.getStyle({
					"padding-top" : this.uv(this.height)
				})
			},
			
			_max(){
				return Number(this.max) ;
			},
			
			_minlength(){
				return Number(this.min) ;
			},
			
			_errorMsg(){
				let msg = {
					minLength : uni.$b.localeB("validate.minUpload", {title : this.title , minlength : this._minlength }) 
				};
				if (uni.$b.isNull(this.errorMsg)) {
					return msg ;
				}
				if (uni.$b.isObject(this.errorMsg)) {
					return Object.assign(msg , this.errorMsg) ;
				}
				return this.errorMsg ;
			},
			
			_emptyPrefix(){
				return this.emptyPrefix || uni.$b.localeB("validate.uploadPrefix") ;
			},
			
			chooseMenu(){
				return [
					uni.$b.localeB("imgUpload.album") ,
					uni.$b.localeB("imgUpload.camera") 
				] ;
			},
			
			//剩余可选择的图片的数量
			count(){
				return this._max > 0 ? this._max - this.valueSync.length : 99999 ;
			},
			
			$finalValue(){
				let list = uni.$b.clone(this.valueSync)  ;
				if (!uni.$b.isTrue(this.withData)) {
					return list.map(c=>c[this.urlKey]) ;
				}
				return list ;
			},
			
			listData(){
				return this.valueSync.map( (cur) => uni.$b.isObject(cur) ? {
					...cur
				} : {
					[this.urlKey] : cur
				});
			}
			
		},
		
		created() {
			this.makerParent = this.getParent("b-maker") ;
		},
		
		mounted() {
			uni.$b.select("._uploader",this).then(rect=>{
				this.rect = rect ;
			})
		},
		
		methods: {
			
			_handleValueSet(value){
				return uni.$b.parseArray(value , this.spliter).map(item => {
					return uni.$b.isString(item) ? {
						isTempFile : false ,
						keepLoading : false ,
						[this.urlKey] : item 
					} : item ;
				}) ;
			},
			
			_onChange(params={} , source){
				let value = this.valueSync ;
				let detail = { value , add : [] , remove : [] , exchangeIndex : -1 , index : -1 } ;
				this.$changeValue({detail : { ...detail , ...params  } , source })
			},
			
			chooseImg(){
				if (this.count <= 0) {
					return ;
				}
				
				if (this.isPc || this._sourceType.length == 1) {
					this._chooseImg(this._sourceType);
					return ;
				}
				uni.showActionSheet({
					itemList: this.chooseMenu ,
					success: (e) => {
						this._chooseImg([ this._sourceType[e.tapIndex] ]);
					},
					fail: (e) => {
						console.log("e: ",e);
						this.$emit("cancel" , e);
					}
				})
			},
			
			_chooseImg(sourceType){
				let params = {
					count : this.count ,
					sourceType:this._sourceType ,
					sizeType:this._sizeType ,
					success: async (res) => {
						let files = await this._getFormatFiles(res.tempFiles) ;
						if (files.length < res.tempFiles.length) {
							uni.showToast({
								title: uni.$b.localeB("imgUpload.size"),
								icon : 'none'
							});
						}
						
						this.valueSync = [...this.valueSync , ...files ] ;
						this._onChange({add : files} , "add" );
						
						if (this._autoUpload || !!this.makerParent ) {
							this.upload();
						}
					},
					fail: (e) => {
						console.log("e: ",e);
						this.$emit("cancel" , e);
					}
				}
				
				// #ifdef H5
				if (this._extension.length > 0) {
					params.extension = this._extension ;
				}
				// #endif
				
				uni.chooseImage(params);
			},
			
			_getFormatFiles(files){
				return this._checkSize(files).then(resFiles=> resFiles.map(item => {
					let { path , name , size , type } = item ;
					return {
						name , 
						size , 
						type , 
						path ,
						isTempFile : true ,
						[this.urlKey] : path ,
						keepLoading : this._autoUpload 
					};
				}))
			},
			
			_checkSize(files){
				if (!this._sizeLimit) {
					return Promise.resolve(files);
				}
				let promises = files.map(file=>{
					return new Promise((resolve,reject)=>{
						uni.getImageInfo({
							src:file.path ,
							success: ({width , height}) => {
								file.width = width ;
								file.height = height || 1 ;
								resolve(file);
							},
							fail: (err) => {
								file.width = 0 ;
								file.height = 1 ;
								resolve(file);
							}
						})
					})
				})
				
				return Promise.all([ uni.$b.select('._uploader',this) , ...promises]).then(([rect])=>{
					let {width , height} = rect ;
					this.rect = rect ;
					if (height == 0) {
						return files ;
					}
					let rate = width/height ;
					return files.filter( (file) => file.width/file.height === rate ) ;
				});
			},
			
			_onSorted(e){
				let { exchangeIndex , index , value } = e.detail ;
				//交换图片数据位置
				let list = this.valueSync ;
				this.$set( list , index , list.splice(exchangeIndex , 1 , list[index])[0] ) ;
				this._onChange({exchangeIndex , index} , "sort" );
			},
			
			_onRemove({index , src}){
				if (!this.valueSync[index]) {
					this._removed({index , src});
					return ;
				}
				let isTempFile = this.valueSync[index].isTempFile ;
				if ( isTempFile || uni.$b.isNull(this.deleteUrl) || !this.hasDeleteAuth) {
					this._removed({index , src});
					return ;
				}
				
				//删除文件
				uni.$b.requestByApiType(this.apiType , {
					url : this.deleteUrl ,
					data : { [this.deleteName] : src } ,
					method : this.deleteMethod ,
					header : this.deleteHeader ,
					loading : this.loadingSync ,
					handled : this.$handled 
				}).then( res => {
					this.$emit("removed" , res ) ;
					//未删除成功
					if ( !uni.$b._isOkState(res) ) {
						return ;
					}
					this._removed({index , src});
				}).catch(err=>{
					this.$emit("error" , err);
				});
			},
			
			//删除成功
			_removed({index , src}){
				this.valueSync.splice(index,1);
				this._onChange({remove:[{index , src}]} , "remove" );
				this.$emit("remove",{index,src});
			},
			
			upload(config={}){
				let {onComplete,onUpdate} = config ;
				let tempFiles = this.valueSync.filter(c=>c.isTempFile) ;
				this.tasks = uni.$b.batchUpload( tempFiles , {
					apiType : this.apiType ,
					fileType: "image" ,
					url : this.url ,
					name : this.uploadName ,
					formData : this.params ,
					header : this.header ,
					success:(res) => {
						this.$emit("upload" , res ) ;
						let url = uni.$b.isObject(res.data) ? uni.$b.getDeepVal( res.data , this.srcKey , res.data ) : res.data ;
						let path = res.filePath ;
						//替换临时数据
						let tempData = this.valueSync.find(c=>c.path == path) ;
						if(tempData){
							tempData.keepLoading = false ;
							tempData.isTempFile = false ;
							tempData[this.urlKey] = url ;
						}
					},
					
					fail: (err) => {
						let path = err.filePath ;
						let tempData = this.valueSync.find(c=>c.path == path) ;
						if(tempData){
							tempData.keepLoading = false ;
							tempData.isAbort = err.errMsg && err.errMsg.indexOf("abort") > -1
							tempData[this.urlKey] = "upload fail" ;
						}
						this.$emit("fail" , err) ;
					},
					
					onUpdate:(res)=>{
						this.progressData = res ;
						uni.$b.isFn(onUpdate) && onUpdate(res);
					},
					
					allComplete:(e)=>{
						if (this.progressData.progress < 100) {
							this.showProgressSync = false ;
						}
						
						let remove = this.valueSync.filter(item => item.isAbort) ;
						this.valueSync = this.valueSync.filter(item => !item.isAbort ) ;
						this._onChange({remove} , "upload" );
						
						uni.$b.isFn(onComplete) && onComplete({value : this.$finalValue , allUpload : remove.length == 0 });
					}
				});
				
				this.showProgressSync = true ;
				this.progressData = { progress : 0 , totalBytes : 0 , totalBytesSent : 0 };
			},
			
			_complete(progress){
				//保证进度走完
				if (progress == 100) {
					this.showProgressSync = false ;
				}
			},
			
			abort(){
				if (!this._cancel) {
					return ;
				}
				this.tasks && this.tasks.abort() ;
				this.showProgressSync = false ;
			}
		}
	}
</script>
