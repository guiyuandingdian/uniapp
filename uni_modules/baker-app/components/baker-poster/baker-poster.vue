<template>
	<view>
		<view class="op0 fixed top" style="top: -999px;">
			<text class="bindTips fz12 plr10">{{bindTips}}</text>
		</view>
		<block v-if="!!data._id && bindBgWidth > 0">
			<base-fission-painter ref="painter" :board="board" @done="onDone" @fail="onFail" @success="onSuccess"></base-fission-painter>
		</block>
	</view>
</template>

<script>
	export default {
		name:"baker-poster",
		props:{
			inviteCode:String,
			data : {
				type : Object,
				default(){
					return {} ;
				}
			},
			isRpx:{
				type : Boolean ,
				default : false 
			}
		},
		data(){
			return {
				bindBgWidth : 0 ,
				img : ""
			}
		},
		computed: {
			board() {
				if (!this.data) {
					return {} ;
				}
				let { width , height , background , backgroundImg , bindTips , downloadTips , panelWidth , logo } = this.data ;
				return {
					width : this.setUnit(width) ,
					height : this.setUnit(height) ,
					background ,
					views : [
						{
							type: 'image',
							src: this.getImg(backgroundImg) || "/static/shareBg.jpg" ,
							css: {
								left: "0px" ,
								top: "0px" ,
								width:  this.setUnit(width) ,
								height: this.setUnit(height)
							}
						},
						{
							type: 'view', //面板
							css: {
								left: this.setUnit((width - panelWidth)/2) ,
								top: this.setUnit(250) ,
								width : this.setUnit(panelWidth) ,
								height : this.setUnit(400),
								background : "#fff",
								radius :  this.setUnit(13)
							}
						},
						{
							type: 'view', //补圆
							css: {
								left: this.setUnit((width - panelWidth)/2 - 20),
								top: this.setUnit(380),
								width : this.setUnit(30) ,
								height : this.setUnit(30),
								background ,
								borderRadius : "50%"
							}
						},
						{
							type: 'view',//补圆
							css: {
								left: this.setUnit((width - panelWidth)/2 + panelWidth - 10),
								top: this.setUnit(380),
								width : this.setUnit(30),
								height : this.setUnit(30),
								background ,
								borderRadius : "50%"
							}
						},
						{
							type: 'text',
							text: "邀请码" ,
							css: {
								left: "0px",
								top: this.setUnit(270),
								width : this.setUnit(width),
								fontSize: this.setUnit(14),
								textAlign: 'center',
								color: "#333"
							}
						},
						{
							type: 'text',
							text: this.inviteCode , //我的邀请码
							css: {
								left: "0px",
								top: this.setUnit(300),
								width : this.setUnit(width),
								fontSize: this.setUnit(32),
								textAlign: 'center',
								color: "#FCA111"
							}
						},
						{
							type: 'view', //绑定文案灰色背景
							css: {
								left: this.setUnit( (width - this.bindBgWidth)/2 ) ,
								top: this.setUnit(350),
								width : this.setUnit(this.bindBgWidth) ,
								height : this.setUnit(24) ,
								background : "#f1f1f1",
								radius : this.setUnit(12)
							}
						},
						{
							type: 'text', //绑定好友文案
							text: bindTips ,
							css: {
								left: this.setUnit(60),
								top: this.setUnit(354),
								width : this.setUnit(width - 120) ,
								height : this.setUnit(24),
								color : "#777" ,
								textAlign: 'center',
								fontSize : this.setUnit(12)
							}
						},
						{ 
							type: 'view', //分割线
							css: {
								left: this.setUnit((width - panelWidth)/2 + 10),
								top: this.setUnit(395),
								width : this.setUnit(panelWidth - 20),
								border : "1px dashed #f1f1f1",
							}
						},
						{
							type: 'text', //引导下载文案
							text: downloadTips ,
							css: {
								left: "0px",
								top: this.setUnit(410),
								width : this.setUnit(width) ,
								fontSize : this.setUnit(16),
								color : "#000" ,
								textAlign: "center"
							}
						},
						{
							type: 'qrcode',
							text : this.data.downloadUrl || "no downloadUrl" ,
							css: {
								left: this.setUnit( (width - 190)/2 ) ,
								top: this.setUnit(440) ,
								width:  this.setUnit(190) ,
								height: this.setUnit(190)
							}
						},
						{
							type: 'image',
							src: this.getImg(logo) ,
							css: {
								left: this.setUnit( (width - 40)/2 ) ,
								top: this.setUnit(510) ,
								width:  this.setUnit(40) ,
								height: this.setUnit(40)
							}
						}
					]
				};
			},
			
			bindTips(){
				return !!this.data ? this.data.bindTips : "" ;
			}
		},
		watch: {
			bindTips(newValue, oldValue) {
				this.queryRect();
			}
		},
		mounted() {
			this.queryRect();
		},
		methods: {
			setUnit(value){
				return this.isRpx ? `${value * 2}rpx` : `${value}px` ;
			},
			getImg(value){
				if (!value) {
					return "" ;
				}
				return uni.$b.isArray(value) ? value.join("") : value;
			},
			async queryRect(){
				let {width} = await uni.$b.select(".bindTips" , this);
				this.bindBgWidth = width ;
			},
			onFail(e){
				console.log("e: ",e);
				uni.$b.showToast("获取分享图片失败");
			},
			onSuccess(e){
				this.$emit("success" , e);
			},
			onDone(){
				if (!this.data._id) {
					return ;
				}
				this.$refs.painter.renderImg();
			}
		}
	}
</script>
