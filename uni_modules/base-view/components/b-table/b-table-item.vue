<template>
	<view>
		<view class="table" v-if="listData.length > 0">
		
			<view class="tbody">
				
				<block v-if="isVertical">
					
					<!-- 表头 -->
					<view class="tr">
						
						<view class="th" 
							@tap="_onTapHead(head)" 
							:class="head.fixedClassName"
							:style="head.headStyle" 
							v-for="( head , index) in headers" :key="head._key">
							
							<block v-if="head.select">
		
								<view>
									<b-checkAll :name="head.key" :scale="head.scale" @change="_onCheck">
										{{head.title?head.title:''}}
									</b-checkAll>
								</view>
								
							</block>
							<block v-else>
								
								<view class="flex" :class="head.headClass">
									
									{{head.title?head.title:''}}
									
									<text class="pl5 hoverMain fz12" :class="head.icon" v-if="head.hasIcon"></text>
									
								</view>
								
							</block>
							
						</view>
						
					</view>
					
					
					<slot name="prepend"></slot>
					
					
					<view class="tr" v-for="( item , index) in listData" :key="item._uid">
						
						<view class="td noBreak" 
							:style="head.style" 
							v-for="( head , headIndex) in headers" :key="head._key">
							
							<block v-if="head.select">
								
								<tableCheck :head="head" :item="item"></tableCheck>
								
							</block>
							<block v-else>
								
								<view :class="head.tdClass">
									
									<!-- 自定义item -->
									<slot v-if="head.component.name == 'slot'" 
										name="td" 
										:item="item.data" 
										:row="index" 
										:totalRow="listData.length"
										:head="head" 
										:col="headIndex"></slot>
									
									<btd v-else 
										:head="head" 
										:item="item" 
										:headIndex="headIndex" 
										:index="index"></btd>
									
								</view>
								
							</block>
							
						</view>
						
					</view>
					
					<slot name="append"></slot>
					
					
				</block>
				
				<block v-else>
					
					
					<view class="tr" v-for="( head , headIndex) in headers" :key="head._key">
						
						<view class="th" @tap="_onTapHead(head,headIndex)">
							{{head.title}}
						</view>
						
						
						<view class="td" style="width: auto;" v-for="( item , index) in listData" :key="index">
							
							<!-- 自定义item -->
							<slot v-if="head.component.name == 'slot'" name="td" :item="item.data" :row="index" :head="head" :col="headIndex"></slot>
							
							<btd v-else :head="head" :item="item" :headIndex="headIndex" :index="index"></btd>
							
						</view>
						
					</view>
					
					
				</block>
				
			</view>
		</view>
	</view>
</template>

<script>
	import btd from "./b-td.vue" ;
	import tableCheck from "./b-table-check.vue" ;
	
	export default {
		name:"b-table-item",
		components:{ btd , tableCheck},
		props:{
			headerData : Array ,
			listData : Array ,
			isVertical : Boolean ,
			fixType : String 
		},
		computed:{
			headers(){
				return this.headerData.filter(item=> !this.fixType || item.fixedClassName === this.fixType );
			}
		},
		watch: {
			listData(newValue, oldValue) {
				this.getFixedWidth();
			}
		},
		mounted() {
			this.getFixedWidth();
		},
		methods: {
			
			_onCheck(e){
				this.$emit("onCheck" , e);
			},
			
			_onTapHead(head){
				this.$emit("onTapHead" , head );
			},
			
			getFixedWidth(){
				Promise.all([ 
					uni.$b.select(".table" , this) , 
					uni.$b.selectAll(".leftFixed" , this) , 
					uni.$b.selectAll(".rightFixed" , this) 
				]).then( ([rect , leftRects , rightRects]) =>{
					let tableWidth = rect.width ;
					let leftWidth = leftRects.reduce((t,c)=>t+c.width , 0) ;
					let rightWidth = rightRects.reduce((t,c)=>t+c.width , 0) ;
					this.$emit("getWidths" , {leftWidth , rightWidth , tableWidth , tableHeight : rect.height });
				});
			}
		}
	}
</script>