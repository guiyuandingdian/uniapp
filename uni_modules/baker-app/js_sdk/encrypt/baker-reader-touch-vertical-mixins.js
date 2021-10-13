export default {
	data() {
		return {
			startY: 0,
			maxDelta: 0,
			touching: false ,
			winHeight : uni.getSystemInfoSync().windowHeight
		};
	},
	methods: {
		ontouchStart(e) {
			if (this.touching) {
				this.startY = -100;
				return;
			}
			this.touching = true;
			this.startY = e.changedTouches[0].clientY;
			this.maxDelta = 0;
		},

		onTouchMove(e) {
			if (this.startY == -100) {
				return;
			}
			let { delta, curY } = this.getDelta(e);
			let willMax = Math.abs(delta);
			if (willMax > this.maxDelta) {
				this.maxDelta = willMax ;
			}
			//判断方向
			let direction = delta > 0 ? "down" : "up";
			this.onSwipe({ delta, curY, direction });
		},

		async onTouchEnd(e) {
			if (this.startY == -100) {
				return;
			}
			let { delta, curY } = this.getDelta(e);

			//点击
			if (Math.abs(delta) < 8) {
				this.onClick(curY);
				this.touching = false;
				return;
			}

			//取消
			let cancel = Math.abs(delta) < this.maxDelta - 10 ;
			if (cancel) {
				this.onCancel();
				this.touching = false;
				return;
			}

			//结束当前的手势动作
			let direction = delta > 0 ? "down" : "up";
			await this.onSwipeEnd({ delta, direction });
			this.touching = false;
		},

		getDelta(e) {
			let curY = e.changedTouches[0].clientY;
			let delta = curY - this.startY;
			if (delta < -this.winHeight) {
				delta = -this.winHeight;
			}
			if (delta > this.winHeight) {
				delta = this.winHeight;
			}
			return { delta, curY };
		},
		
		onClick(){},
		onCancel(){},
		onSwipe(){},
		async onSwipeEnd(){
			
		},
	}
};
