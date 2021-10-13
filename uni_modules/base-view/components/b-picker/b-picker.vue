<template>
	<view class="b-picker form-item">
		
		<b-label
			:title="title" 
			:title-width="titleWidth" 
			:title-class="titleClass"
			:title-style="titleStyle"
			:position="position" 
			:align="align" 
			:requiredMark="_requiredMark" 
			:required="_required"
			:errorContent="errorTip">
			
			<view class="father">
				
				<view class="flex" :class="pickerClass" :style="pickerStyle" id="formItem">
					<slot v-if="slots.title" name="title" :index="curIndex" :title="curTitle" :data="curItem"></slot>
					<block v-else>
						<view :class="{ 'gray' : curIndex == -1}">{{curTitle}}</view>
						<view class="gray pl10 fz12">
							<view :class="icon"></view>
						</view>
					</block>
				</view>
				
				<picker class="abs op0" mode="selector" range-key="title" :range="listData" @change="_onChange" @cancel="_onCancel">
					<view class="abs op0">picker</view>
				</picker>
			</view>
			
			<slot></slot>
			
			
		</b-label>
		
	</view>
</template>

<script>
	import formMixins from "../../js_sdk/mixins/base-form-mixins.js";
	import listMixins from "../../js_sdk/mixins/base-request-list-mixins.js" ;
	export default {
		name:"b-picker",
		mixins:[formMixins,listMixins],
		props:{
			pickerClass:{
				type : String ,
				default : "rt plr10"
			},
			icon:{
				type : String ,
				default : "bIcon-arrowRight"
			}
		},
		computed: {
			slots(){
				return uni.$b.getSlots.call(this,"title");
			},
			listData() {
				return this.authListData.map(item=>{
					return {
						title : item[this.titleKey],
						value : item[this.valueKey]
					}
				}) ; 
			},
			curIndex(){
				return this.listData.findIndex(item=> (this.isValue && item.value === this.valueSync) || (!this.isValue && index === parseFloat(this.valueSync) ));
			},
			curTitle(){
				return this.curIndex == -1 ? uni.$b.localeB("validate.selectPrefix") : this.listData[this.curIndex].title ;
			},
			curItem(){
				if (this.curIndex == -1) {
					return {} ;
				}
				let curIndex = this.listData[this.curIndex]._index ;
				return this.listSync[curIndex] ;
			},
			pickerStyle(){
				return uni.$b.getStyle({
					"height" : `${this._scale * 80}rpx`
				})
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			_onChange(e){
				let index = e.detail.value ;
				this.select(index);
			},
			
			_onCancel(e){
				this.$emit("cancel" , {detail : {value : this.$finalValue }}) ;
			},
			
			select(index){
				let item = this.listData[index] ;
				let value = this.isValue ? item.value : index ;
				this.$changeValue({ detail : { value , index : item._index , item : uni.$b.clone(this.listSync[item._index]) } });
			}
		}
	}
</script>