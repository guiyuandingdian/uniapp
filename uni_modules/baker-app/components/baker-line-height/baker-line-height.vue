<template>
	<view>
		<b-radio :value="valueSync" @change="onChange" width="33.333%" type="tag" :list="list">
			<template v-slot:option="{title,checked}">
				<view :class="{'main mainBd' : checked}" class="rds20 bd plr25 ptb4 fz16 text-center">
					<view :class="title"></view>
				</view>
			</template>
		</b-radio>
	</view>
</template>

<script>
	import themeMixins from "../baker-font-size/baker-theme-mixins.js" ;
	export default {
		name:"baker-line-height",
		mixins:[themeMixins],
		data(){
			return {
				defaultValue : 1.8 ,
				list : [
					{title : "bk-jianju1" , value : 1.3 } ,
					{title : "bk-jianju2" , value : 1.8 } ,
					{title : "bk-jianju" , value : 2.1 } ,

				]
			}
		}
	}
</script>
