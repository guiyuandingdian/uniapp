<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		name:"baker-read-time",
		props:{
			maxMin:{
				type : Number ,
				default : 2
			},
			localKey:String
		},
		data() {
			return {
				counterTimer : null ,
				counterTimeout : null ,
				counterStop : true 
			}
		},
		created() {
			this.startCounter();
			this.countLocalTime(0);
		},
		beforeDestroy() {
			this.stopCouter();
		},
		methods: {
			startCounter(){
				this.startLisener();
				if ( !this.counterStop ) {
					return ;
				}
				
				this.counterStop = false ;
				//每隔一分钟上报一次阅读数据
				this.counterTimer = setInterval(()=>{
					//统计本地阅读时长
					this.countLocalTime(1);
					this.bakerApi.updateReadTime();
				},60000);
			},
			
			stopCouter(){
				clearInterval(this.counterTimer);
				this.counterStop = true ;
			},
			
			//每一页最多计算3分钟时长
			startLisener(){
				clearTimeout(this.counterTimeout);
				this.counterTimeout = setTimeout(()=>{
					this.stopCouter();
				}, this.maxMin * 60 * 1000);
			},
			
			countLocalTime(addTime){
				if (!this.localKey) return ;
				let baker_read_time = (uni.getStorageSync(this.localKey) || 0) + addTime ;
				uni.setStorageSync(this.localKey , baker_read_time);
				this.$emit("count" , baker_read_time);
			}
		}
	}
</script>
