import mediaMixins from "../../js_sdk/mixins/base-media-mixins.js" ;
import familyMixins from "../../js_sdk/mixins/base-family-mixins.js" ;
import {store} from "../../js_sdk/state/base-menu-state.js" ;

export default {
	mixins:[mediaMixins , familyMixins],
	props:{
		title : {
			type : String ,
			required : true 
		},
		mid : {
			type : [String,Number] ,
			required : true 
		},
		icon : String ,
		url : String ,
		openType : String ,
		arrow : String ,
		activeUrl : [String , Array]
	},
	
	data(){
		return {
			level : 1 ,
			hasParent : false
		};
	},
	
	computed:{
		slots(){
			return uni.$b.getSlots.call(this , "default") ;
		},
		dvs(){
			return this.getDvs("titleClass","activeClass","subActiveClass","subClass") ;
		},
		uvs(){
			return this.getUvs("height") ;
		},
		arrowClass(){
			return uni.$b.getClassName({
				'rotate' : this.isOpened
			} , this.arrow ) ;
		},
		_titleClass(){
			return uni.$b.getClassName({
				'light8' : !this.isActive && !this.isOpened ,
				'hover8' : !this.isActive || this.isOpened ,
				'pointer' : this.isActive ,
				'ct' : this.isCollapse ,
				'pr' : !this.isCollapse ,
				[this.dvs.titleClass] : true ,
				[this.dvs.activeClass] : this.isActive
			}) ;
		},
		_titleStyle(){
			let height = this.uvs.height ;
			let width = this.isCollapse ? height : '' ;
			let paddingLeft = this.isCollapse ? '' : `${(this.level - 1) * 10 + 15}px` ;
			if (this.isActive) {
				return uni.$b.getStyle({
					"background-color" : this.activeBgColor ,
					"color" : this.activeColor ,
					"padding-left" : paddingLeft ,
					height ,
					width 
				});
			}
			return uni.$b.getStyle({
				"background-color" : this.bgColor ,
				"color" : this.color ,
				"padding-left" : paddingLeft ,
				height ,
				width 
			});
		},
		
		storeData(){
			if (!this.hasParent) {
				return {} ;
			}
			return store.state[this.parent.name] ;
		},
		
		_activeUrl(){
			return uni.$b.parseArray(this.activeUrl , ",").map(item => item.url) ;
		},
		
		activeId(){
			return this.storeData.activeId ;
		},
		
		isActive(){
			let url = this.storeData.pagePath ;
			return this.url === url || this._activeUrl.includes(url) ;
		}
		
	},
	
	watch:{
		isActive(){
			if (this.isActive && this.activeId !== this.mid ) {
				this.commit("setActiveId");
			}
		},
		activeId(){
			if (this.activeId === this.mid && this.storeData.pagePath !== this.url ) {
				this.commit("setPagePath" , {route : this.url});
			}
		}
	},
	
	created(){
		this.parent = this.getParent("b-menu");
		if (!this.parent) {
			console.error(`${this.$options.name} should be used with the component b-menu`);
		}
		
		//触发storeData更新
		this.hasParent = true ;
		
		this.underParent = this.getParent(/(b-menu-item|b-sub-menu)$/);
	},
	
	mounted(){
		store.commit("setMids" , {
			name : this.parent.name ,
			mid : this.mid ,
			parentId : this.underParent ? this.underParent.mid : null 
		})
	},
	
	
	methods: {
		
		commit(name , data = {}){
			if (!this.parent || !this.parent.name ) {
				return ;
			}
			data.name = this.parent.name ;
			data.mid = this.mid ;
			store.commit(name , data);
		},
		
		select(){
			this.parent.select(this.url);
			if (this.url) {
				uni.$b.open({
					url : this.url ,
					openType : this.openType 
				})
			}
			this.$onSelect();
		},
		
		$onSelect(){}
	}
}