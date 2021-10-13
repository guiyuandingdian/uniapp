import {store} from "../../../../../uni_modules/baker-app/js_sdk/baker-reward-ad" ;
export default {
	data() {
		return {
			autoPage: uni.getStorageSync("baker-auto-page") || false,
			isNight: uni.getStorageSync("baker-night") || false,
			fontSize: uni.getStorageSync("baker-font-size") || 18,
			lineHeight: uni.getStorageSync("baker-line-height") || 1.8,
			themeClass: uni.getStorageSync("baker-theme") || "yellowTheme",
			slideType: "slide",
			speed: uni.getStorageSync("baker-auto-page-speed") || 80,
			bookId: "",
			chapterNumber: "",
			data: {},
			bookInfo: {},
			initPageIndex: 0,
			pageData: { pageNumber : 1 , totalPage: 10, chapterNumber: 1 },
			inited: false,
			showTools: false,
			showDeepTools: false,
			showAutoTools: false,
			rects: [{ height: 40 }, { height: 50 }],
			allTips: [
				"点击屏幕中央可以呼出菜单",
				"阅读设置里可以开启自动翻页",
				"提醒：花呗套现刷额度是诈骗",
				"有问题可以在我的-帮助里进行反馈",
				"阅读设置里可以调整字体大小",
				"提醒：网上汇款转账需警惕"
			],
			curTipsIndex: 0
		};
	},
	computed: {
		showAd() {
			return store.getters.showAd;
		},
		_themeClass() {
			return this.isNight ? "blackTheme" : this.themeClass;
		},
		//头部书籍名称高度 + 底部广告位高度；隐藏广告位时应调用queryRect()重新计算
		holderHeight() {
			let topHeight = 45 ;
			
			// #ifdef MP-WEIXIN
			topHeight = 0 ;
			// #endif
			
			let baseHeight = topHeight + 28;
			let adHeight = 0; //底部文字广告，目前不展示，后续展示时修改为50即可
			return this.showAd ? adHeight + baseHeight : baseHeight;
		},
		//屏幕可用区域高度 - (头部书籍名称高度 + 底部广告位高度)
		totalHeight() {
			let winHeight = uni.getSystemInfoSync().windowHeight;
			return winHeight - this.holderHeight;
		},
		title() {
			let title = this.pageData.pageNumber == 1 ? this.bookInfo.name : this.pageData.title ;
			return title ? title : "" ;
		},
		percent() {
			let { pageNumber, totalPage , chapterNumber } = this.pageData;
			let currentPercent = pageNumber / totalPage;
			let chapterPercent = ( chapterNumber - 1 + currentPercent) / this.bookInfo.totalChapters;
			if (isNaN(chapterPercent)) {
				return "" ;
			}
			return (chapterPercent * 100).toFixed(2);
		},
		tips() {
			return this.allTips[this.curTipsIndex];
		}
	},
	watch:{
		// #ifdef MP-WEIXIN
		title(){
			wx.setNavigationBarTitle({
				title: this.title
			})
		}
		// #endif
	},
	onLoad({ bookId, chapterNumber, pageIndex , fontSize , lineHeight }) {
		//初始化广告统计数据
		store.dispatch("init");
		//初始化参数
		this.chapterNumber = Number(chapterNumber || 1);
		this.bookId = Number(bookId);
		this.initPageIndex = Number(pageIndex ?? 0);
		if (fontSize) {
			this.fontSize = Number(fontSize);
			uni.setStorageSync("baker-font-size" , this.fontSize);
		}
		if (lineHeight) {
			this.lineHeight = Number(lineHeight);
			uni.setStorageSync("baker-line-height", this.lineHeight);
		}
		this.setStorage = uni.$b.once(this.setStorage, 1000);
		//获取数据
		this.getBookInfo();
	},
	onReady(){
		this.baker.fullscreen(true);
		this.loadChapterData();
	},
	onUnload() {
		this.baker.fullscreen(false);
	},
	methods: {
		
		showCatalogue(){
			this.toggleTools();
			this.$refs.chapterList.toggle();
		},
		
		navToVip(){
			this.$refs.vip.checkToken();
		},
		
		toggleTools() {
			if (this.autoPage) {
				this.showAutoTools = !this.showAutoTools;
				uni.$emit("baker-auto-timer", this.showAutoTools);
				return;
			}
			if (this.showDeepTools) {
				this.showDeepTools = false;
				return;
			}
			this.showTools = !this.showTools;
			this.$nextTick(() => {
				this.baker.fullscreen(!this.showTools);
			});
		},

		exitAutoPage() {
			this.autoPage = false;
			this.showAutoTools = false;
			uni.setStorageSync("baker-auto-page", false);
		},

		async switchChapter(chapterNumber) {
			this.chapterNumber = chapterNumber ;
			this.initPageIndex = 0 ;
			await this.loadChapterData();
		},

		async getBookInfo() {
			let { data } = await uni.$b.callInCache("baker/api/book/info", {
				_id: this.bookId
			});
			this.bookInfo = data;
		},

		async loadChapterData() {
			await this.$refs.reader.init(this.bookId, this.chapterNumber , this.initPageIndex);
			this.inited = true ;
		},

		//切换章节
		async onSwitchChapter({name , chapterNumber}){
			//更改提示语
			this.changeTips();
		},

		//计算阅读区域可用高度:在底部广告位、顶部章节标题区域发生变化时重新查询
		async queryRect() {
			this.rects = await uni.$b.selectAll(".holder", this);
		},

		onPageChange(pageData) {
			//统计阅读时间
			this.$refs.readTime && this.$refs.readTime.startCounter();
			
			this.pageData = pageData;
			this.initPageIndex = pageData.pageIndex ;
			let { chapterNumber, pageIndex , totalPage, title } = this.pageData;
			this.setStorage(chapterNumber, pageIndex , title);
		},
		
		onPageInit(pageData){
			this.pageData = pageData;
		},

		async setStorage(chapterNumber, pageIndex, title) {
			//保存至数据库
			let success = await this.saveHistory(chapterNumber, pageIndex, title);
			if (success) {
				return;
			}
			//未登录或未保存成功，登录成功后将自动保存
			let bookId = this.bookId;
			let history = uni.getStorageSync("baker_history") || [];
			let curHistory = history.find((item) => item.bookId == bookId);
			if (!curHistory) {
				curHistory = { bookId };
				history.push(curHistory);
			}
			curHistory.chapterNumber = chapterNumber;
			curHistory.pageIndex = pageIndex;
			curHistory.title = title;
			curHistory.fontSize = this.fontSize;
			curHistory.lineHeight = this.lineHeight;
			uni.setStorageSync("baker_history", history);
		},

		async saveHistory(chapterNumber, pageIndex, title) {
			//尚未登录
			if (!uni.$b.isLogin()) {
				return false;
			}
			return await this.bakerApi.saveHistory({
				bookId: this.bookId,
				title,
				chapterNumber,
				pageIndex,
				fontSize: this.fontSize,
				lineHeight: this.lineHeight
			});
		},

		changeTips() {
			let index = this.curTipsIndex + 1;
			if (index > this.allTips.length - 1) {
				index = 0;
			}
			this.curTipsIndex = index;
		},

		addShelfSuccess() {
			this.bookInfo.addShelf = true;
			uni.$b.showToast("加入成功", "success");
		}
	}
};
