export default {
	props:{
		movable :{
			type : [String , Boolean] ,
			default : false 
		}
	},
	data() {
		return {
			movingPoint : {},
			boxRect:{},
			rects : [],
			movingIndex : -1 ,
			showMoveView : true 
		}
	},
	computed:{
		
		moveAreaStyle(){
			return uni.$b.getStyle({
				"width" : `${this.boxRect.realWidth}px` ,
				"height" : `${this.boxRect.realHeight}px`
			});
		},
		
		_movable(){
			return this.imgAreas.length > 0 && uni.$b.isTrue(this.movable) && this.showMoveView ;
		},
		
		imgAreas(){ 
			return this.rects.map((c,i)=>{
				let isMoving =  this.movingIdxs.includes(i) ;
				let {width , height , left , top } = c ;
				let style = uni.$b.getStyle({
					"width" : `${width}px`,
					"height" : `${height}px`,
					"z-index" : isMoving ? 2 : '' ,
					"opacity" : isMoving ? 0.7 : '' ,
					"padding" : this._gutter
				});
				let x = left - this.boxRect.left  ;
				let y = top - this.boxRect.top ;
				let item = this.listSync[i] ;
				let src = item ? item.src : '' ;
				let className = isMoving ? '' : 'op0' ;
				let keepLoading = item && item.keepLoading ;
				return { style , x , y ,  src , width , height , className , keepLoading };
			});
		}
	},
	
	created(){
		uni.onWindowResize(this._queryRects);
		this._resetPosDelay = uni.$b.once( this._resetPosDelay , 500 );
		this._updateRects = uni.$b.once( this._updateRects , 450 ); //延迟时间为animation动画执行时间
	},
	
	async mounted() {
		await this._queryRects();
		//modal组件的动画会导致查询信息不准确，待动画结束后再次查询
		setTimeout(this._queryRects , 200);
	},
	
	methods: {
		
		_onMoving(e){
			//setData调整位置引起的位移应忽略
			if (e.detail.source != 'touch' || this.movingIndex == -1) {
				return ;
			}
			//记录当前的位置
			this.movingPoint = e.detail ;
			//鼠标按下，持续500ms不移动时自动复位，避免mouseup事件未触发引起的位置错乱。
			this._resetPosDelay();
		},
		
		_resetPosDelay(){
			//若500ms内松开鼠标，则movingIndex = 1 不再执行，否则会执行一次。
			this._exchangePos();
		},
		
		_onMouseDown(index){
			this.movingIndex = index ;
			this.movingIdxs = [index] ;
		},
		
		_exchangePos(){
			let index = this.movingIndex ;
			let {x,y} = this.movingPoint ;
			if (index == -1 || x === undefined || y === undefined) {
				this.movingIdxs = [] ;
				this.movingIndex = -1 ;
				this.movingPoint = {} ;
				return ;
			}
			
			//寻找最近的中心点
			let {exchangeIndex} = this._getNear(x , y , index);
			
			//交换坐标数据
			this._exchangePosData( this.rects , index , exchangeIndex ) ;
			
			//本次位置交换结束
			this.movingIndex = -1 ;
			this.movingPoint = {} ;
			
			this._updateRects(exchangeIndex , index);
		},
		
		_updateRects(exchangeIndex , index){
			this._queryRects();
			this.$emit("change" , { detail : { value : uni.$b.clone(this.list) , exchangeIndex , index } }) ;
		},
		
		//寻找最近的中心点
		_getNear(x,y,index){
			let item = this.rects[index] ;
			//移动区域的中心点
			let centerX = x + item.width/2 ;
			let centerY = y + item.height/2 ;
			
			return this.rects.reduce( (prev , c , exchangeIndex ) => {
				//当前点的中心点
				let pointX = c.left - this.boxRect.left + c.width/2 ;
				let pointY = c.top - this.boxRect.top + c.height/2 ;
				let xPow = Math.pow( Math.abs( pointX - centerX) , 2) ;
				let yPow = Math.pow( Math.abs( pointY - centerY) , 2 ) ;
				let distance = Math.sqrt(  xPow  + yPow ) ;
				let smaller = exchangeIndex == 0 || distance < prev.distance ;
				return smaller ? { exchangeIndex , distance} : prev ;
			}, {});
		},
		
		//交换位置
		_exchangePosData( list , index , exchangeIndex){
			if (index == -1 ) {
				return ;
			}
			
			//交换坐标数据
			let {top,left} = list[index] ;
			let {top:exTop,left:exLeft} = list[exchangeIndex] ;
			
			if(index == exchangeIndex){
				exTop += 0.001 ;
				exLeft += 0.001 ;
			}else{
				//交换图片数据
				this.$set(this.list , index , this.list.splice(exchangeIndex,1,this.list[index])[0] ) ;
			}
			
			this.$set(list[index],"top" , exTop);
			this.$set(list[index],"left" ,exLeft);
			
			this.$nextTick(()=>{
				this.movingIdxs.push(exchangeIndex);
				this.$set(list[exchangeIndex],"top" , top);
				this.$set(list[exchangeIndex],"left" ,left);
			})
			
		},

		_queryRects(){
			this.showMoveView = false ;
			uni.$b.selectAll("._box,._img",this).then(rects=>{
				let boxRect = rects.splice(0,1)[0] ;
				
				//极端情况：同时触发tap、move事件
				if (boxRect.length == 0 || boxRect.height == 0) {
					this._initMoveAreas();
					return ;
				}
				
				//对行分组
				let tops = uni.$b.combine(rects.map(c=>c.top));
				
				//最大的行宽
				let max = tops.reduce((max,t)=>{
					let totalWidth = rects.reduce((total,c)=>{
						return c.top === t ? total + c.width : total ;
					},0);
					return totalWidth > max ? totalWidth : max ;
				},0);
				
				boxRect.realWidth = max ;
				boxRect.realHeight = rects.length > 0 ? rects[0].height * tops.length : boxRect.height ;
				
				this.boxRect = boxRect ;
				this.rects = rects ;
				
				this._initMoveAreas();
			});
		},
		
		_initMoveAreas(){
			this.notInit = false ;
			this.movingIndex = -1 ;
			this.movingIdxs = [] ;
			this.movingPoint = {} ;
			this.showMoveView = true ;
		}
	}
}