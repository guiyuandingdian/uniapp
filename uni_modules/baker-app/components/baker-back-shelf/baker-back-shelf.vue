<template>
	<view @tap="onBack">
		<slot></slot>
	</view>
</template>

<script>
	/**
	 * 返回上一页时加入书架
	 */
	export default {
		name:"baker-back-shelf",
		props:{
			url : String,
			bookInfoUrl : String ,
			add:Boolean ,
			chapterNumber : {
				type : Number ,
				default : 1
			},
			chapterNumber : {
				type : Number,
				required: true
			},
			bookId : {
				type : Number,
				required: true
			}
		},
		methods:{
			onBack(){
				if (this.chapterNumber == 1 || this.add || !uni.$b.isLogin()) {
					this.back();
					return ;
				}
				uni.$b.showModal({
					content:"建议您添加到书架，方便下次阅读" ,
					confirmText:"添加到书架",
					cancelColor:"暂不添加",
					success:(e) =>{
						if (e.confirm) {
							this.addToShelf();
							return ;
						}
						this.back();
					}
				})
			},
			back(title){
				uni.$b.navigateBack({
					url : this.bookInfoUrl ,
					params : {_id : this.bookId},
					title 
				});
			},
			async addToShelf(){
				let {code} = await uni.$b.call( this.url , {bookId:this.bookId});
				if (code == "ok") {
					this.back("加入成功");
				}
			}
		}
	}
</script>
