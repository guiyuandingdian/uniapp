<template>
	<view class="almost-lottery" :style="lotteryStyle">
		
		<view class="almost-lottery__wrap" :style="{width: canvasWidth + canvasMarginTotal + 'px', height: canvasHeight + canvasMarginTotal + 'px'}">
			
			<!-- 画布 -->
			<canvas :class="className" :id="canvasId" :canvas-id="canvasId" 
				:width="canvasWidth" :height="canvasHeight" :style="canvasStyle" />
			
			<!-- 缓存的画布图片 -->
			<image v-if="lotteryImg" class="canvas-img" :src="lotteryImg" :class="{'willEnd' : willEnd}" :style="lotteryImgStyle"></image>
	   
			<!-- 开始按钮 -->
			<view class="almost-lottery__action" :style="btnStyle" @tap="handleActionStart"></view>
	   
			<!-- 为了兼容 app 端 ctx.measureText 所需的标签 -->
			<text class="almost-lottery__measureText">{{ measureText }}</text>
			
		</view>

		<image :src="pointer" mode="widthFix" class="pointer"></image>

	</view>
</template>

<script>
	import {
		getStore,
		setStore,
		clearStore,
		downloadFile,
		pathToBase64
	} from './almost-utils.js'
	export default {
		name: 'AlmostLottery',
		props: {
			disabled : Boolean ,
			pointer: String,
			bgSrc:String,
			btnSrc:String,
			// canvas 宽度
			canvasWidth: {
				type: Number,
				default(){
					return uni.upx2px(275*2) ;
				}
			},
			// canvas 高度
			canvasHeight: {
				type: Number,
				default(){
					return uni.upx2px(275*2) ;
				}
			},
			// 奖品列表
			prizeList: {
				type: Array,
				required: true,
				validator: (value) => {
					return value.length > 1
				}
			},
			// 中奖奖品在列表中的下标
			prizeIndex: {
				type: Number,
				required: true
			},
			// 奖品区块对应背景颜色
			colors: {
				type: Array,
				default: () => ['#F8DEF8','#FEF3FC']
			},
			// 描边颜色
			strokeColor: {
				type: String,
				default: 'transparent'
			},
			// 旋转动画时间 单位s
			duration: {
				type: Number,
				default: 8
			},
			// 旋转的圈数
			ringCount: {
				type: Number,
				default: 8
			},
			// 指针位置
			pointerPosition: {
				type: String,
				default: 'edge',
				validator: (value) => {
					return value === 'edge' || value === 'middle'
				}
			},
			// 字体颜色
			strFontColor: {
				type: String,
				default: '#000'
			},
			// 文字的大小
			strFontSize: {
				type: Number,
				default: 12
			},
			// 奖品文字距离边缘的距离
			strMarginOutside: {
				type: Number,
				default: 15
			},
			// 奖品文字多行情况下的行高
			strLineHeight: {
				type: Number,
				default: 16
			},
			// 奖品名称所对应的 key 值
			strKey: {
				type: String,
				default: 'name'
			},
			// 奖品文字总长度限制
			strMaxLen: {
				type: Number,
				default: 12
			},
			// 奖品文字多行情况下第一行文字长度
			strLineLen: {
				type: Number,
				default: 6
			},
			// 奖品图片的宽
			imageWidth: {
				type: Number,
				default(){
					return uni.upx2px(40*2) ;
				}
			},
			// 奖品图片的高
			imageHeight: {
				type: Number,
				default(){
					return uni.upx2px(40*2) ;
				}
			},
			// 转盘绘制成功的提示
			successMsg: {
				type: String,
				default: '奖品准备就绪，快来参与抽奖吧'
			},
			// 转盘绘制失败的提示
			failMsg: {
				type: String,
				default: '奖品仍在准备中，请稍后再来...'
			},
			// 是否开启画板的缓存
			canvasCached: {
				type: Boolean,
				default: true
			},
			// 内圈与外圈的间距
			canvasMargin: {
				type: Number,
				default: 5
			}
		},
		data() {
			return {
				// 画板className
				className: 'almost-lottery__canvas',
				// 画板标识
				canvasId: 'almostLotteryCanvas',
				// 画板导出的图片
				lotteryImg: '',
				// 旋转到奖品目标需要的角度
				targetAngle: 0,
				// 旋转动画时间 单位 s
				transitionDuration: 0,
				// 是否正在旋转
				isRotate: false,
				// 当前停留在那个奖品的序号
				stayIndex: 0,
				// 当前中奖奖品的序号
				targetIndex: 0,
				// 是否存在可用的缓存转盘图
				isCacheImg: false,
				oldLotteryImg: '',
				// 解决 app 不支持 measureText 的问题
				// app 已在 2.9.3 的版本中提供了对 measureText 的支持，将在后续版本逐渐稳定后移除相关兼容代码
				measureText: '' ,
				willEnd : false ,
				endTimer : null ,
				resetPrizeTimer : null
			}
		},
		computed: {
			lotteryStyle(){
				let margin = uni.upx2px(130) ;
				return uni.$b.getStyle({ 
					'width': (this.canvasWidth + margin) + 'px', 
					'height': (this.canvasHeight + margin) + 'px',
					'background-image': `url(${this.bgSrc})`
				});
			},
			btnStyle(){
				return uni.$b.getStyle({
					 width: this.actionSize + 'px',
					 height: this.actionSize + 'px',
					 'background-image': `url(${this.btnSrc})`
				   }) ;
			},
			lotteryImgStyle(){
				return uni.$b.getStyle({
					 "width": parseInt(this.canvasWidth + this.canvasMarginTotal) + 'px',
					 "height": parseInt(this.canvasHeight + this.canvasMarginTotal) + 'px',
					 "transform": `rotate(${this.canvasAngle + this.targetAngle}deg)`,
					 "transition-duration": `${this.transitionDuration}s`
				   });
			},
			canvasStyle(){
				return uni.$b.getStyle({
					 width: this.canvasWidth + 'px',
					 height: this.canvasHeight + 'px'
				});
			},
			// 根据奖品列表计算 canvas 旋转角度
			canvasAngle() {
				let prizeCount = this.prizeList.length
				let prizeClip = 360 / prizeCount
				let result = 0

				let diffNum = 90 / prizeClip
				if (this.pointerPosition === 'edge') {
					result = -(prizeClip * diffNum)
				} else {
					result = -(prizeClip * diffNum + prizeClip / 2)
				}
				return result
			},
			// 外圆的半径
			outsideRadius() {
				return this.canvasWidth / 2
			},
			// 内圆的半径
			insideRadius() {
				return 20
			},
			// 文字距离边缘的距离
			textRadius() {
				return this.strMarginOutside || (this.strFontSize / 2)
			},
			// 根据画板的宽度计算奖品文字与中心点的距离
			textDistance() {
				const textZeroY = Math.round(this.outsideRadius - (this.insideRadius / 2))
				return textZeroY - this.textRadius
			},
			// 设备像素密度
			systemInfo() {
				return uni.getSystemInfoSync()
			},
			// 内圈与外圈的距离
			canvasMarginTotal() {
				let diffNum = 5
				let margin = this.canvasMargin * 2
				if (this.canvasWidth > 240) {
					return -(this.canvasWidth / 240 * 2) - margin
				} else if (this.canvasWidth < 240) {
					return diffNum + (this.canvasWidth / 240 * 2) - margin
				} else {
					return diffNum - margin
				}
			},
			// 抽奖按钮的宽高
			actionSize() {
				return this.canvasWidth / 2.4
			}
		},
		watch: {
			// 监听获奖序号的变动
			prizeIndex(newVal, oldVal) {
				if (newVal > -1) {
					this.targetIndex = newVal ;
					this.willEnd = true ;
					this.computeAngle();
					this.startTimer();
				} else {
					console.info('旋转结束，prizeIndex 已重置')
					this.startTime = 0 ;
				}
			}
		},
		methods: {
			// 开始旋转
			start() {
				if (this.isRotate) return
				this.isRotate = true ;
				this.willEnd = false ;
				
				this.computeAngle();
				this.startTimer();
			},
			
			startTimer(){
				clearTimeout(this.endTimer);
				clearTimeout(this.resetPrizeTimer);
				
				// 计算转盘结束的时间，预加一些延迟确保转盘停止后触发结束事件
				let endTime = this.transitionDuration * 1000 + 700 ;
				this.endTimer = setTimeout(() => {
					this.isRotate = false
					this.$emit('draw-end' , this.prizeList[this.prizeIndex]);
				}, endTime)
				
				this.resetPrizeTimer = setTimeout(() => {
					// 每次抽奖结束后都要重置父级附件的 prizeIndex
					this.$emit('reset-index')
				}, endTime + 50)
			},
			
			computeAngle(){
				// 奖品总数
				let prizeCount = this.prizeList.length
				let baseAngle = 360 / prizeCount
				let angles = 0
				if (this.targetAngle === 0) {
					// 第一次旋转
					// 因为第一个奖品是从0°开始的，即水平向右方向
					// 第一次旋转角度 = 270度 - (停留的序号-目标序号) * 每个奖品区间角度 - 每个奖品区间角度的一半 - canvas自身旋转的度数
					angles = (270 - (this.targetIndex - this.stayIndex) * baseAngle - baseAngle / 2) - this.canvasAngle
				} else {
					// 后续旋转
					// 后续继续旋转 就只需要计算停留的位置与目标位置的角度
					angles = -(this.targetIndex - this.stayIndex) * baseAngle
				}
				// 更新目前序号
				this.stayIndex = this.targetIndex
				// 转 8 圈，圈数越多，转的越快
				this.targetAngle += angles + 360 * this.ringCount
			},
			
			// 点击 开始抽奖 按钮
			handleActionStart() {
				if (this.isRotate) return ;
				this.$emit('draw-start');
			},
			// 渲染转盘
			async onCreateCanvas() {
				// 获取 canvas 画布
				const canvasId = this.canvasId
				const ctx = uni.createCanvasContext(canvasId, this)
				

				// canvas 的宽高
				let canvasW = this.canvasWidth
				let canvasH = this.canvasHeight

				// 根据奖品个数计算 角度
				let prizeCount = this.prizeList.length
				let baseAngle = Math.PI * 2 / prizeCount

				// 设置描边颜色
				ctx.setStrokeStyle(`${this.strokeColor}`)

				// 设置字体和字号
				// #ifndef MP
				let fontFamily =
					'-apple-system, BlinkMacSystemFont, \'PingFang SC\', \'Helvetica Neue\', STHeiti, \'Microsoft Yahei\', Tahoma, Simsun, sans-serif'
				ctx.font = `${this.strFontSize}px ${fontFamily}`
				// #endif
				// #ifdef MP
				ctx.setFontSize(this.strFontSize)
				// #endif

				// 注意，开始画的位置是从0°角的位置开始画的。也就是水平向右的方向。
				// 画具体内容
				for (let i = 0; i < prizeCount; i++) {
					let prizeItem = this.prizeList[i]
					// 当前角度
					let angle = i * baseAngle

					// 保存当前画布的状态
					ctx.save()

					// 开始画圆弧
					ctx.beginPath()

					// x => 圆弧对应的圆心横坐标 x
					// y => 圆弧对应的圆心横坐标 y
					// radius => 圆弧的半径大小
					// startAngle => 圆弧开始的角度，单位是弧度
					// endAngle => 圆弧结束的角度，单位是弧度
					// anticlockwise(可选) => 绘制方向，true 为逆时针，false 为顺时针

					// 外圆边框
					ctx.arc(canvasW * 0.5, canvasH * 0.5, this.outsideRadius, angle, angle + baseAngle, false)
					ctx.stroke()
					// 内圆边框
					ctx.arc(canvasW * 0.5, canvasH * 0.5, this.insideRadius, angle + baseAngle, angle, true)
					ctx.stroke()

					// 区块边框
					ctx.arc(canvasW * 0.5, canvasH * 0.5, this.outsideRadius, angle, angle + baseAngle, false)
					ctx.stroke()

					ctx.arc(canvasW * 0.5, canvasH * 0.5, this.insideRadius, angle + baseAngle, angle, true)
					ctx.stroke()

					// 每个奖品区块背景填充颜色
					if (this.colors.length === 2) {
						ctx.setFillStyle(this.colors[i % 2])
					} else {
						ctx.setFillStyle(this.colors[i])
					}
					// 填充颜色
					ctx.fill()

					// 开始绘制奖品内容
					// 重新映射画布上的 (0,0) 位置
					let translateX = canvasW * 0.5 + Math.cos(angle + baseAngle / 2) * this.textDistance
					let translateY = canvasH * 0.5 + Math.sin(angle + baseAngle / 2) * this.textDistance
					ctx.translate(translateX, translateY)

					// 绘制奖品名称
					ctx.setFillStyle(this.strFontColor)
					let rewardName = this.strLimit(prizeItem[this.strKey])

					// rotate方法旋转当前的绘图，因为文字是和当前扇形中心线垂直的
					ctx.rotate(angle + (baseAngle / 2) + (Math.PI / 2))

					// 设置文本位置并处理换行
					// 是否需要换行
					let isLineBreak = rewardName.length > this.strLineLen
					if (isLineBreak) {
						// 获得多行文本数组
						rewardName = rewardName.substring(0, this.strLineLen) + ',' + rewardName.substring(this
							.strLineLen)
						let rewardNames = rewardName.split(',')

						// 循环文本数组，计算每一行的文本宽度
						for (let j = 0; j < rewardNames.length; j++) {
							if (ctx.measureText && ctx.measureText(rewardNames[j]).width) {
								// 文本的宽度信息
								let tempStrSize = ctx.measureText(rewardNames[j])
								let tempStrWidth = -(tempStrSize.width / 2).toFixed(2)
								ctx.fillText(rewardNames[j], tempStrWidth, j * this.strLineHeight)
							} else {
								this.measureText = rewardNames[j]

								// 等待页面重新渲染
								await this.$nextTick()

								let textWidth = await this.getTextWidth()
								let tempStrWidth = -(textWidth / 2).toFixed(2)
								ctx.fillText(rewardNames[j], tempStrWidth, j * this.strLineHeight)
								// console.log(rewardNames[j], textWidth, i)
							}
						}
					} else {
						if (ctx.measureText && ctx.measureText(rewardName).width) {
							// 文本的宽度信息
							let tempStrSize = ctx.measureText(rewardName)
							let tempStrWidth = -(tempStrSize.width / 2).toFixed(2)
							ctx.fillText(rewardName, tempStrWidth, 0)
						} else {
							this.measureText = rewardName

							// 等待页面重新渲染
							await this.$nextTick()

							let textWidth = await this.getTextWidth()
							let tempStrWidth = -(textWidth / 2).toFixed(2)
							ctx.fillText(rewardName, tempStrWidth, 0)
						}
					}

					// 绘制奖品图片
					if (prizeItem.prizeImage) {
						// App-Android平台 系统 webview 更新到 Chrome84+ 后 canvas 组件绘制本地图像 uni.canvasToTempFilePath 会报错
						// 统一将图片处理成 base64
						// https://ask.dcloud.net.cn/question/103303
						let reg = /^(https|http)/g
						// 处理远程图片
						if (reg.test(prizeItem.prizeImage)) {
							let res = await downloadFile(prizeItem.prizeImage)
							if (res.ok) {
								let tempFilePath = res.tempFilePath
								// #ifndef MP
								prizeItem.prizeImage = await pathToBase64(tempFilePath)
								// #endif
								// #ifdef MP
								prizeItem.prizeImage = tempFilePath
								// #endif
							}
						} else {
							// #ifndef MP
							prizeItem.prizeImage = await pathToBase64(prizeItem.prizeImage)
							// #endif
						}

						ctx.drawImage(prizeItem.prizeImage, -(this.imageWidth / 2), canvasW / 20, this.imageWidth, this
							.imageHeight)
					}

					ctx.restore()
				}

				// 保存绘图并导出图片
				ctx.draw(true, () => {
					let drawTimer = setTimeout(() => {
						clearTimeout(drawTimer)
						drawTimer = null

						// #ifdef MP-ALIPAY
						ctx.toTempFilePath({
							destWidth: this.canvasWidth,
							destHeight: this.canvasHeight,
							success: (res) => {
								// console.log(res.apFilePath)
								this.handlePrizeImg({
									ok: true,
									data: res.apFilePath,
									msg: '画布导出生成图片成功'
								})
							},
							fail: (err) => {
								this.handlePrizeImg({
									ok: false,
									data: err,
									msg: '画布导出生成图片失败'
								})
							}
						})
						// #endif
						// #ifdef MP
						uni.canvasToTempFilePath({
							destWidth: this.canvasWidth,
							destHeight: this.canvasHeight,
							canvasId: this.canvasId,
							success: (res) => {
								// 在 H5 平台下，tempFilePath 为 base64
								// console.log(res.tempFilePath)
								this.handlePrizeImg({
									ok: true,
									data: res.tempFilePath,
									msg: '画布导出生成图片成功'
								})
							},
							fail: (err) => {
								this.handlePrizeImg({
									ok: false,
									data: err,
									msg: '画布导出生成图片失败'
								})
							}
						}, this)
						// #endif
						// #ifdef APP-PLUS || H5
						uni.canvasToTempFilePath({
							destWidth: this.canvasWidth * this.systemInfo.pixelRatio,
							destHeight: this.canvasHeight * this.systemInfo.pixelRatio,
							canvasId: this.canvasId,
							success: (res) => {
								// 在 H5 平台下，tempFilePath 为 base64
								// console.log(res.tempFilePath)
								this.handlePrizeImg({
									ok: true,
									data: res.tempFilePath,
									msg: '画布导出生成图片成功'
								})
							},
							fail: (err) => {
								this.handlePrizeImg({
									ok: false,
									data: err,
									msg: '画布导出生成图片失败'
								})
							}
						}, this)
						// #endif
					}, 500)
				})
			},
			// 处理导出的图片
			handlePrizeImg(res) {
				if (res.ok) {
					let data = res.data

					if (!this.canvasCached) {
						this.lotteryImg = data
						this.handlePrizeImgSuc(res)
						return
					}

					// #ifndef H5
					if (this.isCacheImg) {
						uni.getSavedFileList({
							success: (sucRes) => {
								let fileList = sucRes.fileList
								// console.log('getSavedFileList Cached', fileList)

								let cached = false
								for (let i = 0; i < fileList.length; i++) {
									let item = fileList[i]
									if (item.filePath === data) {
										cached = true
										this.lotteryImg = data

										this.handlePrizeImgSuc(res)
										break
									}
								}

								if (!cached) {
									this.initCanvasDraw()
								}
							},
							fail: (err) => {
								this.initCanvasDraw()
							}
						})
					} else {
						uni.saveFile({
							tempFilePath: data,
							success: (sucRes) => {
								let filePath = sucRes.savedFilePath
								// console.log('saveFile', filePath)
								setStore('lotteryImg', filePath)
								this.lotteryImg = filePath
								this.handlePrizeImgSuc({
									ok: true,
									data: filePath,
									msg: '画布导出生成图片成功'
								})
							},
							fail: (err) => {
								this.handlePrizeImg({
									ok: false,
									data: err,
									msg: '画布导出生成图片失败'
								})
							}
						})
					}
					// #endif
					// #ifdef H5
					setStore('lotteryImg', data)
					this.lotteryImg = data
					this.handlePrizeImgSuc(res)

					// console info
					let consoleText = this.isCacheImg ? '缓存' : '导出'
					// #endif
				} else {
					console.error('处理导出的图片失败', res)
					uni.hideLoading()
					// #ifdef H5 
					console.error('###当前为 H5 端，下载网络图片需要后端配置允许跨域###')
					// #endif
					// #ifdef MP
					console.error('###当前为小程序端，下载网络图片需要配置域名白名单###')
					// #endif
				}
			},
			// 处理图片完成
			handlePrizeImgSuc(res) {
				uni.hideLoading()
				this.$emit('finish', {
					ok: res.ok,
					data: res.data,
					msg: res.ok ? this.successMsg : this.failMsg
				})
			},
			// 兼容 app 端不支持 ctx.measureText
			// 已知问题：初始绘制时，低端安卓机 平均耗时 2s
			getTextWidth() {
				return new Promise((resolve, reject) => {
					uni.createSelectorQuery().in(this).select('.almost-lottery__measureText').fields({
						size: true,
					}, (res) => {
						resolve(res.width)
					}).exec()
				})
			},
			// 处理文字溢出
			strLimit(value) {
				let maxLength = this.strMaxLen
				if (!value || !maxLength) return value
				return value.length > maxLength ? value.slice(0, maxLength - 1) + '...' : value
			},
			// 检查本地缓存中是否存在转盘图
			checkCacheImg() {
				// 检查是否已有缓存的转盘图
				// 检查是否与本次奖品数据相同
				this.oldLotteryImg = getStore('lotteryImg')
				let oldPrizeList = getStore('prizeList')
				let newPrizeList = JSON.stringify(this.prizeList)
				if (this.oldLotteryImg) {
					if (oldPrizeList === newPrizeList) {
						this.isCacheImg = true

						this.handlePrizeImg({
							ok: true,
							data: this.oldLotteryImg,
							msg: '画布导出生成图片成功'
						})
						return
					}
				}

				this.initCanvasDraw()
			},
			// 初始化绘制
			initCanvasDraw() {
				this.isCacheImg = false
				this.lotteryImg = ''
				clearStore('lotteryImg')
				setStore('prizeList', this.prizeList)
				this.onCreateCanvas()
			}
		},
		mounted() {
			this.$nextTick(() => {
				let stoTimer = setTimeout(() => {
					clearTimeout(stoTimer)
					stoTimer = null

					if (this.canvasCached) {
						this.checkCacheImg()
					} else {
						this.onCreateCanvas()
					}
					this.transitionDuration = this.duration
				}, 50)
			})
		}
	}
</script>

<style lang="scss" scoped>
	.almost-lottery {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		background-repeat: no-repeat;
		background-position: center center;
		background-size: contain;
	}
	.almost-lottery__wrap {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.almost-lottery__canvas {
		position: absolute;
		left: -9999px;
		opacity: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.almost-lottery__action {
		position: absolute;
		background-repeat: no-repeat;
		background-position: center center;
		background-size: contain;
	}

	.almost-lottery__measureText {
		position: absolute;
		left: 0;
		top: 0;
		white-space: nowrap;
		font-size: 12px;
		opacity: 0;
	}

	.canvas-img {
		display: block;
		transition: transform ease;
		&.willEnd{
			transition: transform ease-out;
		}
	}

	.pointer {
		width: 38px;
		position: absolute;
		left: 50%;
		transform: translate(-50%);
		z-index: 3;
		top: -10px;
	}
</style>
