<template>
	<view @tap="openChapter">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"baker-chapter",
		props:{
			href : String ,
			historyUrl : {
				type : String ,
				default: "baker/api/history/info"
			},
			bookId : {
				type : Number ,
				required: true
			},
			chapterNumber : Number ,
			pageIndex : {
				type : Number,
				default : 0
			}
		},
		computed:{
			_bookId(){
				return Number(this.bookId) ;
			}
		},
		methods:{
			async openChapter(){
				//1.未登录时，检查本地阅读记录
				if (!uni.$b.isLogin()) {
					let baker_history = uni.getStorageSync("baker_history") || [] ;
					let history = baker_history.find(item => item.bookId == this.bookId ) ;
					this.openDetail(history);
					return ;
				}
				
				//2.已登录时，查询历史记录
				let {data} = await uni.$b.call(this.historyUrl , {bookId : this._bookId}) ;
				this.openDetail(data) ;
			},
			
			openDetail(history){
				if (uni.$b.isNull(history)) history = { } ;
				let {chapterNumber = this.chapterNumber , pageIndex = this.pageIndex , fontSize , lineHeight } = history ;
				//将历史记录中的字号、行高数据存入本地，进入章节详情后使用
				if (fontSize !== undefined) uni.setStorageSync("baker-font-size" , fontSize );
				if (lineHeight !== undefined) uni.setStorageSync("baker-line-height" , lineHeight );
				uni.$b.open({
					url : this.href ,
					params : {
						chapterNumber ,
						pageIndex ,
						bookId : this._bookId
					}
				})
			}
		}
	}
</script>
