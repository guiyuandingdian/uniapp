<template>
	<view class="b-sort pointer">
		<view @tap="change()" :style="myStyle">
			<view class="b-up" :style="upStyle"></view>
			<view class="b-down" :style="downStyle"></view>
		</view>
	</view>
</template>

<script>
	import baseMedia from "../../js_sdk/mixins/base-media-mixins.js" ;
	
	export default {
		name:"b-sort", 
		mixins:[baseMedia],
		
		props:{
			type : [String,Array],
			value : {
				type : String,
				default : "none"
			},
			scale : {
				type : [String , Number] ,
				default : 1
			},
			activeColor : {
				type : String ,
				default : "#333"
			},
			color : {
				type : String ,
				default : "#999"
			},
			plr:{
				type : [String,Number,Array],
				default(){
					return 15 ;
				}
			}
		},
		data() {
			return {
				valueSync:""
			}
		},
		computed:{
			
			_scale(){
				return Number(this.scale) ;
			},
			
			bdWidth(){
				return Math.round(this._scale * 4) ;
			},
			
			colorWidth(){
				return Math.round(this._scale * 5) ;
			},
			
			mt(){
				return Math.round(this._scale * 2) ;
			},
			
			_type(){
				if (uni.$b.isNull(this.type)) {
					return ["none","asc","desc"] ;
				}
				if (uni.$b.isArray(this.type)) {
					return this.type ;
				}
				return this.type.split(",") ;
			},
			
			curIndex(){
				return this._type.indexOf(this.valueSync) ;
			},
			
			isUp(){
				return this.valueSync == "asc" ;
			},
			
			isDown(){
				return this.valueSync == "desc" ;
			},
			
			_plr(){
				return this.uv(this.plr) ;
			},
			
			upStyle(){
				return uni.$b.getStyle({
					"border-width" : `${this.bdWidth}px`,
					"border-bottom-color" : this.isUp ? this.activeColor : this.color ,
					"border-bottom-width" : `${this.colorWidth}px`
				});
			},
			
			downStyle(){
				return uni.$b.getStyle({
					"border-width" : `${this.bdWidth}px`,
					"border-top-color" :  this.isDown ? this.activeColor :  this.color ,
					"border-top-width" : `${this.colorWidth}px`,
					"margin-top" : `${this.mt}px`
				});
			},
			
			myStyle(){
				return uni.$b.getStyle({
					"padding-left" : `${this._plr}`,
					"padding-right" : `${this._plr}`
				});
			}
		},
		
		watch:{
			value:{
				handler(){
					this.valueSync = this.value ;
				},
				immediate : true 
			}
		},
		
		methods: {
			change(value){
				let index = this.curIndex  + 1 ;
				if (uni.$b.notNull(value) ) {
					index = this._type.indexOf(value) ;
				}
				if (index > this._type.length - 1 ) {
					index = 0 ;
				}
				if (index < 0) {
					index = this._type.length - 1 ;
				}
				value = this._type[index] ;
				this.valueSync = value ;
				this.$emit("input" , value);
				this.$emit("change" , {detail : {value , index }});
			}
		}
	}
</script>

<style>
.b-up {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 15px solid red;
}
.b-down {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 15px solid red;
}
</style>
