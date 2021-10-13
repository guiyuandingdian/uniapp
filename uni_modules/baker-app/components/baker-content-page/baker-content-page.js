import contentMixins from "../baker-content/baker-content-mixins.js";
import { store } from "../../js_sdk/baker-reward-ad.js";
export default {
	mixins: [contentMixins],
	props: {
		totalHeight: {
			type: Number,
			default: 577
		},
		fontSize: {
			type: Number,
			default: 14
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
		}
	},
	data() {
		return {
			curChapter : {},
			preChapter:{},
			nextChapter:{},
			
			locked: true,
			adIndex: [],
			chapters: [],
			currentIndex: 0,
			duration: 0,
			timeout: null,
			pageCount: 0
		};
	},
	computed: {
		showAd() {
			return store.getters.showAd;
		},
		swiperStyle() {
			return uni.$b.getStyle({
				height: `${this.totalHeight}px`,
				"font-size": `${this.fontSize}px`,
				"line-height": `${this._lineHeight}px`,
				"text-indent": `${this.fontSize * 2}px`
			});
		},
		titleStyle() {
			return uni.$b.getStyle({
				"font-size": `${this.fontSize * 1.5}px`,
				"line-height": `${this._lineHeight * 2}px`,
				"text-indent": `0px`
			});
		},
		//具体行高
		_lineHeight() {
			return parseInt(this.lineHeight * this.fontSize);
		},
		//单页高度：行数 * 行高
		pageHeight() {
			let maxLineCount = parseInt(this.totalHeight / this._lineHeight);
			return maxLineCount * this._lineHeight;
		},
		pageHeightPx() {
			return `${this.pageHeight}px`;
		},

		list() {
			return this.chapters.map((item) => {
				let totalPage = item.totalHeight == -1 ? 1 : Math.ceil(item.totalHeight / this.pageHeight);
				item.contents = this.getContents(item.content);

				//将标题作为第一段落追加
				item.contents.unshift(item.title);

				//每页数据
				let pages = Array.from({ length: totalPage }).map((_, i) => {
					return {
						...item,
						pageIndex: i,
						type : "content",
						sid: i == 0 ? `s_${item._id}` : `s_${item._id}_${i + 1}`
					};
				});

				let initValue = {
					startIndex: 0, //下页起始段落
					offset: 0 //下页起始段落累计偏移值
				};
				pages.reduce((previous, current, index) => {
					//标识是否为章节第一页，区分广告页
					current.isFirstPage = index == 0;

					//横跨两页的段落，在上一页已使用的高度，本页以该段落为起始段落时，应将已使用的高度向上偏移
					current.offset = previous.offset;

					let { startIndex, offset } = previous;

					//计算本屏的高度：1.小于pageHeight 2.等于pageHeight 3.大于pageHeight
					let contentHeights = current.contentHeights;
					let total = 0 - offset;
					let endIndex = startIndex; //当前页结束段落
					for (let i = startIndex; i < contentHeights.length; i++) {
						//当前段落（含标题段落）的高度
						let height = contentHeights[i];
						let gutter = this._lineHeight;
						let curTotalHeight = height + gutter;

						total += curTotalHeight;

						if (total < this.pageHeight) {
							//第一段落未跨屏，将offset重置为0，不再累加
							if (i == startIndex) {
								previous.offset = 0;
							}
							continue;
						}

						//找到结束段落
						endIndex = i;

						//正好铺满该页，下一页起始段落为i+1
						if (total == this.pageHeight) {
							previous.startIndex = i + 1;
							previous.offset = 0;
							break;
						}

						//该段落的段落间隙在下一页，下一页的起始段落为i+1
						if (total - gutter == this.pageHeight) {
							previous.startIndex = i + 1;
							previous.offset = 0;
							break;
						}

						//3.该段落横跨两页
						let remainHeight = total - this.pageHeight; //该段落剩余未使用的高度
						let usedHeight = curTotalHeight - offset - remainHeight; //当前页已使用的高度
						previous.offset += usedHeight; //累加已使用的高度
						previous.startIndex = i; //下一页依然以当前段落为起始段落
						break;
					}

					//记录当前页的段落
					let notComputedFirstPage = current.pageIndex == 0 && current.totalHeight == -1;
					current.paragraphs = notComputedFirstPage
						? [...current.contents]
						: current.contents.filter((_, i) => i >= startIndex && i <= endIndex);

					return previous;
				}, initValue);

				pages = pages.filter((item) => item.paragraphs.length > 0);

				return {
					...item,
					totalPage: pages.length,
					pages
				};
			});
		},
		pageData() {
			return this.list
				.reduce((previous, current) => {
					previous.push(...current.pages);
					return previous;
				}, [])
				.map((item, index) => {
					return ["bookId", "chapterNumber", "paragraphs", "offset", "pageIndex", "sid", "title","type"].reduce(
						(data, key) => {
							data[key] = item[key];
							return data;
						},
						{}
					);
				});
		},
		pageAdData() {
			if (this.adIndex.length == 0) {
				return this.pageData;
			}
			let list = [];
			let start = 0;
			let indexs = [...new Set(this.adIndex)].sort();
			indexs.forEach((adIndex) => {
				if (adIndex > this.pageData.length - 1 ) {
					return;
				}
				let curList = this.pageData.slice(start, adIndex);
				if (curList.length == 0) {
					return;
				}
				list.push(...curList);
				let { sid , chapterNumber , pageIndex , title , bookId } = curList[curList.length - 1];
				list.push({
					type: "ad",
					chapterNumber,
					pageIndex ,
					title,
					bookId,
					sid : sid + "_ad"
				})
				start = adIndex;
			});
			let remainList = this.pageData.slice(start);
			list.push(...remainList);
			console.log('list :>> ', list);
			return list ;
		},
		curPage() {
			return this.pageAdData[this.currentIndex] || {};
		},
		isAdPage() {
			return this.curPage.type == "ad";
		},
		curChapterNumber() {
			return this.curPage.chapterNumber;
		},
		curChapter() {
			let chapter = this.list.find((item) => item.chapterNumber == this.curChapterNumber);
			return chapter || {};
		},
		cuChapterIndex() {
			return this.list.findIndex((item) => item.chapterNumber == this.curChapterNumber);
		}
	},
	watch: {
		fontSize() {
			console.log("fontSize resetPages....=====>.....resetPages");
			this.resetPages();
		},
		lineHeight() {
			console.log("lineHeight resetPages....=====>.....resetPages");
			this.resetPages();
		},
		totalHeight() {
			console.log("totalHeight resetPages....=====>.....resetPages");
			this.resetPages();
		}
	},
	created() {
		this.resetPages = uni.$b.once(this.resetPages, 300);
		this._onTransition = uni.$b.once(this._onTransition, 20);
	},
	methods: {

		onAdReward(){
			this.adIndex = this.adIndex.filter((curIndex) => curIndex < this.currentIndex );
			this.$nextTick(()=>{
				this._switchPage(this.currentIndex + 1);
			})
		},

		//重新计算章节高度
		async resetPages() {
			if (this.locked) {
				return;
			}
			console.log("resetPages....=====>.....resetPages");
			let { chapterNumber, pageIndex } = this.curPage;
			let curChapter = this.chapters.find((item) => item.chapterNumber == chapterNumber);
			if (!curChapter) {
				return;
			}
			let siblings = this.chapters.filter((item) => Math.abs(item.chapterNumber - chapterNumber) == 1);
			this.chapters = [];
			this.adIndex = [];
			this.pageCount = 0;
			this.$nextTick(async () => {
				siblings.forEach(async (chapterData) => {
					await this.addData(chapterData, true);
				});
				await this.addData(curChapter, false, pageIndex);
			});
		},

		addData(chapterData, isPreload, initPageIndex = 0) {
			console.log("addData chapterData: ",chapterData);
			//当前章节、页码
			let { chapterNumber, pageIndex } = this.curPage;
			if (!isPreload) {
				chapterNumber = chapterData.chapterNumber;
				pageIndex = initPageIndex;
			}

			return new Promise((resolve, reject) => {
				//1. 加入数组并去重,计算当前章节的总高度
				let curIndex = this.chapters.findIndex((item) => item.chapterNumber == chapterData.chapterNumber);
				if (curIndex > -1) {
					this.chapters.splice(curIndex, 1);
				}
				this.chapters.push({
					...chapterData,
					totalHeight: -1,
					contentHeights: []
				});
				let numbers = this.chapters.map((item) => item.chapterNumber);
				numbers = [...new Set(numbers)].sort();
				this.chapters = numbers.map((number, index) => {
					return this.chapters.find((cur) => cur.chapterNumber === number);
				});

				//2. 总高度 / pageHeight = 总页数，由此可计算当前章节的页数数据
				this.$nextTick(async () => {
					let sid = `#s_${chapterData._id}`;
					let [{ height }, rects] = await Promise.all([
						uni.$b.select(`${sid}`, this),
						uni.$b.selectAll(`${sid} > .paragraph`, this)
					]);
					let curChapter = this.chapters.find((item) => item.chapterNumber == chapterData.chapterNumber);
					this.$set(curChapter, "totalHeight", height);
					this.$set(
						curChapter,
						"contentHeights",
						rects.map((item) => item.height)
					);
					
					if (isPreload) {
						resolve();
						return ;
					}

					//切换至当前章节第一页
					this.duration = 0;
					this.currentIndex = this.pageAdData.findIndex(
						(item) => item.chapterNumber == chapterNumber && item.pageIndex == pageIndex && item.type == "content"
					);
					this.$nextTick(() => {
						this.duration = 200;
						this._changePage(this.currentIndex);
						resolve();
					});
				});
			});
		},

		_switchPage(current) {
			if (current > this.pageAdData.length - 1) {
				uni.$b.showToast("已是最后一章");
				return;
			}
			if (current < 0) {
				return;
			}
			this._onChangePage({ detail: { current } });
		},

		_onChangePage(e) {
			let current = e.detail.current;
			if (current == this.currentIndex) {
				return;
			}
			//统计页码数量变动
			this.pageCount += current > this.currentIndex ? 1 : -1;
			let adPages = this.adPages < 5 ? 5 : this.adPages ;
			if (this.pageCount == adPages - 2 && this.showAd) {
				//加入广告
				let adIndex = current + 2;
				this.adIndex.push(adIndex);
			} else if (this.pageCount == adPages) {
				this.pageCount = 0;
			}

			//目标页数据
			this._changePage(current);

			//切换至新章节
			this._changeChapter(current);

			this.currentIndex = current;
		},

		_changePage(current) {
			let curPage = this.pageAdData[current];
			if (!curPage) {
				console.error("curPage is undefined !!!!!!!!!!")
				return;
			}
			if (curPage.type == "ad") {
				this.$emit("showAd");
				return ;
			}
			let { chapterNumber, pageIndex, title } = curPage;
			let targetChapter = this.list.find((item) => item.chapterNumber == chapterNumber);
			let pageNumber = pageIndex + 1;
			let totalPage = targetChapter.totalPage;
			this.$emit("switchPage", { chapterNumber, pageNumber, totalPage, title });
		},

		_changeChapter(current) {
			let { chapterNumber, type } = this.pageAdData[current];
			if (type != "content") {
				return;
			}
			let chapterChanged = chapterNumber != this.curChapterNumber;
			if (chapterChanged) {
				let index = this.chapters.findIndex((item) => item.chapterNumber == chapterNumber);
				let isLastChapter = index == this.chapters.length - 1;
				let isFirstChapter = index == 0;
				//目标章节数据
				let data = this.chapters.find((item) => item.chapterNumber == chapterNumber);
				this.$emit("change", { data, isLastChapter, isFirstChapter });
			}
		},

		_onTransition(e) {
			if (e.detail.dx == 0 && this.currentIndex == this.pageAdData.length - 1) {
				uni.$b.showToast("已是最后一章");
			}
		}
	}
};
