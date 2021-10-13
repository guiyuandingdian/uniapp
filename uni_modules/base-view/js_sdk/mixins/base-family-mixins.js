function getChild( father , childName , childrenList ){
	if (!father) {
		return ;
	}
	let children = father.$children ;
	if (!children || children.length == 0 ) {
		return ;
	}
	for(let child of children){
		//当前的子元素为要查找的元素
		if (child.$options.name === childName ) {
			childrenList.push(child) ;
		}
		//查找其下级元素
		getChild( child , childName , childrenList );
	}
}

function match (targetName , name) {
	if (uni.$b.isString(targetName)) {
		return targetName === name ;
	}
	if (uni.$b.isReg(targetName)) {
		return targetName.test(name) ;
	}
	return false ;
}

export default {
	
	// #ifdef MP-TOUTIAO
	data(){
		return {
			baseComputedTime : 0
		}
	},
	// #endif
	
	methods : {
		
		/**
		 * @description 根据父级的name来查找父级对象
		 * @param {String | RegExp} targetName 要查找的父级的name
		 * @return {Object} 返回父级对象
		 */
		getParent : function(targetName){
			let parent = this.$parent ;
			while(parent){
				if (match(targetName , parent.$options.name)) {
					
					// #ifdef MP-TOUTIAO
					
					//头条的computed属性的计算时间早于created生命周期，注入一个响应式属性在created后重新计算computed属性
					this.baseComputedTime = Date.now() ;
					
					// #endif
					
					return parent ;
				}
				parent = parent.$parent ;
			}
			return false ;
		},
		
		/**
		 * @description 查询子级对象
		 * @param {Object} targetName
		 */
		getChildren(targetName){
			let children = [] ;
			getChild( this , targetName , children) ;
			return children ;
		},
		
		/**
		 * @description 继承父级组件的属性
		 * @param {String} prop 属性名
		 * @param {String} defaultValue 默认值
		 * @param {String} configValueKey 配置项的键名
		 */
		extendProp( prop , defaultValue , configValueKey){
			// #ifdef MP-TOUTIAO
			//头条的computed属性的计算时间早于created生命周期，注入一个响应式属性在created后重新计算computed属性
			if (this.baseComputedTime < 0) {
				return ;
			}
			// #endif
			if ( uni.$b.notNull(this.$props[prop]) ) {
				return this.$props[prop] ;
			}
			if ( this.parent && uni.$b.notNull(this.parent.$props[prop]) ) {
				return this.parent.$props[prop] ;
			}
			return uni.$b.isNull(configValueKey) ? defaultValue : uni.$b.getValue( configValueKey , defaultValue ) ;
		}
	}
}