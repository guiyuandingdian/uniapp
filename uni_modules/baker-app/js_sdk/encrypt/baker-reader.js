import { store } from "../baker-reward-ad.js";
import touchMixins from "./baker-reader-touch-mixins.js";
import pageStyleMixins from "./baker-reader-pagestyle-mixins.js";
export default {
	name: "baker-reader",
	mixins: [touchMixins, pageStyleMixins],
	props: {
		themeClass: String,
		totalHeight: {
			type: Number,
			default: 577
		},
		fontSize: {
			type: Number,
			default: 16
		},
		lineHeight: {
			//行高：字号的倍数
			type: Number,
			default: 1.8
		},
		mode: {
			//slide 、 overlying
			type: String,
			default: "slide"
		},
		//自动翻页
		auto: Boolean,
		adPages: {
			type: Number,
			default: 7
		},
		totalChapters: {
			type: Number,
			default: 1
		},
		value: {
			type: Number,
			default: 0
		}
	},
	computed: {
		showAd() {
			return store.getters.showAd;
		},
		_lineHeight() {
			return parseInt(this.lineHeight * this.fontSize);
		},
		//单页高度：行数 * 行高
		pageHeight() {
			let maxLineCount = parseInt(this.totalHeight / this._lineHeight);
			return maxLineCount * this._lineHeight;
		},
		baseStyle() {
			return uni.$b.getStyle({
				height: `${this.totalHeight + 45 + 28}px`,
				"font-size": `${this.fontSize}px`,
				"line-height": `${this._lineHeight}px`,
				"text-indent": `${this.fontSize * 2}px`
			});
		}
	},
	data() {
		return {
			bookId: "",
			oldPages: [], //未处理之前的分页数据，不包含广告数据
			pages: [],
			nextCachePages: [], //用户操作期间临时缓存的预加载数据
			prevCachePages: [], //用户操作期间临时缓存的预加载数据
			renderPages: [],
			activeIndex: 0, //当前选中的pages下标
			activeKey: "", //当前选中的pages的唯一标识，重新定位下标时使用
			pageIndex: 0,
			chapterNumber: 1,
			winWidth: uni.getSystemInfoSync().windowWidth,
			inited : false 
		};
	},
	watch: {
		showAd(n, o) {
			//开启底部广告位后，可取消该操作，直接监听totalHeight
			this.onAdStatusChange();
		},
		themeClass() {
			this.setRenderPagesStyle(0, animate);
		},
		fontSize() {
			this.onSizeChange();
		},
		lineHeight() {
			this.onSizeChange();
		},
		totalHeight() {
			this.onSizeChange();
		}
	},
	created() {
		this.switchPageOnce = uni.$b.once(this.switchPage, 200);
		//频繁切换字号、行高
		this.onSizeChange = uni.$b.once(this.onSizeChange, 400);
		//禁止点击频繁切换页码
		this.onClick = uni.$b.once(this.onClick, 400, true);
	},
	methods: {
		/**
		 * 1.查询章节数据
		 * 2.查询章节高度、总页码
		 * 3.返回页码列表数据
		 */
		async getChapterData(chapterNumber) {
			//获取章节数据
			let data = await this.bakerApi.getChapterInfo(this.bookId, chapterNumber);
			//返回页码数据列表
			return this.queryChapterData(data);
		},

		/**
		 * @params data 章节数据
		 * 1.查询章节高度、总页码
		 * 2.返回页码列表数据
		 */
		async queryChapterData(data, index = 0) {
			//计算章节高度、页数数据
			let { totalHeight, totalPage } = await this.$refs.measure[index].get(data);
			//返回页码数据列表
			return Array.from({ length: totalPage }).map((_, pageIndex) => ({
				totalHeight,
				totalPage,
				pageIndex,
				pageNumber: pageIndex + 1,
				offset: `${-pageIndex * this.pageHeight}px`,
				key: `${data.chapterNumber}_${pageIndex}`, //唯一标识
				isAd: false,
				...data
			}));
		},

		/**
		 * 初始化章节数据：
		 * 1. 记录当前章节、页码数据
		 * 2. 获取最近2~3章数据
		 * 3. 对3章数据进行加工处理：筛选3章、排序、记录原始数据、插入广告数据、插入下标（供renderPages使用）
		 * 4. 定位到当前章节、当前页码
		 * 5. 根据activeIndex渲染数据，无手势动作，不需要动画
		 * @param {*} bookId 书籍ID
		 * @param {*} chapterNumber 章节序号
		 */
		async init(bookId, chapterNumber = 1, pageIndex = 0) {
			//记录当前章节、页码数据
			this.bookId = bookId;
			this.chapterNumber = chapterNumber;
			this.pageIndex = pageIndex;
			//获取最近章节数据
			let { list } = await this.bakerApi.preloadChapter(bookId, chapterNumber);
			//测量章节尺寸数据，进而对数据进行分页加工处理，完成分页渲染
			await this.measureListData(list);
			//触发初始化完毕事件
			let pageData = this.pages[this.activeIndex];
			this.inited = true;
			this.$emit("inited", pageData);
		},

		async onSizeChange() {
			//拿出当前章节的数据
			let list = this.oldPages.reduce((list, cur) => {
				let { _id, chapterNumber, bookId, content, title, words } = cur;
				if (!!chapterNumber && !list.some((item) => item.chapterNumber == chapterNumber)) {
					list.push({ _id, chapterNumber, bookId, content, title, words });
				}
				return list;
			}, []);
			//恢复定位到第一页
			this.pageIndex = 0;
			//测量章节尺寸数据，进而对数据进行分页加工处理，完成分页渲染
			await this.measureListData(list);
		},

		async measureListData(list) {
			//获取当前章节的尺寸数据
			let promises = list.map((data, index) => this.queryChapterData(data, index));
			let chapterDatas = await Promise.all(promises);
			let chapters = chapterDatas.reduce((list, cur) => {
				list.push(...cur);
				return list;
			}, []);
			//对3章数据进行加工处理：筛选3章、排序、记录原始数据、插入广告数据、插入下标（供renderPages使用）
			this.setPages(chapters);
			//定位到当前章节、当前页码，渲染数据赋值
			let activeIndex = this.getCurrentActiveIndex();
			//根据activeIndex渲染数据，无手势动作，不需要动画
			this.changeRenderPageData(activeIndex, false);
		},

		getCurrentActiveIndex() {
			let activeIndex = this.pages.findIndex(
				(c) => c.chapterNumber == this.chapterNumber && c.pageIndex == this.pageIndex
			);
			if (activeIndex != -1) {
				return activeIndex;
			}
			this.pageIndex = 0;
			return this.pages.findIndex((c) => c.chapterNumber == this.chapterNumber && c.pageIndex == this.pageIndex);
		},

		setPages(list) {
			//对章节数据进行去重
			let pages = this.combine(list);

			//筛选出最新3章
			pages = pages.filter(
				(item) => item.chapterNumber >= this.chapterNumber - 1 && item.chapterNumber <= this.chapterNumber + 1
			);

			//根据章节、页码排序
			pages.sort(this.sort);
			//记录未插入广告的原始数据
			this.oldPages = [...pages];
			//插入广告数据
			pages = this.putAdData(pages);
			//赋值
			this.pages = pages.map((item, index) => ({ ...item, index }));
		},

		combine(list) {
			let keys = list.map((c) => c.key);
			let pKeys = uni.$b.combine(keys);
			return pKeys.map(key => list.find(item => item.key == key));
		},

		/**
		 * 切换至指定页码：
		 * 1. 更新activeIndex
		 * 2. 根据activeIndex更新activeKey
		 * 3. 根据activeIndex更新renderPages
		 * 4. 计算renderPages每一条数据对应的偏移值、层级、样式类数据
		 * 5. 完成手势动作、点击动作时需要动画，数据重置时不需要动画
		 * @param {*} activeIndex 目标页码在this.pages对应的下标
		 * @param {*} animate 切换时是否启用动画
		 */
		changeRenderPageData(activeIndex, animate) {
			//定位到指定章节、指定页
			this.activeIndex = activeIndex;
			this.activeKey = this.pages[activeIndex].key;
			//渲染赋值
			this.renderPages = this.pages.filter((_, i) => i >= this.activeIndex - 2 && i <= this.activeIndex + 2);
			//计算偏移值、层级
			this.setRenderPagesStyle(0, animate);
		},

		sort(a, b) {
			if (a.chapterNumber == b.chapterNumber) {
				return a.pageIndex - b.pageIndex;
			}
			return a.chapterNumber - b.chapterNumber;
		},

		putAdData(pages) {
			//判断：如果展示信息流广告
			if (!this.showAd) {
				return pages;
			}
			//查询本地广告页码标记
			let adPages = this.adPages ;
			let list = [];
			let count = 0;
			if (this.activeKey) {
				//查找所有插入广告的章节数据
				let adChapterKeys = this.pages.filter((c) => c.isAd).map((c) => c.chapterKey);
				//找到第一个被插入广告数据的章节
				let firstPageIndex = pages.findIndex((c) => adChapterKeys.includes(c.key));
				adPages = (firstPageIndex + 1) % this.adPages;
			}

			if (adPages == 0 ) {
				adPages = this.adPages ;
			}

			for (let i = 0; i < pages.length; i++) {
				count++;
				let data = pages[i];
				list.push(data);
				if (count % adPages == 0) {
					adPages = this.adPages;
					count = 0;
					list.push({
						chapterKey: `${data.chapterNumber}_${data.pageIndex}`,
						key: `${data.chapterNumber}_${data.pageIndex}_ad`, //唯一标识
						isAd: true
					});
				}
			}
			return list;
		},

		//滑动时触发
		onSwipe({ delta, direction }) {
			if (this.isEndPage(direction)) {
				return;
			}
			this.setRenderPagesStyle(delta);
		},

		//滑动距离小，恢复
		onCancel() {
			this.setRenderPagesStyle(0, true);
		},

		onClick(curX) {
			let isAdPage = this.activeKey && this.activeKey.indexOf("_ad") > -1;
			// #ifdef H5
			if (isAdPage) {
				return;
			}
			// #endif
			//点击左侧
			if (curX < this.winWidth / 3) {
				this.switchPrevPage();
				return;
			}
			//点击右侧
			if (curX > (this.winWidth / 3) * 2) {
				this.switchNextPage();
				return;
			}
			//广告页禁止点击中央
			if (isAdPage) {
				return;
			}
			//点击中央
			this.$emit("tapCenter");
		},

		switchNextPage() {
			this.onSwipeEnd({ direction: "left" });
		},

		switchPrevPage() {
			this.onSwipeEnd({ direction: "right" });
		},

		//手势滑动结束
		async onSwipeEnd({ direction }) {
			if (this.isEndPage(direction)) {
				return;
			}
			let isNext = direction == "left";
			//结束手势动作，完成剩余的页面滑动动画，动画持续时间为200ms
			let delta = isNext ? -this.winWidth : this.winWidth;
			this.setRenderPagesStyle(delta, true);
			//动画结束后，切换页码，200ms/次
			let activeIndex = isNext ? this.activeIndex + 1 : this.activeIndex - 1;
			await this.switchPageOnce(activeIndex, isNext);
		},

		isEndPage(direction) {
			//到第一页
			let isFirst = direction == "right" && this.chapterNumber == 1 && this.pageIndex == 0;
			if (isFirst) {
				uni.$b.showToast("已经是第一页");
				return true ;
			}

			//到最后一页
			let isLastPage = this.chapterNumber == this.totalChapters && this.activeIndex == this.pages.length - 1;
			let isLast = direction == "left" && isLastPage;
			if (isLast) {
				uni.$b.showToast("已经是最后一页");
				return true;
			}
		},

		//切换页码（章节、广告）
		async switchPage(activeIndex, isNext) {
			//选中页
			let pageData = this.pages[activeIndex];

			//已切换至最后一页，无法再继续切换
			if (!pageData) {
				this.clearCacheData(isNext);
				return;
			}

			//改变activeIndex，更新渲染数据、样式
			this.clearCacheDataByActiveIndex(activeIndex, isNext);

			//切换至广告页
			if (pageData.isAd) {
				return;
			}

			//更新页码数据和章节数据
			let { chapterNumber, pageIndex } = pageData;
			let pageChange = pageIndex != this.pageIndex;
			let chapterChange = chapterNumber != this.chapterNumber;
			//同步更新章节、页码数据
			this.chapterNumber = chapterNumber;
			this.pageIndex = pageIndex;
			//页码发生变化
			if (pageChange) {
				this.onChapterPageChange(pageData, isNext);
			}
			//章节发生变化
			if (chapterChange) {
				await this.onChapterChange(pageData, isNext);
			}
		},

		//切换页码时，处理本地的预加载的章节数据
		clearCacheDataByActiveIndex(activeIndex, isNext) {
			let cachePages = this[`${isNext ? "next" : "prev"}CachePages`];
			if (cachePages.length == 0) {
				this.changeRenderPageData(activeIndex);
				return;
			}
			this.activeKey = this.pages[activeIndex].key;
			this.clearCacheData(isNext);
		},

		//处理本地的预加载的章节数据
		clearCacheData(isNext) {
			let cachePages = this[`${isNext ? "next" : "prev"}CachePages`];
			if (cachePages.length > 0) {
				this.setPagesByActiveKey([...this.oldPages, ...cachePages]);
				this[`${isNext ? "next" : "prev"}CachePages`] = [];
			}
		},

		setPagesByActiveKey(list) {
			//渲染数据赋值
			this.setPages(list);
			//渲染数据赋值
			let activeIndex = this.pages.findIndex((c) => c.key == this.activeKey);
			this.changeRenderPageData(activeIndex);
		},

		//切换章节页码
		onChapterPageChange(pageData, isNext) {
			//设置翻过的页码数量
			let pageCount = uni.getStorageSync("baker_pages_count") || 0;
			uni.setStorageSync("baker_pages_count", isNext ? pageCount + 1 : pageCount - 1);

			uni.$emit("bakerSwitchChapterPage");
			this.$emit("switchPage", { ...pageData, isNext });
			
			// let { chapterNumber, pageIndex } = pageData;
			// uni.$b.showToast(`第${chapterNumber}章第${pageIndex + 1}页`);
		},

		//切换章节
		async onChapterChange(pageData, isNext) {
			//预加载新章节
			let { chapterNumber } = pageData;
			let loadNumber = isNext ? chapterNumber + 1 : chapterNumber - 1;
			if (loadNumber < 1 || loadNumber > this.totalChapters) {
				return;
			}
			//获取预加载章节数据
			let curPages = await this.getChapterData(loadNumber);
			//渲染数据
			this[`${isNext ? "next" : "prev"}CachePages`] = curPages;

			this.$emit("switchChapter", { ...pageData, isNext });
		},

		onAdStatusChange() {
			if (!this.inited) {
				return;
			}
			//如果当前是广告页，隐藏广告后，将activeKey重置为广告对应的章节页
			if (this.activeKey && this.activeKey.indexOf("_ad") > -1) {
				let adData = this.pages.find((c) => c.key == this.activeKey);
				this.activeKey = adData.chapterKey;
			}
			this.setPagesByActiveKey(this.oldPages);
		}
	}
};
