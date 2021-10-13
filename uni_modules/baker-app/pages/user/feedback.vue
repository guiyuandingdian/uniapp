<template>
	<view class="pd">
		
		<b-form action="baker/api/feedback/save" @success="$refs.result.show();" position="top">
			<b-input name="name" title="联系人" :maxlength="10" :required="false" input-class="grayBg rds4"></b-input>
			<b-input name="telephone" title="联系电话" type="telephone" :required="false" input-class="grayBg rds4"></b-input>
			<b-textarea name="content" title="留言内容" :maxlength="500" min-height="100px" textarea-class="grayBg rds4"></b-textarea>
			<b-img-upload name="imgs" title="图片" :required="false" :max="9"></b-img-upload>
			<view class="plr">
				<b-btn class="mt30" form-type="submit" type="block" radius="23px">确认提交</b-btn>
			</view>
		</b-form>
		
		<b-result ref="result" title="提交成功" remark="感谢您的反馈，客服已收到。" @change="back"></b-result>
		
	</view>
</template>

<script>
	export default {
		methods:{
			back(isShow){
				if (!isShow) {
					uni.navigateBack();
				}
			}
		}
	}
</script>
