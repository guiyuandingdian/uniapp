<template>
	<view class="hidden pointer" :style="checkStyle">
		
		
		<!-- 图标内层，选中对勾 -->
		<b-animate 
			inClass="fadeIn"
			outClass="fadeOut" 
			:duration="200"
			:value="isChecked">
			
			<view class="flex ct normal" :style="innerStyle">
				<text class="bIcon-correct" :style="iconStyle"></text>
			</view>
			
			
		</b-animate>
		
	</view>
</template>

<script>
	import media from "../../js_sdk/mixins/base-media-mixins.js" ;
	export default {
		name : "b-check-item" ,
		mixins:[media],
		props:{
			isChecked : {
				type : Boolean ,
				default : false 
			} ,
			radius:{
				type : [String,Number,Array],
				default(){
					return "2px";
				}
			},
			scale : [Number,String] ,
			color : String ,
			iconColor : String
		},
		computed:{
			
			_color(){
				return uni.$b.isNull(this.color) ? uni.$b.getValue("components.mainColor") : this.color ;
			},
			
			_iconColor(){
				return uni.$b.isNull(this.iconColor) ? uni.$b.getValue("components.mainInverse") : this.iconColor ;
			},
			
			_scale(){
				return Number(this.scale) ;
			},
			
			size(){
				return Math.round(this._scale * 30) ;
			},
			
			_radius(){
				return this.uv(this.radius) ;
			},
			
			checkStyle(){
				return uni.$b.getStyle({
					'width' : `${this.size}rpx` ,
					'height' : `${this.size}rpx` ,
					'line-height' : `${this.size}rpx`,
					'border-radius' : this._radius ,
					'border' : this.isChecked ? '' : '1px solid #e0e0e0'
				})
			},
			
			innerStyle(){
				return uni.$b.getStyle({
					'width' : `${this.size}rpx` ,
					'height' : `${this.size}rpx` ,
					'border-radius' : this._radius ,
					'background-color' : this.isChecked ? this._color : '' , 
					'color' : this.isChecked ? this._iconColor : ''
				})
			},
			
			iconStyle(){
				return `font-size:${parseInt(this._scale* 24)}rpx` ;
			},
		}
	}
</script>
