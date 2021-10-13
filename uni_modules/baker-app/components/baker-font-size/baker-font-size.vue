<template>
	<view>
		<b-number :value="valueSync" @change="onChange" boxClass="" :step="2" :min="12" :max="40">
			<view class="rds20 ptb4 plr40 fz16 bold" hover-class="op8" :hover-start-time="30" style="background-color: #424242;" slot="subtract">A-</view>
			<view class="rds20 ptb4 plr40 fz16 bold" hover-class="op8" :hover-start-time="30" style="background-color: #424242;" slot="add">A+</view>
		</b-number>
	</view>
</template>

<script>
	import themeMixins from "./baker-theme-mixins.js" ;
	export default {
		name:"baker-font-size",
		mixins:[themeMixins],
		data(){
			return {
				defaultValue : 18
			}
		}
	}
</script>
