<template>
	<view>
		
		<b-tab :list="allCategorys" v-model="categoryId" @change="$refs.page.search()" :index-value="false" active-color="#000" active-class="bold" bar-class="bar" bar-width="20" bar-height="3"></b-tab>
		
		
		<b-page ref="page" url="baker/api/book/page" @load="onDataLoad" :params="{categoryId , name}" :show-empty="false">
			
			<view class="pd" slot="search">
				
				<!-- 分类说明 -->
				<view v-if="!!classifyData.name" class="pd10 rds4 grayBg flex lt t mb">
					<view>{{classifyData.name}}：</view>
					<view class="op8 pl2 cover break">{{classifyData.remark}}</view>
				</view>
				
				<b-radio v-for="( item , index) in cateList" :key="index"
					:class="{mt5 : index > 0}"
					type="tag" 
					:name="item.name" 
					:list="item.list"
					:index-value="false"
					color="#FCA111"
					@change="$refs.page.search();">
					
					<template v-slot:option="{item , title , checked }">
						<view class="plr10 ptb4 rds23 transition" :class="{'bg' : checked }">
							<view class="plr2">
								{{title}}
							</view>
						</view>
					</template>
					
				</b-radio>
				
			</view>
			
			
			
			<template v-slot:default="{list}">
				
				<view class="pd5 grayBg"></view>
				
				<view class="pd">
					
					<baker-books-block width="180rpx" :data="item" v-for="( item , index) in list" :key="item._id"></baker-books-block>
					
					<baker-empty v-if="list.length == 0"></baker-empty>
					
				</view>
				
			</template>

			
		</b-page>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				name : "",
				categoryId : "",
				classifyData: {},
				categoryList : [],
				sortList:[
					 {title:"按热度",value:"clicks desc,updateTime desc"},
					 {title:"按更新",value:"lastUpdateTime desc"},
					 {title:"按评分",value:"score desc"},
					 {title:"新书",value:"createTime desc"},
				],
				wordsList:[
					 {title:"全部",value:[]},
					 {title:"50万字以下",value:[0,500000]},
					 {title:"50~300万字",value:[500000,3000000]},
					 {title:"300万字以上",value:[3000000,""]},
				],
				finishList:[
					 {title:"全部",value:""},
					 {title:"已完结",value:true},
					 {title:"连载中",value:false}
				],
			}
		},
		computed: {
			cateList() {
				return [
					{ name : "finished" , list : this.finishList } ,
					{ name : "words" , list : this.wordsList } ,
					{ name : "orderBy" , list : this.sortList }
				] ;
			},
			allCategorys(){
				return [{title:"全部",value:""} , ...this.categoryList] ;
			}
		},
		onLoad({categoryId,focus}) {
			this.categoryId = Number(categoryId) ;
		},
		onNavigationBarSearchInputChanged(e){
			this.name = e.text ;
			this.$refs.page.search();
		},
		methods: {
			onDataLoad({page,data,categoryList}) {
				if (this.categoryList.length == 0 ) {
					this.categoryList = categoryList || [];
				}
				this.classifyData = data || {} ;
				this.$nextTick(()=>{
					this.autoFocus(this._pageParams.focus);
				});
			},
			autoFocus(focus){
				if (!focus) {
					return ;
				}
				// #ifdef APP-PLUS  
				let webView = this.$mp.page.$getAppWebview();  
				webView.setTitleNViewSearchInputFocus(true)  
				// #endif
			}
		}
	}
</script>
