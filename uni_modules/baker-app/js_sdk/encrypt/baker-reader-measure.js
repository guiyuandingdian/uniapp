import { reader } from "./baker-reader-content";
export default {
	name: "baker-reader-measure",
	props: {
		pageHeight: {
			type: [Number, String],
			default: "auto"
		},
		lineHeight: {
			type: Number,
			default: 1.8
		},
		fontSize: {
			type: Number,
			default: 16
		}
	},
	computed: {
		boxStyle() {
			return uni.$b.getStyle({
				"line-height": `${this.lineHeight}px`,
				height: `${this.pageHeight}px`
			});
		},
		titleStyle() {
			return uni.$b.getStyle({
				"font-size": `${this.fontSize * 1.5}px`,
				"line-height": `${this.lineHeight * 2}px`,
				"text-indent": `0px`
			});
		}
	},
	data() {
		return {
			data: {
				title: "",
				contents: []
			},
			show: false,
			times: 0 //失败后重试次数
		};
	},
	methods: {
		//根据章节标题、章节内容测量当前章节的实际高度、总页数
		async get({ title, content, times = 0 }) {
			//等待渲染数据
			this.times = times;
			this.show = true;
			this.data = {
				contents: reader.getContents(content),
				title
			};
			await this.next();

			//测量数据
			let { height: totalHeight } = await uni.$b.select("#chapter", this);
			if (totalHeight == 0) {
				return await this.tryAgain(title, content);
			}
			this.show = false;
			let totalPage = Math.ceil(totalHeight / this.pageHeight); //总页码
			return { totalHeight, totalPage };
		},

		next() {
			return new Promise((resolve) => {
				this.$nextTick(resolve);
			});
		},

		tryAgain(title, content) {
			return new Promise((resolve) => {
				if (this.times > 20) {
					console.error("获取章节数据失败", this.data.contents);
					this.show = false;
					resolve({ totalHeight: 0, totalPage: 1 });
					return;
				}
				setTimeout(async () => {
					console.log('this.times :>> ', this.times);
					let res = await this.get({
						title,
						content,
						times: this.times + 1
					});
					resolve(res);
				}, 100);
			});
		}
	}
};
