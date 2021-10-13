<template>
	<view class="b-more father hidden">
		
		<!-- 隐藏时撑起盒子内容，显示时展开 -->
		<view @tap="_tapText" class="break father" :class="multiClass" :style="multiStyle">
			
			<view id="mutiline" style="display: inline;">
				<text>
					{{text}}
				</text>
			</view>
			 
			<slot></slot>
			
			<text class="gray fz12 pointer" v-if="showHideBtn" @tap="toggle">
				<text class="bIcon-left mlr3"></text>
				收起
			</text>
			
		</view>
		
		<!-- 默认显示一行 -->
		<view class="abs top" id="oneLine" @tap="toggle" :class="{op0:openSync}">
			<view :class="singleClass" :style="singleStyle">
				<text>
					{{text}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name : "b-more" ,
		options: {
		    multipleSlots: true // 在组件定义时的选项中启用多slot支持
		},
		mixins:[uni.$b._mixins.media],
		props:{
			//是否展开
			value : {
				type : [Boolean , String] ,
				default : false 
			},
			text:{
				type : String ,
				required : true
			},
			lines:{
				type : [String,Number,Array],
				default(){
					return 1 ;
				}
			},
			//最小宽度
			minWidth:{
				type : [Number ,String , Array] ,
				default(){
					return ["600rpx" , "600rpx" , "30px"]
				}
			},
			//点击文字内容本身收起，否则点击收起按钮收起
			toggleMe : {
				type: [Boolean , String] ,
				default : true 
			}
		},
		data() {
			return {
				openSync : false ,
				height : '22px' ,
				showMore : false 
			};
		},
		computed:{
			_lines(){
				return this.dv(this.lines) ;
			},
			_toggleMe(){
				return uni.$b.isTrue(this.toggleMe) ;
			},
			showHideBtn(){
				return !this.$slots.default && this.showMore && !this._toggleMe ;
			},
			multiClass(){
				let names = [this.openSync?'z2':'op0'];
				if (this._toggleMe && this.showMore) {
					names.push("pointer");
				}
				return names.join(" ");
			},
			multiStyle(){
				return uni.$b.getStyle({
					'height' : this.height , 
					'min-width' : this.uv(this.minWidth) ,
				})
			},
			singleClass(){
				return uni.$b.getClassName({
					'pointer' : this.showMore,
					'cut' : this._lines === 1 ,
					'clip' : this._lines > 1 
				})
			},
			singleStyle(){
				return uni.$b.getStyle({
					'-webkit-line-clamp' : this._lines
				});
			}
		},
		watch:{
			value:{
				handler(){
					this.openSync = this.value ;
				},
				immediate : true 
			}
		},
		
		created() {
			uni.$on("baseToggleMore",(isSlideUp)=>{
				if (this.openSync === isSlideUp) {
					return ;
				}
				this.toggle();
			});
		},
		
		mounted() {
			this._setHeight();
		},
		
		methods:{
			
			toggle:function(){
				//没有更多
				if (!this.showMore) {
					this._setHeight(); //高度纠偏
					return ;
				}
				
				this.openSync = !this.openSync ;
				this.$emit("input" , this.openSync);
				this.$emit("change" , this.openSync);
				this._setHeight();
			},
			
			_setHeight(){
				uni.$b.selectAll("#mutiline,#oneLine",this).then( ([multi , one]) =>{
					if (one && one.height > 0) {
						this.height = this.openSync ? 'auto' : one.height + 'px' ;
					}
					this.showMore = multi.height > one.height + 10 ;
				})
			},
			
			_tapText(){
				if (!this._toggleMe) {
					return ;
				}
				this.toggle();
			}
		}
	}
</script>
