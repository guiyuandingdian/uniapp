<template>
	<view>
		
		<!-- 该插件由插件市场的 almost-lottery 插件改造而成-->
		<almost-lottery ref="lottery" v-if="prizes.length > 1"
			bgSrc="/uni_modules/baker-app/static/lucky-bg.png"
			pointer="/uni_modules/baker-app/static/lucky-arrow.png"
			:ringCount="10" 
			:duration="6"
			:canvasCached="false"
			:prizeList="prizes" 
			:prizeIndex="prizeIndex" 
			:btnSrc="btnSrc"
			@draw-start="onStart" 
			@draw-end="onEnd" 
			@finish="onFinished"/>
		
	</view>
</template>

<script>
	export default {
		name:"baker-lucky-draw",
		props:{
			prizeList:{
				type : Array,
				default(){
					return [] ;
				}
			},
			times : Number ,
			todayTimes : Number ,
			totalTimes : Number ,
			hasAdCount : {
				type : Boolean ,
				default :true 
			},
			prizeIndex:{
				type : Number ,
				default: -1
			}
		},
		data() {
			return {
				defaultStyle: {
					fontColor: '#000',
					fontSize: '13px',
					fontStyle: 'SimHei',
				},
				defaultConfig: {
					offsetDegree: 22.5
				},
				playing : false 
			}
		},
		computed: {
			btnSrc() {
				if (this.times > 0 || this.playing) {
					return "/uni_modules/baker-app/static/goBtn.png" ;
				}
				//可用抽奖次数已用尽
				if (this.todayTimes < this.totalTimes) {
					//视频已用就弄完
					if( !this.hasAdCount ) {
						return "/uni_modules/baker-app/static/goBtnDisabled.png" ;
					}
					//可以看视频抽奖
					return "/uni_modules/baker-app/static/goVideoBtn.png" ;
				}
				return "/uni_modules/baker-app/static/goBtnDisabled.png" ;
			},
			prizes(){
				return this.prizeList.map((item,index) => {
					let coin = item >= 10000 ? item/10000  + "万" : item ;
					return {
						name : `${coin}金币` ,
						prizeImage : `/uni_modules/baker-app/static/luckyDraw/${index}.png`
					}
				})
			}
		},
		methods: {
			start(){
				this.playing = true ;
				this.$refs.lottery.start();
			},
			onStart() {
				if (this.playing) {
					return ;
				}
				this.$emit("start");
			},
			onEnd(prize) {
				this.playing = false ;
				this.$emit("end" , prize );
			},
			onFinished(){
				this.$emit("finished");
			},
		}
	}
</script>