<template>
	<view>
		<view class="text-center" @tap="change">
			<view class="bk-zidong"></view>
			<view class="fz12">自动翻页</view>
		</view>
	</view>
</template>

<script>
	import themeMixins from "../baker-font-size/baker-theme-mixins.js" ;
	export default {
		name:"baker-auto-page",
		mixins:[themeMixins],
		data() {
			return {
				defaultValue : false
			};
		},
		methods:{
			change(){
				let value = !this.valueSync ;
				this.onChange({detail:{value}});
			}
		}
	}
</script>
