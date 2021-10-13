<template>
	<view>
		
		<b-page ref="page" url="base-fission/user/friends" :params="{level}">
			
			<template v-slot:default="{list}">
				<view class="pd flex mb10" v-for="( item , index) in list" :key="index">
					<view>{{item.mobile}}</view>
					<view>
						<b-time :date="item.time"></b-time>
					</view>
				</view>
			</template>
			
			<view slot="empty">
				<b-empty imgName="loadFail.png" tips="抱歉，暂无相关好友~" color="#7d6702" ptb="50px"></b-empty>
			</view>
			
		</b-page>
		
		
	</view>
</template>

<script>
	export default {
		name : "base-fission-team" ,
		props:{
			color : {
				type : String ,
				default(){
					return uni.$b.getValue("components.mainColor") ;
				}
			},
			type : {
				type : Number ,
				default : 1
			}
		},
		computed: {
			colorStyle() {
				return `color:${this.color}`;
			}
		},
		watch: {
			type:{
				handler(){
					this.level = this.type ;
				},
				immediate : true 
			}
		},
		data() {
			return {
				level : 1 
			}
		}
	}
</script>