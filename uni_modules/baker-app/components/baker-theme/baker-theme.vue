<template>
	<view>
		<b-radio @change="onChange" :value="valueSync" width="20%" type="tag" :list="list">
			<template v-slot:option="{title,checked}">
				<view class="father flex rt">
					<view class="rds w30 h30 father bd2" :class="{'mainBd' : checked}" :style="{'background-color':title}">
						<view v-if="checked" class="abs bIcon-correct fz30 main" style="line-height: 52rpx;text-indent: -1px;"></view>
					</view>
				</view>
			</template>
		</b-radio>
	</view>
</template>

<script>
	import themeMixins from "../baker-font-size/baker-theme-mixins.js" ;
	export default {
		name:"baker-theme",
		mixins:[themeMixins],
		data() {
			return {
				defaultValue : "yellowTheme" ,
				list :[
					{title : "#F2E5D4" , value : "yellowTheme"} ,
					{title : "#D3E3D6" , value : "greenTheme"} ,
					{title : "#fff" , value : "whiteTheme"} ,
					{title : "#3D3131" , value : "brownTheme"} ,
					{title : "#2F3237" , value : "darkTheme"} 
				]
			};
		}
	}
</script>
