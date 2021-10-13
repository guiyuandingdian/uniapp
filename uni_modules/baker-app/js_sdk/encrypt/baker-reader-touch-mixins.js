export default {
	data() {
		return {
			startX: 0,
			maxDelta: 0,
			delta: 0,
			touching: false
		};
	},
	methods: {
		ontouchStart(e) {
			if (this.touching) {
				this.startX = -100;
				return;
			}
			this.touching = true;
			this.startX = e.changedTouches[0].clientX;
			this.maxDelta = 0;
		},

		onTouchMove(e) {
			if ((this.startX == -100)) {
				return;
			}
			let { delta, curX } = this.getDelta(e);
			let willMax = Math.abs(delta);
			if (willMax > this.maxDelta) {
				this.maxDelta = willMax ;
			}
			//判断方向
			let direction = delta > 0 ? "right" : "left";
			this.onSwipe({ delta, curX, direction });
		},

		async onTouchEnd(e) {
			if (this.startX == -100) {
				return;
			}
			let { delta, curX } = this.getDelta(e);

			//点击
			if (Math.abs(delta) < 8) {
				this.onClick(curX);
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
			let direction = delta > 0 ? "right" : "left";
			await this.onSwipeEnd({ delta, direction });
			this.touching = false;
		},

		getDelta(e) {
			let curX = e.changedTouches[0].clientX;
			let delta = curX - this.startX;
			if (delta < -this.winWidth) {
				delta = -this.winWidth;
			}
			if (delta > this.winWidth) {
				delta = this.winWidth;
			}
			return { delta, curX };
		}
	}
};
