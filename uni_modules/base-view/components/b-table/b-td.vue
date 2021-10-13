<template>
	<view>
		
		<!-- 复制 -->
		<block v-if="head.component.name == 'b-copy'">
			<b-copy :text="value" :showIcon="head.component.showIcon" :showText="head.component.showText" :class="head.component.class"></b-copy>
		</block>
		
		
		
		<!-- 更多 -->
		<block v-else-if="head.component.name == 'b-more'">
			
			<b-more
				:class="head.component.class"
				:value="head.component.value" 
				:text="value" 
				:min-width="head.component.minWidth" 
				:lines="head.component.lines"
				:toggle-me="head.component.toggleMe"></b-more>
			
		</block>
		
		
		<!-- 时间 -->
		<block v-else-if="head.component.name == 'b-time'">
			
			<b-time 
				:class="head.component.class"
				:date="value" 
				:format="head.component.format" 
				:defaultStr="head.component.defaultStr" 
				:differ="head.component.differ"
				:show-time="head.component.showTime"></b-time>
			
		</block>
		
		
		<!-- 金额 -->
		<block v-else-if="head.component.name == 'b-price'">
			
			<b-price 
				:price="value"
				:class="head.component.class"
				:fixed="head.component.fixed"
				:relativeScale="head.component.relativeScale"
				:thousandth="head.component.thousandth"
				:suffix="head.component.suffix"
				:prefix="head.component.prefix"
				:type="head.component.type"
				:fontClass="head.component.fontClass"
				:unit="head.component.unit"></b-price>
			
		</block>
		
		
		<!-- 图片 -->
		<block v-else-if="head.component.name == 'b-images'">
			
			<b-images
				:class="head.component.class"
				:src="value"
				:width="head.component.width" 
				:height="head.component.height"></b-images>
			
		</block>
		
		
		
		
		<!-- 其他 -->
		<block v-else>
			{{prefix}}{{ value }}{{suffix}}
		</block>
		
		
	</view>
</template>

<script>
	export default {
		props:{
			head : Object ,
			item : Object ,
			headIndex : Number ,
			index : Number
		},
		computed:{
			value(){
				let value = this.head.isIndex ? this.item.index : (uni.$b.getDeepVal(this.item.data , this.head.key ) ) ;
				return uni.$b.isNull(value) ? '' : value ;
			},
			prefix(){
				return this.head.prefix || "" ;
			},
			suffix(){
				return this.head.suffix || "" ;
			},
		}
	}
</script>
