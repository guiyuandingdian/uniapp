<template>
	<view class="pd">
		<b-data url="baker/api/config/privacy" v-slot:default="{data}">
			<rich-text :nodes="data.privacy"></rich-text>
		</b-data>
	</view>
</template>
