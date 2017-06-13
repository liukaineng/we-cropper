/**
 * Created by sail on 2017/6/1.
 */
import weCropper from '../../dist/weCropper.js'

const device = wx.getSystemInfoSync()

Page({
	data: {
		id: 'cropper',
    width: device.windowWidth,
		height: device.windowWidth,
		scale: 2.5,
		zoom: 8,
    cut: {
      x: 100,
      y: 100,
      width: 175,
      height: 175
    }
	},
	touchStart (e) {
		this.wecropper.touchStart(e)
	},
	touchMove (e) {
		this.wecropper.touchMove(e)
	},
	touchEnd (e) {
		this.wecropper.touchEnd(e)
	},
	getCropperImage () {
		const { width, height } = this.data
		const { windowWidth } = wx.getSystemInfoSync()

		const radio = windowWidth / 750

		this.wecropper.getCropperImage((src) => {
			if (src) {
				console.log(src)
				wx.previewImage({
					current: '', // 当前显示图片的http链接
					urls: [src] // 需要预览的图片http链接列表
				})
			} else {
				console.log('获取图片地址失败，请稍后重试')
			}
		})
	},
	uploadTap () {
		const self = this

		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success (res) {
				const src = res.tempFilePaths[0]
				//  获取裁剪图片资源后，给data添加src属性及其值

				self.wecropper.pushOrign(src)
			}
		})
	},
	onLoad (option) {
		const { data } = this

		new weCropper(data)
			.on('ready', (ctx) => {
				console.log(`wecropper is ready for work!`)
			})
			.on('beforeImageLoad', (ctx) => {
				console.log(`before picture loaded, i can do something`)
				console.log(`current canvas context:`, ctx)
				wx.showToast({
					title: '上传中',
					icon: 'loading',
					duration: 20000
				})
			})
			.on('imageLoad', (ctx) => {
				console.log(`picture loaded`)
				console.log(`current canvas context:`, ctx)
				wx.hideToast()
			})
			.on('beforeDraw', (ctx, instance) => {
				console.log(`before canvas draw,i can do something`)
				console.log(`current canvas context:`, ctx)
			})
			.updateCanvas()
	}
})
