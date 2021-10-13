<template>
	<view style="width: 20px;">
		<view class="flex lt cv">
			<view class="bd rds3 pd1 cover father" :style="{'border-color' : _activeColor , 'background-color' : _backgroundColor}">
				<b-progress
					:percent="batteryLevel" 
					:active-color="_activeColor" 
					:background-color="_backgroundColor"
					:size="5"
					:radius="3"
					:animation="false"
					type="color"></b-progress>
				
				<view v-if="charging" class="abs flex ct white rotate90">
					<view class="scale6 bIcon-lightningFill fz12"></view>
				</view>
				
			</view>
			<view class="flex ct">
				<view class="w2 h50p rdsR3" :style="{'background-color' : _activeColor}"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"baker-battery",
		props:{
			activeColor:{
				type : String ,
				default : "#000"
			},
			backgroundColor:{
				type : String ,
				default : "#fff"
			},
			themeClass:String
		},
		data() {
			return {
				timer : null ,
				batteryState : 1 ,
				batteryLevel : 100
			};
		},
		computed: {
			charging(){
				return this.batteryState == 2 || this.batteryState == 5 ;
			},
			_activeColor() {
				if (this.charging) {
					return "#07c160";
				}
				if (this.themeClass) {
					let themeColor = {
						"greenTheme" : "#152814",
						"yellowTheme" : "#422e0d" ,
						"brownTheme" : "#aa9e9e" ,
						"darkTheme" : "#9699a2" ,
						"whiteTheme" : "#000",
						"blackTheme" : "#8C8C8C"
					}[this.themeClass] ;
					if (themeColor) return themeColor ;
				}
				return this.activeColor ;
			},
			_backgroundColor(){
				if (this.themeClass) {
					return {
						"greenTheme" : "#d1e4d0" ,
						"yellowTheme" : "#f9e6be" ,
						"brownTheme" : "#483c3c" ,
						"darkTheme" : "#3b3e47" ,
						"whiteTheme" : "#fff",
						"blackTheme" : "#242424"
					}[this.themeClass] ;
				}
				return this.backgroundColor ;
			},
		},
		created() {
			// #ifdef APP-PLUS
			this.getBettery();
			// #endif
		},
		destroyed() {
			// #ifdef APP-PLUS
			clearInterval(this.timer);
			// #endif
		},
		methods:{
			getBettery(){
				let platform = uni.getSystemInfoSync().platform ;
				if (platform === 'ios') {
					this.getBetteryIos();
				}else {
					// 获取安卓电量
					let main = plus.android.runtimeMainActivity();
					let Intent = plus.android.importClass('android.content.Intent');  
					let recevier = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {  
					    onReceive: (context, intent) => {  
					        let action = intent.getAction();  
					        if (action == Intent.ACTION_BATTERY_CHANGED) {  
					            this.batteryState = intent.getIntExtra("status", 0); //电池状态  
								this.batteryLevel = intent.getIntExtra("level", 0); //电量
					        }  
					    }  
					 });  
					let IntentFilter = plus.android.importClass('android.content.IntentFilter');  
					let filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);  
					
					main.registerReceiver(recevier, filter); 
				}
			},
			getBetteryIos(){
				// 获取ios电量
				let UIDevice = plus.ios.import("UIDevice")
				let dev = UIDevice.currentDevice()
				if (!dev.isBatteryMonitoringEnabled()) {  
				    dev.setBatteryMonitoringEnabled(true) 
				}
				this.timer = setInterval(() => {
					this.batteryState = dev.batteryState() ;
					this.batteryLevel = dev.batteryLevel() * 100
				}, 1000)
			}
		}
	}
</script>