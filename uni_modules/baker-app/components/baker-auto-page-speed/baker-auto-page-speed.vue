<template>
	<view>
		<b-number :value="valueSync" @change="onChange" boxClass="" :step="1" :min="10" :max="99">
			<view class="rds20 ptb4 plr30 fz14" hover-class="op8" :hover-start-time="30" style="background-color: #424242;" slot="subtract">减速 - </view>
			<view class="rds20 ptb4 plr30 fz14" hover-class="op8" :hover-start-time="30" style="background-color: #424242;" slot="add">加速 + </view>
		</b-number>
	</view>
</template>

<script>
	import themeMixins from "../baker-font-size/baker-theme-mixins.js" ;
	export default {
		name:"baker-auto-page-speed",
		mixins:[themeMixins],
		data() {
			return {
				defaultValue : 80
			};
		}
	}
</script>
