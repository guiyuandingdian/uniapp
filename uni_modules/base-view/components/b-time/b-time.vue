<template>
	<view @tap="toggle" :class="{'hover7' : _showTime}">
		{{dateStr || defaultStr}}
	</view>
</template>

<script>
	/**
	* @description Time 时间格式化，日期格式化
	* @tutorial    https://static-bb1f6ced-c751-4549-bcfc-10cd6eb9240e.bspapp.com/#/pages/doc/time
	* @version     1.0.0
	* 
	* 
	* @ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Props 属性<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	* 
	* @property {String|Number|Date}   date                          待格式化的时间，支持日期、时间戳（10位、13位均可）、字符串日期类型。
	* @property {String}               default-str                   日期格式化后为空时，默认显示的字符串，如可设置：--
	* @property {String}               differ                        格式化为时间差的最大时间粒度，超过最大时间粒度时按format指定的格式显示，默认none，不格式化为时间差。
	*    @value                        year                          最大粒度为年，如：3年前
	*    @value                        month                         最大粒度为月，如：3月前、3天前等
	*    @value                        day                           最大粒度为天，如：3天前、3小时前等
	*    @value                        hour                          最大粒度为小时，如：3小时前、3分钟前等
	*    @value                        minute                        最大粒度为分钟，如：3分钟前、50秒前等
	*    @value                        second                        最大粒度为秒，如：45秒前、刚刚（小于30秒）
	* @property {String}               format                        时间格式，默认minute，精确到分钟，可通过配置文件配置components.time.format来修改默认值。可使用内置的格式名，也可以自行定义格式。
	*    @value                        second                        精确到秒
	*    @value                        minute                        精确到分钟
	*    @value                        hour                          精确到小时
	*    @value                        day                           精确到天
	*    @value                        month                         精确到月
	*    @value                        year                          精确到年
	*    @value                        yyyy/MM/dd HH:mm:ss           自定义格式，可自行修改
	*    @value                        yyyy年MM月dd日 HH时mm分ss秒         自定义格式，可自行修改
	* @property {Boolean|String}       show-time                     当展示为differ时，点击时间是否可切换为format格式化后的时间，默认false。如默认展示时间为：3天前，点击文字后，切换为：2021-03-19 12:28:00。
	* 
	* @property {String}               ref                            获取组件对象，通常用于调用组件内置方法。
	*/
	export default {
		name:"b-time",
		props:{
			date : [String , Date , Number] ,
			format : {
				type : String ,
				default(){
					return uni.$b.getValue("components.time.format")
				}
			},
			defaultStr:{
				type : String ,
				default : ""
			},
			differ:{
				type : String ,
				default : "none"
			},
			showTime:[String,Boolean]
		},
		data(){
			return {
				isToggle : false 
			}
		},
		computed:{
			_showTime(){
				return uni.$b.isTrue(this.showTime) ;
			},
			dateStr(){
				return uni.$b.format({
					date : this.date , 
					format : this.format ,
					differ : this.isToggle ? 'none' : this.differ 
				});
			}
		},
		methods:{
			toggle(){
				if (this._showTime) {
					this.isToggle = !this.isToggle ;
				}
			}
		}
	}
</script>
