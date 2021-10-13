<template>
	<view>
		<block v-if="_scrollX || _scrollY">
			
			<scroll-view
				:scroll-y="_scrollY" 
				:scroll-x="_scrollX"
				@scroll="$emit('scroll',$event)"
				@scrolltolower="$emit('scrolltolower',$event)">
			
				<slot></slot>
			
			</scroll-view>
			
		</block>
		<block v-else>
			
			<slot></slot>
			
		</block>
	</view>
</template>

<script>
	export default {
		name:"b-scroll",
		props:{
			scrollX:[String , Boolean],
			scrollY:[String , Boolean]
		},
		computed:{
			_scrollX(){
				return uni.$b.isTrue(this.scrollX);
			},
			
			_scrollY(){
				return uni.$b.isTrue(this.scrollY);
			}
		}
	}
</script>