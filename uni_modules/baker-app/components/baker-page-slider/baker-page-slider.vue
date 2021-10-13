<template>
	<view>
		<b-radio @change="onChange" :value="valueSync" width="50%" type="tag" :list="list">
			<template v-slot:option="{title,checked}">
				<view :class="{'main mainBd' : checked}" class="rds20 bd plr25 ptb4 fz16 text-center">
					<view :class="title">{{title}}</view>
				</view>
			</template>
		</b-radio>
	</view>
</template>

<script>
	import themeMixins from "../baker-font-size/baker-theme-mixins.js" ;
	export default {
		name:"baker-page-slider",
		mixins:[themeMixins],
		data() {
			return {
				defaultValue : "slide" ,
				list :[
					{title : "覆盖" , value : "slide"} ,
					{title : "左右平移" , value : "overlying"}
				]
			};
		}
	}
</script>
