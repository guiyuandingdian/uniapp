export default {
	data() {
		return {
			ading: false,
			adTimeount: null,
			adData: {
				adpid: "",
				bannerAdpid: "",
				remainCount: 0,
				noAdTime: 0
			},
			showAd: false,
			bannerAdDatas: [],
			bannerAdIndex: 0,
			adObjects: {}
		};
	},
	async onLoad() {
		await Promise.all([this.initAdData(), this.getUserData()]);
		await this.onAdInited();
	},
	onUnload() {
		clearTimeout(this.adTimeount);
	},
	methods: {
		async onAdInited() {},

		//初始化广告剩余播放次数、免广告截止时间、广告位id等数据
		async initAdData() {
			let adData = await uni.$b.call({
				url: "baker/api/ad/getAdData",
				loading: { show: false },
				handled: false
			});
			this.adData = adData;
			//设置广告状态
			this.setAdShow(adData.noAdTime);
		},

		createRewardAd(adpid, key, service, onClose) {
			let ad = this.adObjects[adpid];
			if (ad) {
				return ad;
			}
			let urlCallback = {};
			if (key && service) {
				urlCallback = {
					userId: uni.getStorageSync(uni.$b.getValue("tokenKey")),
					extra: {
						deviceId: this.adData.deviceId,
						key,
						service
					}
				};
			}
			ad = uni.createRewardedVideoAd({ adpid, urlCallback });
			ad.onClose(({ isEnded } = {}) => {
				if (!isEnded) {
					this.ading = false;
					uni.$b.showToast("广告未播放完毕，未获得奖励");
					return;
				}
				onClose && onClose({ isEnded });
				this.ading = false;
			});
			this.adObjects[adpid] = ad;
			return ad;
		},

		showRewardAd(adpid) {
			let ad = this.adObjects[adpid];
			ad.show()
				.then(() => {
					this.ading = true;
				})
				.catch(() => {
					ad.load()
						.then(() =>
							ad.show().then(() => {
								this.ading = true;
							})
							.catch((err) => {
								this.ading = false;
							})
						)
						.catch((err) => {
							this.ading = false;
							uni.$b.showToast("广告资源加载失败");
						});
				});
		},

		setAdShow(noAdTime) {
			let time = noAdTime - Date.now();
			this.showAd = time <= 0;
			if (this.showAd) return;
			//重置广告状态
			this.adTimeount = setTimeout(() => {
				this.showAd = true;
			}, time);
		},

		//查询用户数据，是否为vip
		async getUserData() {
			let { data } = await uni.$b.call({
				url: "baker/api/user/info",
				loading: { show: false }
			});
			this.userData = data;
		},

		preloadBannerAd() {
			let width = uni.getSystemInfoSync().windowWidth - uni.upx2px(80);
			let adpid = this.adData.bannerAdpid;
			this.preloadAdData(adpid, width);
		},

		//预加载信息流广告数据
		preloadBannerAdData(adpid, width, count = 3) {
			// #ifdef APP-PLUS
			if (!adpid) return;
			//预加载信息流广告位数据
			plus.ad.getAds(
				{ adpid, width, count },
				(res) => {
					this.bannerAdIndex = 0;
					this.bannerAdDatas = res.ads;
				},
				(err) => {
					console.log(err);
				}
			);
			// #endif

			// #ifdef MP-WEIXIN
			wx.preloadAd([{ unitId: adpid, type: "banner" }]);
			// #endif
		},

		showDebugAd() {
			uni.$b.showModal({
				content: "当前测试环境将不进行广告播放，点击按钮直接体验广告播放后的效果。",
				confirmText: "播放结束",
				cancelText: "中途退出",
				success: (e) => {
					this.onSuccess({ isEnded: e.confirm });
				}
			});
		}
	}
};
