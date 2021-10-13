<template>
	<view>
		
		<!-- #ifndef MP-ALIPAY -->
		<view v-if="!isIos" class="flex  plr bb bt" @tap="change('wxpay')" hover-class="op8">
			<view class="flex lt ptb10 cover">
				<view class="green bIcon-wxpay fz25"></view>
				<view class="ml10 fz16">微信支付</view>
			</view>
			<view v-if="value == 'wxpay'" class="bIcon-correct fz25 "></view>
		</view>
		<!-- #endif -->
		
		<!-- #ifndef MP-WEIXIN -->
		<view v-if="!isIos" class="flex plr bb" @tap="change('alipay')" hover-class="op8">
			<view  class="flex lt ptb10  cover">
				<view class="blue bIcon-alipay fz25"></view>
				<view class="ml10 fz16">支付宝</view>
			</view>
			<view v-if="value == 'alipay'"  class="bIcon-correct fz25 "></view>
		</view>
		<!-- #endif -->
		
		<view v-if="applePayUsable" class="flex plr bb" @tap="change('appleiap')" hover-class="op8">
			<view  class="flex lt ptb10  cover">
				<view class="black bk-pingguo1 fz25"></view>
				<view class="ml10 fz16">Apple支付</view>
			</view>
			<view v-if="value == 'appleiap'"  class="bIcon-correct fz25 "></view>
		</view>
		
		<view v-if="balancePayUsable" class="flex plr bb" :class="{disabled : balancePayDisabled}" @tap="change('balancePay')" :hover-class="balancePayDisabled?'a':'op8'">
			<view  class="flex lt ptb10  cover">
				<view class="yellow bk-jinbi fz25"></view>
				<view class="ml10 fz16 flex lt">
					金币支付
					<view v-if="balancePayDisabled" class="ml7 red fz12">余额不足，剩余{{coin}}金币</view>
					<view v-else class="ml7 gray fz12">
						<b-price :price="coin" :thousandth="true" prefix="余额: " suffix="金币" :relative-scale="1"></b-price>
					</view>
				</view>
			</view>
			<view v-if="value == 'balancePay'"  class="bIcon-correct fz25 "></view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"baker-paytype",
		props:{
			value : {
				type :String ,
				default : "wxpay"
			},
			coin : Number ,
			isIos : Boolean,
			applePayReady : Boolean ,
			vipData : {
				type : Object,
				default(){
					return {} ;
				}
			}
		},
		computed:{
			balancePayUsable(){
				return uni.$b.notNull(this.vipData.coinPrice) && this.vipData.coinPrice > 0 ; 
			},
			balancePayDisabled(){
				return this.vipData.coinPrice > this.coin ;
			},
			applePayUsable(){
				return uni.$b.notNull(this.vipData.productId) && this.applePayReady ;
			}
		},
		watch: {
			applePayReady:{
				handler(){
					this.changePayType();
				},
				immediate : true 
			}
		},
		created() {
			// #ifdef MP-ALIPAY
			this.change("alipay");
			// #endif
		},
		mounted() {
			this.changePayType();
		},
		methods: {
			change(payType){
				if (this.balancePayDisabled && payType == "balancePay") {
					return ;
				}
				this.$emit("input" , payType);
			},
			changePayType(){
				if (this.isIos) {
					let payType = !this.applePayUsable && this.balancePayUsable ? "balancePay" : "appleiap" ;
					this.$emit("input" , payType);
				}
			}
		}
	}
</script>
