<template>
	<view class="pd">
		<b-data url="baker/api/config/services" v-slot:default="{data}">
			<rich-text :nodes="data.service"></rich-text>
		</b-data>
	</view>
</template>
