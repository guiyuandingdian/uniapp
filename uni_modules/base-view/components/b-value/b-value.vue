<template>
	<text>{{value}}</text>
</template>

<script>
	/**
	* @description Value 安全取值，用于从JSON、数组数据中安全取值，避免抛出异常，并支持为空时赋予默认值。
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/value
	* @version     1.0.0
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String}               default-value       value值为空时默认值。
	* @property {Number}               index               取值的数组下标，当obj为数组时有效。
	* @property {String}               keys                取值的键名，支持深层键名。
	* @property {Array|Object}         obj                 取值的原始数据对象
	* 
	* @property {String}               ref                  获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-value",
		props:{
			obj : {
				type : [Object , Array] ,
				required: true
			} ,
			index : Number ,
			keys : String ,
			defaultValue : {
				type : [String , Number , Array , Boolean , Object , Date ] ,
				default : ""
			}
		},
		computed:{
			value(){
				let value = this._getValue();
				let defVal = uni.$b.isNull(this.defaultValue) ? "" : this.defaultValue ;
				return uni.$b.isNull(value) ? defVal : value ;
			}
		},
		methods:{
			
			_getValue(){
				let data = this.obj ;
				let index = this.index ;
				
				if ( this._isEmpty() ) {
					return ;
				}
				
				if ( uni.$b.isObject(data) ) {
					return uni.$b.getDeepVal( data , this.keys ) ;
				}
				
				let outOfRange = index > data.length - 1 || index < 0 ;
				if (outOfRange) {
					return ;
				}
				
				if (uni.$b.isNull(this.keys)) {
					return data[index] ;
				}
				return uni.$b.getDeepVal( data[index] , this.keys ) ;
			},
			
			_isEmpty:function(res){
				let data = this.obj ;
				let {isObject , isArray , isNull } = uni.$b ;
				let isObj = isObject(data) ;
				let isArr = isArray(data) ;
				let notObj = !isObj && !isArr ; //非json或数组
				let missing = (isObj && isNull(this.keys)) || (isArr && isNull(this.index)) ; //属性缺失
				return isNull(data) || notObj || missing ;
			},
		}
	}
</script>

<style>

</style>
