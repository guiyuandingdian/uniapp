<template>
	<view class="b-datepicker form-item noOutline" tabindex="-1" @focus="_onFocus" @blur="_onBlur">
		
		<view v-if="isMb && showPicker" @tap="showPicker=false;" class="fixed wp" :style="pickerStyle"></view>
		
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
			
			<view class="pointer flex" :class="boxClassName" :style="boxStyle" id="formItem" @tap="toggle">
				<view class="cover">
					<input class="pointer" type="text" :value="valueText" :placeholder="_placeholder" :disabled="true">
				</view>
				<view class="gray fz12 plr10">
					<view v-if="isShowClear" @tap.stop="_onCancel" class="bIcon-closeFill light7"></view>
					<view v-else-if="_calendarIcon" class="bIcon-calendar hover7"></view>
				</view>
			</view>
			
			<view class="father">
				<view :class="pickerClass" :style="pickerStyle">
					<b-animate
						v-model="showPicker" 
						in-class="fadeInUpSm"
						out-class="fadeOutUpSm"
						:duration="100">
						
						<mxDatePicker
							:show="showPicker"
							:format="_format"
							:showSeconds="_showSeconds"
							:showHoliday="_showHoliday"
							:type="type" 
							:color="color"
							:value="pickerValue"
							:show-tips="_showTips" 
							:begin-text="startText" 
							:end-text="endText" 
							:show-seconds="showSeconds"
							:start="_start"
							:end="_end"
							:cancelText="_cancelText"
							@confirm="_onSelected" 
							@cancel="_onCancel" />
							
					</b-animate>
				</view>
			</view>
			
			
		</b-label>
		
		
		<!-- 结束时间 -->
		<b-input class="none"
			v-if="isRange"
			:disabled="true" 
			:required="false" 
			:name="endName" 
			:value="_endValue"
			:valueType="_endValueType"
			@change="_onEndChange"></b-input>
		
	</view>
</template>

