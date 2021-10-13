export default {
	data() {
		return {
			renderTime: Date.now()
		};
	},
	methods: {
		setRenderPagesStyle(delta = 0, animate) {
			this.renderPages.forEach((item) => {
				let i = item.index;
				let translateX = this.getTranslateX(i, delta);
				let zIndex = this.getZIndex(i);
				item.style = uni.$b.getStyle({
					transform: `translateX(${translateX})`,
					transition: animate === true ? "0.2s" : "",
					"z-index": zIndex
				});
				item.class = this.getClassName(i, delta);
			});

			//触发渲染更新
			// let curIndex = 0 ;
			// this.$set(this.renderPages, curIndex, this.renderPages[curIndex]);
			//触发渲染更新
			this.renderTime = Date.now();
		},

		getClassName(i, delta) {
			//向右滑动，上一页
			if (delta > 10 && i == this.activeIndex - 1) {
				return `shadowRight ${this.themeClass}`;
			}

			//向左滑动，下一页
			if (delta < -10 && i == this.activeIndex) {
				return `shadowRight ${this.themeClass}`;
			}
			return this.themeClass;
		},

		getTranslateX(i, delta) {
			//向右滑动，上一页
			if (delta > 0 && i == this.activeIndex - 1) {
				return `calc(-100% + ${delta}px )`;
			}

			//向左滑动，下一页
			if (delta < 0 && i == this.activeIndex) {
				return `${delta}px`;
			}

			return i < this.activeIndex ? "-100%" : "0";
		},

		getZIndex(i) {
			if (i == this.activeIndex) {
				return 6;
			}
			//上一页是7，下一页是5，其他页是0
			let mix = this.activeIndex - i;
			return Math.abs(mix) == 1 ? 6 + mix : 0;
		}
	}
};
