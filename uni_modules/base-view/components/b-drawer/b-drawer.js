import modal from "../b-modal/b-modal.js" ;
export default {
	mixins:[ modal ],
	props:{
		drawerStyle : String ,
		drawerClass : {
			type : [String,Array] ,
			default(){
				return uni.$b.getValue("components.drawer.drawerClass") ;
			}
		},
		headerClass : {
			type : [String,Array]  ,
			default(){
				return uni.$b.getValue("components.drawer.headerClass") ;
			}
		},
		bodyClass : {
			type : [String,Array]  ,
			default(){
				return uni.$b.getValue("components.drawer.bodyClass") ;
			}
		},
		footerClass: {
			type : [String,Array]  ,
			default(){
				return uni.$b.getValue("components.drawer.footerClass") ;
			}
		},
		showClose:[Boolean,String],
		width : [String , Number , Array] ,
		height : [String , Number , Array] ,
		placement:{
			type : [String,Array],
			default(){
				return "right"
			}
		},
		btnType : [Array,String]
	},
	data() {
		return {
			isRect : false ,
			footerRect : {height : 65},
			headerRect : {height : 45}
		}
	},
	computed:{
		
		_drawerClass(){
			return this.dv(this.drawerClass) ;
		},
		
		isMobile(){
			return this.deviceIndex == 0 ;
		},
		
		_btnType(){
			let type = this.btnType ;
			if (uni.$b.isNull(type)) {
				type = this.isVertical || this.isMobile ? 'coverBtn' : 'btn' ;
			}
			return this.dv(type) ;
		},
		
		animateName(){
			return {
				"top" : 'Up' ,
				"bottom" : 'Down' ,
				"left" : "Left" ,
				"right" : "Right"
			}[this.dvs.placement] ;
		},
		
		_inClass(){
			let name = this.animateName ;
			if (!this.isVertical) {
				name = this._placement == 'top' ? 'Down' : 'Up' ;
			}
			return `fadeIn${name}Sm`;
		},
		
		_outClass(){
			return `fadeOut${this.animateName}Sm`;
		},
		
		isVertical(){
			return this.dvs.placement == 'left' || this.dvs.placement == 'right' ;
		},
		
		_width(){
			let width = this.width ;
			if (uni.$b.isNull(width)) {
				width = !this.isVertical ? '100vw' : ["80%","660rpx"] ;
			}
			return this.pv(width) ;
		},
		
		_height(){
			let height = this.height ;
			if (uni.$b.isNull(height)) {
				height = this.isVertical ? '100vh' : ["80%","660rpx"] ;
			}
			return this.pv( height , uni.$b.getSafeArea().height ) ;
		},
		
		fixedStyle(){
			return uni.$b.getStyle({
				'z-index' : this.zIndex ,
				// 'top' : this.dvs.placement != 'bottom' ? 'var(--window-top)' : '' ,
				'bottom' : this.dvs.placement != 'top' ? 'var(--window-bottom)' : ''
			});
		},
		
		scrollStyle(){
			let height = '100vh' ;
			// #ifdef H5
			// height = 'calc(100vh - var(--window-bottom) - var(--window-top) )'
			height = 'calc(100vh - var(--window-bottom) )'
			// #endif
			return uni.$b.getStyle({ 
				'width' : !this.isVertical ? '100vw' : this._width ,
				'height' : this.isVertical ? height : this._height ,
				'padding-bottom' : this.isRect ? '' : `${this.footerRect.height}px` 
			} , this.drawerStyle ) ;
		},
		
		_bodyStyle(){
			let total = this.headerRect.height + this.footerRect.height ;
			return uni.$b.getStyle({
				'height' : this.isRect ? `calc(100% - ${total}px)` : '100%' 
			} , this.bodyStyle ) ;
		}
	},
	
	methods: {
		
		$resize(){},
		
		$onChange(isShow){
			if ( !isShow ) {
				this.isRect = false ;
			}else{
				this._queryRects();
			}
			this.$emit("change" , isShow);
			this.$emit("input" , isShow);
			this.$emit( isShow ? "show" : "hide" , isShow);
		},
		
		async _queryRects(){
			let [headerRect,footerRect] = await uni.$b.selectAll("._header,._footer",this);
			this.headerRect = headerRect || {height : 65} ;
			this.footerRect = footerRect || {height : 45} ;
			this.isRect = true ;
		}
	}
}