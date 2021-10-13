<template>
	<view>
		<view class="plr ptb20">
			<button @tap="$refs.bindInviter.show();" class="rds25 ptb10 shareBtn" hover-class="op8">
				<view class="flex ct">
					<view class="bk-bangding mr7"></view>
					绑定邀请人
				</view>
			</button>
		</view>
		
		<b-modal-form ref="bindInviter" action="base-fission/user/bindInviter" @success="onSuccess" v-model="focus"
			in-class="fadeInDownSm" out-class="fadeOutUpSm" title="填写邀请码" width="600rpx" 
			:title-width="0" :show-cancel="false" confirm-text="确认绑定" placement="topCenter" top="15%">
			
			<view class="plr50 pt">
				<b-input name="inviteCode" :focus="focus" validate-title="邀请码" input-class="bb text-center fz30 bold" :clearable="false"></b-input>
			</view>
			
			<view slot="footer" class="flex ct pb30">
				<b-btn form-type="submit" :plr="30" radius="23px">确认绑定</b-btn>
			</view>
			
		</b-modal-form>
	</view>
</template>

<script>
	export default {
		name:"baker-bind-inviter",
		data(){
			return {
				focus : false 
			}
		},
		methods: {
			onSuccess(){
				this.$emit("success");
			}
		}
	}
</script>
<style lang="scss">
	.shareBtn{
		font-size: 16px;
		letter-spacing: 2px;
		color: #e9153e;
		font-weight: bold;
		background-image: linear-gradient(#ffe38e, #fec44d);
	}
</style>