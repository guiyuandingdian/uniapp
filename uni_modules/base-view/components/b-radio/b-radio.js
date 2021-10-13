export default {
	mixins:[uni.$b._mixins.form , uni.$b._mixins.requestList , uni.$b._mixins.media ],
	props:{
		mode:{
			type : String ,
			default : "local"
		},
		color:{
			type : String ,
			default : uni.$b.getValue("components.mainColor")
		},
		textColor:{
			type : String ,
			default : uni.$b.getValue("components.mainInverse")
		},
		indexValue:{
			type:[String,Boolean],
			default : false
		},
		defaultIndex:{
			type : [String , Number],
			default : 0 
		},
		width:{
			type : [String,Number,Array] ,
			default(){
				return 'auto' ;
			}
		},
		type:{
			type : String ,
			default : "normal"
		},
		radius:{
			type : [String,Number,Array],
			default : "100%"
		}
	},
	computed:{
		
		slots(){
			return uni.$b.getSlots.call(this , "default" , "append" , "prepend" , "option" ) ;
		},
		
		_styleType(){
			return this.dv(this.type) ;
		},
		
		_type(){
			return "text" ;
		},
		
		_width(){
			return this.uv(this.width) ;
		},
		
		_emptyPrefix(){
			return this.emptyPrefix || uni.$b.localeB("validate.selectPrefix") ;
		},
		
		size(){
			return parseInt(this._scale * 36) ;
		},
		
		outerClassName(){
			return `type_${this._styleType}`;
		},
		
		margin(){
			if (this.listData.length == 0) {
				return 0 ;
			}
			return this._styleType == 'badge' || this._styleType == 'tag' ? 12 : 20 ;
		},
		
		boxStyle(){
			let margin = `-${this.margin}rpx` ;
			return uni.$b.getStyle({
				'min-height' : `${this.size*2}rpx` ,
				'margin-left' : margin ,
				'margin-right' : margin
			})
		},
		
		itemClass(){
			let isDefault = this._styleType == 'normal' ;
			let isBlock = this._styleType == 'block' ;
			let isTags = !isBlock && !isDefault ;
			return uni.$b.getClassName({
				'lt' : isDefault ,
				'ct ptb4 plr10' : isTags && !this.slots.option ,
				'ptb1' : !isTags ,
				'inner flex' : !this.slots.option
			});
		},
		
		itemStyle(){
			let pd = `${this.margin}px` ;
			return uni.$b.getStyle({
				'width' : `${this._width}` 
			});
		},
		
		$finalValue(){
			let index = Number(this.defaultIndex) ;
			let isDefault = uni.$b.isNull(this.valueSync) && index > -1 && this.authListData.length > index ;
			return isDefault ? this.authListData[index][this.valueKey] : this.valueSync ;
		},
		
		showEmpty(){
			return this.listData.length == 0 && (this.isLocalMode || (this.inited && this.isRemoteMode)) ;
		},
		
		listData(){
			return this.authListData.map( (item,index) => {
				let value = item[this.valueKey] ;
				let checked = this._isChecked(value , index) ;
				
				let disabled = this._isDisabled( item[this.disabledKey] , checked ) ;
				let bdColor = checked ? this.color : "#e0e0e0" ; 
				return {
					data : item ,
					value ,
					checked ,
					disabled ,
					_index : item._index ,
					_indexValue : index ,
					title : item[this.titleKey] ,
					className:uni.$b.getClassName({
						'disabled' : disabled ,
						'pd10' : this._styleType == 'normal' || this._styleType == 'block' ,
						'ptb3 plr6' : this._styleType == 'badge' || this._styleType == 'tag'
					}),
					style: uni.$b.getStyle({
						'border-color' : checked && (this._styleType == 'badge' || this._styleType == 'tag') ? this.color : '' ,
						'color' : checked && this._styleType == 'tag' ? this.color : '' ,
					}),
					titleStyle: uni.$b.getStyle({
						'color' : checked && this._styleType == 'badge' ? this.color : '' ,
						'height' : `${this.size}rpx` ,
						'line-height' : `${this.size}rpx`
					})
				} ;
			});
		}
	},
	
	methods: {
		
		select(index){
			if (index < 0 || index > this.listData.length -1 ) {
				return ;
			}
			let item = this.listData[index] ;
			if (item.disabled) {
				return ;
			}
			this._onSelect(index,item);
		},
		
		_onSelect(index , item){
			let checked = !item.checked ;
			this.listData[index].checked = checked ;
			this.valueSync = this.isValue ? item.value : index ;
			this.$changeValue({detail:{value : this.$finalValue , index : item._index , item : this.listSync[item._index] }});
		},
		
		_isChecked(value , index){
			let checked = (this.isValue && this.$finalValue === value ) || (!this.isValue && parseFloat(this.$finalValue) === index)
			return checked ;
		},
		
		_isDisabled(disabled){
			return this._disabled || uni.$b.isTrue(disabled) ;
		}
	}
}