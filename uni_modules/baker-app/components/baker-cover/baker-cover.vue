<template>
	<view class="father">
		<b-image src="/uni_modules/baker-app/static/bakerBook.png" :width="width" :height="height" mode="scaleToFill" :lazy-load="false"></b-image>
		<image class="abs" style="width: 96%;height: 96%;" :src="src" mode="aspectFill"></image>
		<image src="/uni_modules/baker-app/static/bookShadow.png" mode="heightFix" class="abs left top w30" style="height: 96%;"></image>
		<view class="abs top left flex lt">
			<b-tag v-if="!!tag" color="#07c160" text-color="#fff" tag-class="rdsBr7 ptb4 plr5 fz12" :show-border="false">
				{{tag}}
			</b-tag>
		</view>
	</view>
</template>

<script>
	export default {
		name:"baker-cover",
		props:{
			width : {
				type : [String,Number,Array],
				default(){
					return 110 ;
				}
			},
			height : {
				type : [String,Number,Array],
				default(){
					return "144%" ;
				}
			},
			src : String ,
			tag : String
		}
	}
</script>
<style>
	.abs{
		position: absolute!important;
	}
</style>