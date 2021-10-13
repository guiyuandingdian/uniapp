<template>
	<view class="b-switch form-item" @tap="_change">
		<b-label
			id="formItem"
			position="left"
			:title="title" 
			:title-width="_titleWidth" 
			:align="align" 
			:requiredMark="_requiredMark" 
			:required="_required"
			:errorContent="errorTip">
		
			<view class="father flex w100p" :style="outerStyle" :class="outerClassName">
				
				<!-- 左侧插槽 -->
				<slot name="left" :value="valueSync"></slot>
				
				
				<!-- 左侧文字 -->
				<view :class="{'mr10':hasAuth}" :style="textStyle" v-if="showLeftText">{{valueSync ? text : offText}}</view>
				
				
				<!-- 开关 -->
				<block v-if="hasAuth">
					
					<b-check-item
						v-if="type == 'checkbox'" 
						:radius="radius"
						:color="color"
						:iconColor="iconColor"
						:scale="_scale"
						:isChecked="valueSync"></b-check-item>
						
					<view v-else class="b-switchs">
						<view class="wrapper">
							<view class="input" :class="{'checked' : valueSync , disabled:_disabled}" :style="inputStyle">
								<view class="before" :style="beforeStyle"></view>
								<view class="after" :style="afterStyle"></view>
							</view>
						</view>
					</view>
				</block>
				
				
				
				<!-- 右侧文字 -->
				<view :class="{'ml10':hasAuth}" :style="textStyle" v-if="showRigthText">{{valueSync ? text : offText}}</view>
				
				
				<!-- 右侧插槽 -->
				<slot name="right" :value="valueSync"></slot>
				
				
			</view>
			
			<slot></slot>
			
		</b-label>
	</view>
</template>

