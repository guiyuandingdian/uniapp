<template>
	<view @tap="change">
		<view :class="icon"></view>
		<view class="fz12">{{text}}</view>
	</view>
</template>

<script>
	import themeMixins from "../baker-font-size/baker-theme-mixins.js" ;
	export default {
		name:"baker-night",
		mixins:[themeMixins],
		data() {
			return {
				defaultValue : false
			};
		},
		computed: {
			text() {
				return this.valueSync ? "白天" : "夜间" ; 
			},
			icon(){
				return this.valueSync ? "bk-liangdu" : "bk-yueliang" ;
			}
		},
		methods:{
			change(){
				let value = !this.valueSync ;
				this.onChange({detail:{value}});
			}
		}
	}
</script>
