<template>
	<view @tap="onTap" class="b-auth" v-if="_hasAuth">
		<slot></slot>
	</view>
</template>

<script>
	/**
	* @description Auth 权限控制，用于控制有权限、无权限时是否展现当前的UI元素。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/auth
	* @version     1.0.0
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Slot 插槽<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @slot                            default             默认插槽
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {Boolean|String}       no-auth-show        是否无权限时展示，否则为有权限时展示，默认false。
	* @property {String}               url                 权限地址
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-auth",
		props:{
			url: {
				type : String ,
				required : true 
			} ,
			noAuthShow : [String , Boolean]
		},
		computed:{
			_noAuthShow(){
				return uni.$b.isTrue(this.noAuthShow) ;
			},
			_hasAuth(){
				let hasAuth = uni.$b.hasAuth( this.url ) ;
				return (this._noAuthShow && !hasAuth) || (!this._noAuthShow && hasAuth) ;
			}
		},
		methods: {
			onTap(e){
				this.$emit("click" , e) ;
			}
		}
	}
</script>