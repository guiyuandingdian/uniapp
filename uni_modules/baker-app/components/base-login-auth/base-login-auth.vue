<template>
	<view>
		<view class="flex ct">
			<slot></slot>
			<view v-if="!!logo" class="plr30 gray op5 bIcon-auth fz30"></view>
			<image v-if="!!logo" :src="logo" mode="aspectFill" class="w60 h60 rds"></image>
		</view>
		
		<view class="mt30">
			<view class="fz16 bold">
				{{title}}
			</view>
			<view class="gray mt10">
				{{remark}}
			</view>
		</view>
		
		<view class="plr30 mt50" @tap="$emit('auth')">
			<b-btn type="block" radius="23px">立即授权</b-btn>
		</view>
	</view>
</template>

<script>
	export default {
		name:"base-login-auth",
		props:{
			logo : String ,
			type : String ,
			title : String ,
			remark : String
		}
	}
</script>
