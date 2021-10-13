<template>
	<view>
		<view class="abs left baker-moveDown"
				:style="{'animation-duration' : speed + 's'}"
				:class="{'baker-paused' : isPaused}">
			<view class="bIcon-triangleRight fz22 lh1"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "baker-auto-timer",
		data() {
			return {
				timeout: null ,
				speed : 20 ,
				startTime : 0 ,
				usedTime : 0 ,
				isPaused : true
			};
		},
		created() {
			uni.$on("baker-auto-timer" , (isPaused) => {
				if (isPaused) {
					this.paused();
				}else {
					this.continued();
				}
			});
		},
		mounted() {
			this.$nextTick(() =>{
				setTimeout(() => {
					this.start();
				} , 10)
			})
		},
		destroyed() {
			clearTimeout(this.timeout);
		},
		methods: {
			getTotalTime(){
				let speed = uni.getStorageSync("baker-auto-page-speed") || 80 ;
				this.speed = 100 - speed ;
				return this.speed * 1000 ;
			},
			start() {
				clearTimeout(this.timeout);
				this.usedTime = 0 ;
				let time = this.getTotalTime() ;
				this.setTimeout(time);
			},
			paused(){
				this.usedTime += (Date.now() - this.startTime) ;
				clearTimeout(this.timeout) ;
				this.isPaused = true ;
			},
			continued(){
				let time = this.getTotalTime() ;
				let remainTime = time - this.usedTime ;
				this.setTimeout(remainTime);
			},
			setTimeout(time){
				this.startTime = Date.now() ;
				this.isPaused = false ;
				this.timeout = setTimeout(() => {
					this.$emit("change");
				}, time );
			}
		}
	}
</script>

<style lang="scss">
	@keyframes moveDown {
		0% {
			transform: translateY(0);
		}
		85%{
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(105%);
		}
	}

	.baker-moveDown {
		animation: moveDown 10s linear;
		text-indent: -14rpx;
		&.baker-paused{
			animation-play-state:paused;
		}
	}
</style>