<script>
	import formMixins from "../../js_sdk/mixins/base-form-mixins.js" ;
	import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
	import mxDatePicker from "./mx-datepicker/mx-datepicker.vue" ;
	const formatMap = {
		"date" : "yyyy-MM-dd" ,
		"time" : "HH:mm" ,
		"datetime" : "yyyy-MM-dd HH:mm" ,
		"range" : "yyyy-MM-dd" ,
		"rangetime" : "yyyy-MM-dd HH:mm" ,
	};
	export default {
		name : "b-datepicker",
		mixins:[formMixins,mediaMixins],
		components:{mxDatePicker},
		props:{
			valueType:{
				type : [String,Function],
				default(){
					return uni.$b.getValue("components.datepicker.valueType")
				}
			},
			endValueType:{
				type : [String,Function],
				default(){
					return uni.$b.getValue("components.datepicker.endValueType")
				}
			},
			endValue:[String,Number,Date],
			endName:String,
			color:{
				type : String ,
				default(){
					return uni.$b.getValue("components.mainColor")
				} 
			},
			showSeconds:[Boolean,String],
			showHoliday:[Boolean,String],
			showTips:{
				type : [Boolean,String],
				default : false
			},
			start:[String,Number,Date],
			end:[String,Number,Date],
			startText:String,
			endText:String,
			cancelText:String,
			type : {
				type : String ,
				default(){
					return uni.$b.getValue("components.datepicker.type")
				}
			},
			format : String,
			calendarIcon:{
				type : [String,Boolean],
				default : true
			},
			clearable:{
				type : [String,Boolean],
				default : true
			},
			zIndex:{
				type : [String,Number],
				default : 15
			}
		},
		data() {
			return {
				showPicker : false ,
				endValueSync : "" ,
				rect : {}
			}
		},
		computed: {
			_type(){
				return "text" ;
			},
			isMb(){
				return this.deviceIndex === 0 ;
			},
			_emptyPrefix(){
				return this.emptyPrefix || uni.$b.localeB("validate.selectPrefix") ;
			},
			pickerPosition(){
				let {width , height} = uni.$b.getSafeArea() ;
				let top = this.rect.bottom < height - 450 ? "top mt5" : "bottom mb45" ;
				let left = this.rect.right > width - 350 && this.rect.width < 350 ? "right" : "left" ;
				return `${top} ${left}`;
			},
			pickerClass(){
				return this.isMb ? "fixed center" : `abs ${this.pickerPosition}` ;
			},
			pickerStyle(){
				return `z-index:${this.zIndex}`;
			},
			_start(){
				return this._parseTimestamp( this.start );
			},
			_end(){
				return this._parseTimestamp( this.end );
			},
			_showTips(){
				return uni.$b.isTrue(this.showTips);
			},
			_showHoliday(){
				return uni.$b.isTrue(this.showHoliday);
			},
			_showSeconds(){
				return uni.$b.isTrue(this.showSeconds);
			},
			_calendarIcon(){
				return uni.$b.isTrue(this.calendarIcon);
			},
			_clearable(){
				return uni.$b.isTrue(this.clearable);
			},
			_myFormat(){
				if (!!this.format) {
					return this.format ;
				}
				let format = formatMap[this.type];
				return this._showSeconds && this.isTime ? `${format}:ss` : format ;
			},
			_format(){
				let format = this._myFormat ;
				return format.replace(new RegExp("m" , "g") , "i").toLowerCase();
			},
			isRange(){
				return this.type == 'rangetime' || this.type == 'range' ;
			},
			isTime(){
				return this.type.indexOf("time") > -1 ;
			},
			$finalValue(){
				return this._getStartDate(false);
			},
			_endValue(){
				return this._getEndDate(false);
			},
			pickerValue(){
				return this._getPickerValue(true)  ;
			},
			valueText(){
				let values = this._getPickerValue(false) ;
				if (uni.$b.isString(values)) {
					values = [values] ;
				}
				let list = values.filter(item => !!item ) ;
				return list.join( " ~ " ) ;
			},
			_cancelText(){
				let key = this.isShowClear ? "clear" : "cancel" ;
				return uni.$b.localeB(`datepicker.${key}`);
			},
			isShowClear(){
				return this._clearable && !this._disabled && !!this.valueText ;
			},
			
			_inputClass(){
				return this.dv(this.inputClass) ;
			},
			boxClassName(){
				return uni.$b.getClassName({
					'focus' : this.focusSync , 
					'disabled' : this._disabled , 
					'error' : !!this.errorTip  , 
					'visitedStatus' : true
				} , !!this._inputClass ? this._inputClass : 'bd rds2 pl10' );
			},
			boxStyle(){
				return uni.$b.getStyle({
					"height" : `${this._scale*80}rpx` 
				} , this.inputStyle);
			},
			_valueType(){
				let valueType = this.type == 'time' ? "" : this.valueType ;
				return this._parseValueType(valueType);
			},
			_endValueType(){
				let valueType = this.type == 'time' ? "" : this.endValueType || this.valueType ;
				return this._parseValueType(valueType);
			}
		},
		watch: {
			endValue:{
				handler(value){
					if(this.endValueSync !== value){
						this.endValueSync = value ;
					}
				},
				immediate : true 
			},
		},
		mounted() {
			this._queryRect();
		},
		methods: {
			_onFocus(){
				this.focusSync = true ;
			},
			_onBlur(){
				this.focusSync = false ;
				this.showPicker = false ;
			},
			async toggle(){
				if (this._disabled) {
					return ;
				}
				await this._queryRect();
				this.showPicker = !this.showPicker;
			},
			async _queryRect(){
				this.rect = await uni.$b.select("#formItem",this) ;
			},
			_getStartDate(setDef){
				let today = new Date() ;
				let defDate = this._start ? new Date(this._start) : ( uni.$b.notNull(this._end) && today.getTime() > this._end ? new Date(this._end) : today ) ;
				return this._toStr(this.valueSync , setDef ? defDate : "");
			},
			_getEndDate(setDef){
				let today = new Date() ;
				let defDate = this._end ? new Date(this._end) : ( uni.$b.notNull(this._start) && today.getTime() < this._start ? new Date(this._start) : today ) ;
				return this._toStr(this.endValueSync , setDef ? defDate : "");
			},
			_getPickerValue(setDef){
				let start = this._getStartDate(setDef);
				if (this.isRange) {
					let end = this._getEndDate(setDef);
					return [ start , end ] ;
				}
				return start ;
			},
			_onSelected({date, value}){
				if (this.isRange) {
					date.sort((a,b) => a-b);
					let [start,end] = date ;
					this.valueSync = start ;
					this.endValueSync = end ;
				}else{
					this.valueSync = date ;
				}
				this.showPicker = false ;
				this.$changeValue({detail : { value : this.valueSync }});
			},
			_onCancel(e){
				this.showPicker = false ;
				if (this._clearable) {
					this.valueSync = "" ;
					this.endValueSync = "" ;
					this.$changeValue({detail : { value : this.valueSync }});
				}
			},
			_onEndChange(e){
				this.endValueSync = e.detail.value ;
				this.$changeValue({detail : { value : this.valueSync }});
			},
			handleValueChange(e){
				e.detail.endValue = this._endValue ;
				e.detail.value = this.$finalValue ;
			},
			_parseTimestamp(date){
				date = this._parseTimeStr(date);
				date = uni.$b.parseDate( date , "");
				return uni.$b.isNull(date) ? '' : date.getTime() ;
			},
			_parseTimeStr(date){
				if (this.type != 'time' || !uni.$b.isString(date) || date.length > 8) {
					return date ;
				}
				let timeArr = date.trim().split(":").map(item => parseInt(item));
				return new Date().setHours(...timeArr , 0 , 0);
			},
			_toStr(value , defDate ){
				let date = uni.$b.parseDate( value , defDate);
				return uni.$b.format({
					date , 
					format : this._myFormat
				});
			}
		}
	}
</script>
<style lang="scss">
	.noOutline{
		outline: none;
	}
	.uni-input-input{
		cursor: pointer;
	}
	@import "../b-input/b-input.scss";
</style>