<template>
	<view>
		<baker-user-data ref="userData" @change="onUserChange">
			
			<view class="pd whiteBg" :class="{op0 : !load}">
				<view class="rds8 plr ptb" style="background-color: #6C5E75;">

					<!-- 用户数据 -->
					<view class="flex">
						<b-image :src="data.avatar" default-src="/static/header.jpg" img-class="rds" width="60"
							height="100%"></b-image>
						<view class="cover ml10 white">

							<view class="fz16 bold flex lt">
								{{data.nickname}}
								<view v-if="data.baker_vip" class="bk-huiyuan bold ml6 fz20 lh1"></view>
								<baker-vip-remark>
									<text class="ml fz12">
										查看权益说明 >
									</text>
								</baker-vip-remark>
							</view>
							<view class="mt5">
								<view v-if="data.baker_vip" class="flex lt op7">
									<b-time :date="data.baker_vip_time" differ="day" format="yyyy年MM月dd日"></b-time>
									会员到期
								</view>
								<view v-else style="color: #AA9BB0;">你还不是会员，开通立享特权</view>
							</view>

						</view>
					</view>

					<!-- 用户数据 -->


					<view class="grid g3 mt30">
						<view class="text-center">
							<view class="w40 center-block">
								<view class="square">
									<view class="rds bg op1" style="color: #E7C082;"></view>
									<view class="bk-adblock  fz25 flex ct" style="color: #E7C082;"></view>
								</view>
							</view>
							<view class="mt5 white" style="color: #E7C082;">阅读无广告</view>
						</view>

						<view class="text-center">
							<view class="w40 center-block">
								<view class="square">
									<view class="rds bg op2" style="color: #E7C082;"></view>
									<view class="bk-jinbi main fz25 flex ct" style="color: #E7C082;"></view>
								</view>
							</view>
							<view class="mt5 white" style="color: #E7C082;">额外金币</view>
						</view>

						<view class="text-center">
							<view class="w40 center-block">
								<view class="square">
									<view class="rds bg op2" style="color: #E7C082;"></view>
									<view class="bk-vip-fill main fz25 flex ct" style="color: #E7C082;"></view>
								</view>
							</view>
							<view class="mt5 white" style="color: #E7C082;">尊贵标识</view>
						</view>

					</view>
				</view>

				<!-- 包月套餐列表 start -->
				<view class="mt">
					<baker-vip-radio v-model="vipData" @load="load=true;" @getProducts="onGetProducts"></baker-vip-radio>
				</view>
				<!-- 包月套餐列表 end -->

			</view>


			<!-- 支付方式 start -->
			<view class="whiteBg mtb10" title-width="0" required-mark="false" :class="{op0 : !load}">
				<baker-paytype v-model="payType" :vipData="vipData" :isIos="isIos" :applePayReady="applePayReady" :coin="data.baker_coin"></baker-paytype>
			</view>
			<!-- 支付方式 end -->

			<baker-fix-bottom>
				<view class="flex bt whiteBg" :class="{op0 : !load}">
					<view class="plr flex lt cover">
						<view class="mr5">总计</view>
						<b-price v-if="payType != 'balancePay'" :price="vipData.price" :fixed="2" class="fz20 main golden"></b-price>
						<b-price v-else :price="vipData.coinPrice" :fixed="-1" prefix="false" suffix="金币" class="fz20 main golden"></b-price>
					</view>

					<b-btn v-if="canPay" @tap="pay" radius="0" ptb="15" plr='30'>立即开通</b-btn>
					<b-btn v-else radius="0" ptb="15" plr='30' :disabled="true">暂停购买</b-btn>
				</view>
			</baker-fix-bottom>

		</baker-user-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				load: false,
				vipData: {},
				data: {},
				logined : false ,
				payType: "wxpay",
				fixed: false,
				applePayReady: false ,
			}
		},
		computed: {
			isIos() {
				// #ifndef APP-PLUS
				return false ;
				// #endif
				// #ifdef APP-PLUS
				return uni.getSystemInfoSync().platform == "ios"
				// #endif
			},
			canPay(){
				let applePayUsable = uni.$b.notNull(this.vipData.productId) && this.applePayReady ;
				let balancePayUsable = uni.$b.notNull(this.vipData.coinPrice) && this.vipData.coinPrice > 0 ;
				return !this.isIos || applePayUsable || balancePayUsable ;
			}
		},
		methods: {
			onUserChange({user,logined}){
				this.data = user ;
				this.logined = logined ;
			},
			onGetProducts(productIds) {
				if (productIds.length == 0 || !this.isIos) {
					return;
				}

				// #ifdef H5
				this.applePayReady = true;
				return;
				// #endif

				// #ifdef APP-PLUS
				this.basePay.initApplePay(productIds, () => {
					this.applePayReady = true;
				});
				// #endif
			},
			pay() {
				if (this.payType == "balancePay") {
					this.payByBalance();
					return ;
				}
				
				// #ifdef H5
				uni.$b.showToast("h5端暂不支持");
				return;
				// #endif
				
				this.basePay.pay({
					data: {
						payType: this.payType,
						type: "vipOrder",
						vipCardId: this.vipData._id
					},
					success: this.success ,
					fail: this.fail 
				})
			},
			
			async payByBalance(){
				let res = await this.bakerApi.buyVip(this.vipData._id);
				this.success(res);
			},
			
			success(res){
				this.$refs.userData.refresh();
				uni.$b.navigateBack({
					url: "/uni_modules/baker-app/pages/userCenter/userCenter",
					openType: "switchTab"
				})
			},
			
			fail(err){
				if (err.code == "invalidToken") {
					uni.$b.navigateTo({
						url: "/uni_modules/baker-app/pages/login/login"
					});
					return;
				}
				console.log("err: ", err);
				uni.$b.showToast(err.message);
			},
		}
	}
</script>
<style>
	page {
		background-color: #f1f1f1;
	}
</style>
