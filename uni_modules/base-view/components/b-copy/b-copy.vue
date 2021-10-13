<template>
	<view class="b-copy pointer" @tap="copy()">
		
		<text v-if="_showText">
			{{text}}
		</text>
		
		<view class="inline" v-else>
			<slot></slot>
		</view>
		
		<!-- 图标 -->
		<text class="fz12 gray hoverMain ml5" v-if="icon" >
			<text :class="icon" title="点击复制"></text>
		</text>
		
		<b-message :content="tip" :showClose="showClose" v-model="showMsg"></b-message>
		
	</view>
</template>

<script>
	/**
	* @description Copy 复制文字，一键复制文字功能，并展示复制成功提示信息。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/copy
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* @slot                            default             默认插槽，当待复制到剪贴板的内容与展示的内容不一致时，可在默认插槽内自定义需展示的内容。未使用默认插槽时，是否展示text属性的内容由show-text属性定义。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* @event    {Function}             success             复制成功时触发 | 参数：( data )
	* @event    {Function}             fail                复制失败时触发 | 参数：( err )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* @method                          copy()              复制文本内容到剪贴板 ( data )
	* 
	* @property {String}               icon                文字右侧的图标类名，不传入时不显示。
	*    @value                        bIcon-copyFill      复制图标类名，也可以传入自定义图标类名
	* @property {Boolean|String}       show-close          message提示框是否显示关闭按钮，默认false，当type为message时有效。
	* @property {Boolean|String}       show-text           是否显示待复制文本内容，默认true。当使用了默认插槽时也不会显示待复制的文本内容。
	* @property {String}               text                待复制到剪贴板的文字内容
	* @property {String}               tip                 复制成功提示信息内容，默认：复制成功。
	* @property {String}               type                复制成功消息提示类型，默认message，可通过配置文件配置components.copy.type来修改默认配置。
	*    @value                        message             使用message提示
	*    @value                        toast               使用toast提示
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-copy",
		props:{
			text : [String,Number,Boolean] ,
			type : {
				type : String ,
				default : uni.$b.getValue("components.copy.type")
			},
			//复制成功提示语
			tip : {
				type : String ,
				default : "复制成功"
			},
			//bIcon-copyFill
			icon: String,
			showClose:{
				type : [Boolean,String] ,
				default : false
			},
			showText:{
				type : [Boolean,String] ,
				default : true
			}
		},
		data(){
			return {
				showMsg : false 
			}
		},
		computed:{
			_showText(){
				return uni.$b.isTrue(this.showText) && !this.$slots.default ;
			}
		},
		methods: {
			
			copy(text){
				text = text || this.text ;
				if (uni.$b.isNull(text)) {
					console.log('无可复制的数据');
					return ;
				}
				uni.setClipboardData({
					data: text + "" ,
					success : (e) =>{
						uni.hideToast();
						this.$nextTick(()=>{
							this._showTip();
						});
						this.$emit("success" , text);
					},
					fail:(err)=>{
						this.$emit("fail" , err );
					}
				})
			},
			
			_showTip(){
				if (!this.tip) {
					return ;
				}
				
				//message
				if (this.type == 'message') {
					this.showMsg = true ;
					return ;
				}
				
				//toast
				uni.showToast({
					title: this.tip ,
					icon : 'success'
				});
			}
		}
	}
</script>
