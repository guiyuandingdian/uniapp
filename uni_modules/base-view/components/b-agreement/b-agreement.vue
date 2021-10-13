<template>
	<view class="b-agreement">
		
		<view class="flex lt ptb5 grey">
			
			<b-checkbox 
				title-width="0" 
				scale="0.9"
				:empty-prefix="emptyPrefix"
				:required-mark="false" 
				:list="[ !ts.mustRead ? confirmText : '']"
				:index-value="true"
				:value="isRead ? [0] : ''"
				:name="name"
				:validate-title="_titleText"
				:disabled="ts.mustRead && !isRead">
			
			</b-checkbox>
			
			<view class="hover8 lh1">
				{{ ts.mustRead ? confirmText : ''}}
				<text :style="{color}">《</text>
				<block v-for="(item,index) in _title" :key="index">
					{{index > 0 ? "、" : ""}} <text @tap="show(index)" :style="{color}">{{item}}</text>
				</block>
				<text :style="{color}">》</text>
			</view>
			
		</view>
		
		
		<b-modal 
			:ref="modalRef" 
			:title="_titleText" 
			:close-by-mask="false" 
			:show-close="false"
			:body-padding="false"
			placement="center"
			top="0">
			
			<view class="text-center ptb fz16" slot="header">{{_titleText}}</view>
			
			<view class="grayBg pd">
				{{content}}
			</view>
			
			<view slot="footer" class="flex ct pd">
				
				<b-btn @tap="agree()" radius="20" plr="20" :countdown="true" :countdown-time="_countdown" :countdown-key="countdownKey">{{confirmText}}</b-btn>
				
			</view>
			
		</b-modal>
		
	</view>
</template>

<script>
	/**
	* @description Agreement 阅读协议，用于同意并阅读相关协议场景
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/agreement
	* @version     1.0.0
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}             change              阅读状态发生变化时触发 | 参数：( isRead )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               confirm-text        确认阅读协议的文字，默认：我已阅读并同意。可通过配置文件配置components.agreement.confirmText来修改默认值。
	* @property {String}               content             协议内容，必填。
	* @property {String|Number}        countdown           协议阅读计时时间，到时间后方可关闭协议弹窗，单位：秒，默认10。
	* @property {Boolean|String}       just-once           阅读一次后，下次无需再次阅读，自动勾选，默认true。
	* @property {Boolean|String}       must-read           开启强制阅读，不可直接勾选，必须打开协议阅读，默认false。
	* @property {String}               name                协议的唯一标识，必填。
	* @property {String}               title               协议标题，必填。
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name : "b-agreement" ,
		props: {
			color : {
				type : String ,
				default : "#0081ff"
			},
			title : {
				type : [String,Array] ,
				required : true 
			},
			content : String,
			contentPath:[String,Array],
			countdown : {
				type : [String , Number],
				default : 10
			},
			name : {
				type : String ,
				required : true 
			},
			justOnce:{
				type : [String , Boolean] ,
				default : true 
			},
			mustRead:[String , Boolean] ,
			confirmText:{
				type : String ,
				default(){
					return uni.$b.getValue("components.agreement.confirmText")
				}
			},
			emptyPrefix:{
				type : String ,
				default(){
					return uni.$b.getValue("components.agreement.emptyPrefix")
				}
			}
		},
		data() {
			return {
				isRead : false ,
				// #ifndef MP-TOUTIAO
				modalRef : "modal"
				// #endif
				// #ifdef MP-TOUTIAO
				modalRef : uni.$b.buuid()
				// #endif
			}
		},
		computed:{
			_title(){
				if (uni.$b.isString(this.title)) {
					return [this.title] ;
				}
				return this.title ;
			},
			_titleText(){
				return this._title.join("、");
			},
			_contentPath(){
				return uni.$b.isString(this.contentPath) ? [this.contentPath] : this.contentPath ;
			},
			_countdown(){
				return Number(this.countdown) ;
			},
			ts(){
				return uni.$b.getTrues.call(this,"mustRead","justOnce") ;
			},
			agreeKey(){
				return `agree_${this.name}` ;
			},
			countdownKey(){
				return `${this.agreeKey}_countdown` ;
			}
		},
		
		mounted() {
			if (this.ts.justOnce) {
				this.isRead = uni.getStorageSync(this.agreeKey) || false ;
			}
		},
		methods: {
			
			show(index){
				if (index > this._title.length - 1) {
					return ;
				}
				if (this._contentPath.length > 0) {
					uni.$b.navigateTo({
						url : this._contentPath[index]
					});
					return ;
				}
				if (!this.content) {
					uni.$b.log("content is null");
					return ;
				}
				uni.setStorageSync( this.countdownKey , Date.now() + this._countdown * 1000 );
				this.isRead = false ;
				this.$refs[this.modalRef].show();
				this.$emit("change" , this.isRead )
			},
			
			agree(){
				this.isRead = true ;
				if (this.ts.justOnce) {
					uni.setStorageSync( this.agreeKey , true );
				}
				this.$refs[this.modalRef].hide();
				this.$emit("change" , this.isRead )
			}
		}
	}
</script>
