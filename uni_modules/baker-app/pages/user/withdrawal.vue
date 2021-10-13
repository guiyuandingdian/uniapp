<template>
	<view>
		<b-data url="baker/user/withdraw/list" @load="dataLoad">
			
			<navigator url="/uni_modules/baker-app/pages/user/withdrawRecord" class="whiteBg pd flex">
				<view class="flex lt">
					<view>
						<text class="">金币余额：</text>
						<text class="bold">{{data.baker_coin}}</text>
					</view>
					<view class="fz12 ml5">（约{{data.amount}}元）</view>
				</view>
				<view class="flex rt">
					<view class="mr10">提现记录</view>
					<view class="bIcon-arrowRight gray"></view>
				</view>
			</navigator>
			<view class="grayBg pd5"></view>
			
			<!-- 金币提现选项列表 -->
			<b-form class="whiteBg pd pb30" @submit="submit">
				<view class="flex lt">
					<view class="mr5 fz16">金币提现</view>
					<b-tag tag-class="rds20 ptb5 plr5 fz12" text-color="#B77730" prefix-icon="bIcon-lightningFill yellow" bag-img="linear-gradient(to bottom , #FBE29F,#F4C458)">到账速度快</b-tag>
				</view>
				
				<view class=" pr10 ptb5 rds8 flex mtb20" style="background-color: #FEF6D0;">
					<view class="cover flex ct">
						<text class="main bk-liwu mr10 fz20"></text>
						<text style="color: #583F27;">福利中心还有大量金币可以领哦~</text>
					</view>
					<view class="w80 text-right">
						<b-btn href="/uni_modules/baker-app/pages/user/welfare" open-type="redirectTo" radius="20" ptb='3'>领金币</b-btn>
					</view>
				</view>
				
				<b-radio title="提现金额" name="_id" type="tag" :list="list" title-width="0" required-mark="false" width="50%" :defaultIndex="defaultIndex">
					<template v-slot:option="{checked,item}">
						
						<view class="text-center rds7 ptb7 bd" :class="{'op9' : item.disabled , 'grayBg' :!checked , 'activeBg bg' : checked}">
							<view class="pt5">提现{{item.amount}}元</view>
							<view class="fz12 pb5 normal" :class="{'gray' : !checked}">需{{item.coins}}金币</view>
						</view>
						
					</template>
				</b-radio>
				
				<view class="pt30 fz15 flex ct">
					<b-btn form-type="submit" min-width="200" ptb="10" radius="23px">立即提现</b-btn>
				</view>
				
			</b-form>
			
			
			<!-- 提示信息 -->
			<view class="grayBg pd5 bt bb"></view>
			<view class="gray pd">
				<view class="flex ct mb">
					<view class="bt w40"></view>
					<view class="plr fz16">温馨提示</view>
					<view class="bt w40"></view>
				</view>
				<view>1、提现申请将在1-3个工作日内完成审核，请耐心等待。</view>
				<view>2、金币无需转换为现金，可直接累计提现。</view>
				<view>3、可在金币提现记录中查看提现状态。</view>
				<view>4、每日阅读、签到或完成福利中心其他任务，均可获得金币，金币可累计提现。</view>
			</view>
			
		</b-data>
		
		
		<!-- 绑定支付宝 -->
		<b-modal-form action="baker/user/account/bindAlipay" @success="onBindSuccess" ref="bindAccount" title="绑定支付宝账号" 
			title-class="bold" placement="topCenter" top="160rpx" position="top" btn-type="coverBtn" out-class="fadeOutDownSm" confirm-text="确认绑定">
			<b-input name="realname" title="真实姓名"></b-input>
			<b-input name="account" title="支付宝账号" class="mt10"></b-input>
			<view class="red mt10 pb20">请仔细核对姓名与账号，绑定后不可修改。</view>
		</b-modal-form>
		
		
		<!-- 提交成功 -->
		<b-result ref="result" title="提交成功" remark="提现申请已提交，请耐心等待财务审核。" @hide="back"></b-result>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data : {
					baker_coin : 0
				} ,
				list : [] ,
				submitData : {}
			}
		},
		computed: {
			defaultIndex() {
				let index = -1 ;
				for (var i = 0; i < this.list.length; i++) {
					let item = this.list[i] ;
					if (item.coins <= this.data.baker_coin) {
						index = i ;
					}
				}
				return index ;
			},
			needCode(){
				if (!!this.data.openid) {
					return false ;
				}
				// #ifdef MP-ALIPAY
				return this.data.withdrawType == "alipay" ;
				// #endif
				// #ifdef APP-PLUS || MP-WEIXIN
				return this.data.withdrawType == "wxpay" ;
				// #endif
			}
		},
		methods: {

			dataLoad({data,list}){
				this.data = data;
				this.list = list;
			},

			async submit(data){
				this.submitData = data ;
				
				// #ifndef MP-ALIPAY
				//绑定支付宝账号
				if (this.data.withdrawType != "wxpay" && !this.data.account) {
					this.$refs.bindAccount.show();
					return ;
				}
				// #endif
				
				//获取code用于绑定支付宝或微信
				if (this.needCode) {
					let provider = this.data.withdrawType == "wxpay" ? "weixin" : "alipay" ;
					this.submitData.code = await uni.$b.getCode(provider);
				}

				await this.confirm();
			},
			
			async onBindSuccess({formData}){
				this.data.account = formData.account ;
				await this.confirm();
			},
			
			async confirm(){
				if (this.data.withdrawType != "wxpay" && !!this.data.account) {
					uni.$b.showModal({
						content : `即将提现至支付宝账号${this.data.account}，确认继续吗？`,
						success: async (e) => {
							if (e.confirm) {
								await this.save();
							}
						}
					})
				}else{
					await this.save();
				}
			},
			
			//发起提现申请
			async save(){
				await this.bakerApi.withdraw(this.submitData);
				this.$refs.result.show();
			},
			
			back(){
				uni.$b.navigateBack({
					url : "/uni_modules/baker-app/pages/userCenter/userCenter",
					openType : "switchTab"
				});
			}
			
		}
	}
</script>

<style lang="scss">
	.activeBg{
		background-color: #fff5d9;
		border-color:#f2ca5b;
		color: #FCA111;
		font-weight: bold;
	}
</style>