<script>
	/**
	* @description Switch 开关，支持发送异步请求，并在异步请求之后设置开关状态。在权限控制方面，它允许你根据用户权限的不同展现为不同的形态。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/switch
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                                    left        开关左侧插槽
	* @slot                                    right       开关右侧插槽
	* @slot                                    default     默认插槽，位于开关下方
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Events 事件<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @event    {Function}                     change      开关切换时触发 | 参数：{ detail : { value } }
	* @event    {Function}                     loading     切换开关开始发送远程请求时触发 | 参数：--
	* @event    {Function}                     load        切换开关发送远程请求，收到响应结果时触发。 | 参数：( res )
	* @event    {Function}                     error       发送远程请求，服务端响应异常时触发。 | 参数：( err )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Methods 方法<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @method                                  loadData()  配置url属性时，用户点击切换开关时会自动发送远程请求，也可使用loadData()方法，来发送远程请求并切换开关。 ( config )
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 基础属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}               value       开关的表单值，也可使用v-model替代。
	*    @value                                true        
	*    @value                                false       
	* @property {Boolean|String}               disabled    开关禁用状态，默认false。
	*    @value                                true        禁用
	*    @value                                false       不禁用
	* @property {String}                       text        开关打开时显示在旁边的提示文字。
	* @property {Boolean|String}               v-model     双向绑定开关的表单值，提交表单的场景推荐使用form组件的setData()方法回填表单数据。
	*    @value                                true        
	*    @value                                false       
	* @property {Boolean|String}               default-value value值为空时默认值，默认true。
	*    @value                                true        
	*    @value                                false       
	* @property {String}                       off-text    开关关闭时，显示在旁边的提示文字。
	* @property {String}                       text-align  开关提示文字的位置，默认right
	*    @value                                right       开关右侧
	*    @value                                left        开关左侧
	* @property {String}                       name        表单的name
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 权限类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       auth-url    权限验证地址，auth-url如果为空，则使用url属性进行权限验证。
	* @property {Boolean|String}               check-auth  校验权限，配置url属性后，此时若开启权限校验，无权限时不显示开关按钮，仅显示开关提示文字；如果未开启权限校验或有权限，则显示开关按钮直接发送请求。默认false，可通过配置文件配置checkAuth来修改默认值。
	*    @value                                true        
	*    @value                                false       
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 远程数据属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}               handled     执行默认响应反馈，若服务端未返回ok状态时，使用toast提示错误信息，默认true。
	*    @value                                true        
	*    @value                                false       
	* @property {String}                       url         切换开关时发送远程请求接口地址
	* @property {Object}                       params      切换开关发送远程请求时携带的参数，参数也可以自行追加到url参数中。
	* @property {Boolean|String}               page-params 发送远程请求时，是否自动携带当前页面的参数，默认false。
	*    @value                                true        
	*    @value                                false       
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 样式类属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       color       开关打开时的颜色，默认为主题色，可通过配置文件配置components.mainColor修改默认值。
	*    @value                                #e1251b     红色
	*    @value                                #FFC300     黄色
	*    @value                                #FC5E9B     粉色
	*    @value                                #07c160     绿色
	*    @value                                #F74F0E     橘色
	*    @value                                #0081ff     蓝色
	*    @value                                #8B4512     棕色
	*    @value                                #6739b6     紫色
	*    @value                                #82939c     玄灰
	*    @value                                #777        灰色
	* @property {String|Number|Array}          radius      【响应式属性】 圆角大小，默认4px，type为checkbox时有效。
	* @property {String|Number}                scale       尺寸缩放比例，默认1。
	* @property {String}                       text-color  开关打开时提示文字的颜色，默认#777。
	*    @value                                #e1251b     红色
	*    @value                                #FFC300     黄色
	*    @value                                #FC5E9B     粉色
	*    @value                                #07c160     绿色
	*    @value                                #F74F0E     橘色
	*    @value                                #0081ff     蓝色
	*    @value                                #8B4512     棕色
	*    @value                                #6739b6     紫色
	*    @value                                #82939c     玄灰
	*    @value                                #777        灰色
	* @property {String|Array}                 position    【响应式属性】 开关的位置，默认["right","right","left"]。
	* @property {String}                       off-text-color 开关关闭时文字的颜色，默认#777。
	*    @value                                #e1251b     红色
	*    @value                                #FFC300     黄色
	*    @value                                #FC5E9B     粉色
	*    @value                                #07c160     绿色
	*    @value                                #F74F0E     橘色
	*    @value                                #0081ff     蓝色
	*    @value                                #8B4512     棕色
	*    @value                                #6739b6     紫色
	*    @value                                #82939c     玄灰
	*    @value                                #777        灰色
	* @property {String}                       type        样式类型，默认normal。
	*    @value                                normal      开关样式
	*    @value                                checkbox    选项框样式，通常用于勾选/取消勾选用户协议等场景。
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 标题属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       title       标题
	* @property {String|Number}                title-width 标题宽度，默认65，为0时隐藏标题。通常使用b-form组件的title-width属性来统一调控。
	* @property {String}                       align       标题对齐方式，默认left。
	*    @value                                left        左对齐
	*    @value                                center      居中对齐
	*    @value                                right       右对齐
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 其他交互属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}                       api-type    API接口类型，默认uniCloud，可在配置文件中配置request.apiType来修改默认值。
	*    @value                                uniCloud    云开发接口
	*    @value                                http        常规服务端接口，如java、php、python等语言做服务端接口
	* @property {Object}                       loading     请求接口时加载状态的配置项
	* @property {Object}                       header      设置请求的 header，api-type为http时有效，header 中不能设置 Referer。App、H5端会自动带上cookie，且H5端不可手动修改。
	* @property {String}                       method      请求方法，api-type为http时有效，默认get。
	*    @value                                post        POST请求
	*    @value                                get         GET请求
	* 
	* @property {String}                       ref          获取组件对象，通常用于调用组件内置方法。
	* @property {String}                       v-slot:default  默认插槽作用域变量
	*/
	export default {
		name:"b-switch",
		mixins:[uni.$b._mixins.form , uni.$b._mixins.request , uni.$b._mixins.media ],
		props:{
			value : {
				type : [String , Boolean ]  ,
				default : undefined 
			},
			type : {
				type : String ,
				default : "normal"
			},
			radius:{
				type : [String,Number,Array] ,
				default(){
					return "4px" ;
				}
			},
			//value值为空时默认值
			defaultValue:{
				type : [String , Boolean , Number , Object , Array] ,
				default : true 
			},
			text:String ,
			offText:String ,
			color:{
				type : String ,
				default : uni.$b.getValue("components.mainColor")
			},
			iconColor:{
				type : String ,
				default : uni.$b.getValue("components.mainInverse")
			},
			textAlign:{
				type : String ,
				default : "right"
			},
			textColor:{
				type : String ,
				default : "#777"
			},
			offTextColor:{
				type : String ,
				default : "#777"
			},
			position: {
				type : [String , Array] ,
				default(){
					return "left" ;
				}
			},
			confirm:String
		},
		computed:{
			
			_position(){
				return this.dv(this.position) ;
			},
			
			_requiredMark(){
				return uni.$b.isTrue(this.extendProp("requiredMark" , false )) ;
			},
			
			hasText(){
				return (this.valueSync && !!this.text) || (!this.valueSync && !!this.offText) ;
			},
			
			showLeftText(){
				return this.textAlign == 'left' && this.hasText ;
			},
			
			showRigthText(){
				return this.textAlign == 'right' && this.hasText ;
			},
			
			loadDataOnCreated(){
				return false ;
			},
			
			finalParams(){
				if (this.name) {
					this.paramsSync[this.name] = !this.valueSync ; //赋值为即将切换的值传给服务端
				}
				return this.paramsSync ;
			},
			
			isApiType(){
				return !!this.url ;
			},
			
			isUsable(){
				return this.isApiType && !this._disabled ;
			},
			
			outerClassName(){
				return this._position == 'left' ? 'lt' : 'rt' ;
			},
			
			inputStyle(){
				let color = this.valueSync ? this.color : '' ;
				return uni.$b.getStyle({
					"width" : `${40 * this._scale}px` ,
					"height" : `${ 22 * this._scale}px` ,
					"border-radius" : `${ 20 * this._scale}px` ,
					"background-color" : color ,
					"border-color" : color
				});
			},
			
			beforeStyle(){
				let scale = this.valueSync ? 0 : 1 ;
				return uni.$b.getStyle({
					"width" : `${38 * this._scale}px` ,
					"height" : `${ 20 * this._scale}px` ,
					"border-radius" : `${ 20 * this._scale}px` ,
					"transform" : `scale(${scale})`
				});
			},
			
			afterStyle(){
				let translate = this.valueSync ? 18 * this._scale : 0 ;
				return uni.$b.getStyle({
					"width" : `${20 * this._scale}px` ,
					"height" : `${ 20 * this._scale}px` ,
					"border-radius" : `${ 20 * this._scale}px` ,
					"transform" : `translateX(${translate}px)`
				});
			},
			
			outerStyle(){
				return  uni.$b.getStyle({
					"height" : this._titleWidth > 0 ? `${ 80 * this._scale}rpx` : ''
				});
			},
			
			textStyle(){
				return `color:${this.valueSync ? this.textColor : this.offTextColor}` ;
			}
		},
		
		watch:{
			value(v){
				this.valueSync = uni.$b.isTrue(v) ;
			}
		},
		
		created() {
			let value = uni.$b.isNull(this.value) ? this.defaultValue : this.value ;
			this.valueSync = uni.$b.isTrue(value);
		},
		
		methods: {
			
			_change(e){
				if ( this._disabled ) {
					return ;
				}
				
				//远程请求后切换
				if (this.isApiType) {
					if (this.confirm) {
						uni.$b.showModal({
							content:this.confirm,
							success:(e)=>{
								if(e.confirm){
									this.loadDataOnce();
								}
							}
						})
						return ;
					}
					this.loadDataOnce();
					return ;
				}
				
				//直接切换
				e.detail.value = !this.valueSync ;
				this.$changeValue(e) ;
			},
			
			/**
			 * @description 数据请求成功
			 * @param {Object} res
			 */
			success(res){
				//关闭默认失败提示，此时交由用户自行处理
				if ( uni.$b.isFalse(this.handled) ) {
					return ;
				}
				
				//切换开关的状态
				this.$changeValue({detail:{value : !this.valueSync}});
			}
		}
	}
</script>

<style lang="scss">
	.b-switchs {
		-webkit-tap-highlight-color: transparent;
		display: inline-block;
		cursor: pointer;
		.wrapper {
			display: inline-flex;
			align-items: center;
			vertical-align: middle;
			.input {
				appearance: none;
				position: relative;
				border: 1px solid #dfdfdf;
				outline: 0;
				box-sizing: border-box;
				background-color: #dfdfdf;
				transition: background-color .1s,border .1s;
				background-color: rgb(223, 223, 223);
				border-color: rgb(223, 223, 223);
				
				.before{
					position: absolute;
					top: 0;
					left: 0;
					transition: transform .3s;
					background-color: #fdfdfd;
				}
				
				.after {
					position: absolute;
					top: 0;
					left: 0;
					transition: transform .3s;
					background-color: #fff;
					box-shadow: 0 1px 3px rgba(0,0,0,0.4);
				}
				
				&.checked {
					border-color: $main ;
					background-color: $main ;
				}
				
			}
		}
	}
</style>