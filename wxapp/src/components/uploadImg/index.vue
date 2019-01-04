<template>
  <main class="upload-page">
    <mpvue-cropper
      ref="cropper"
      :option="cropperOpt"
    ></mpvue-cropper>
    <div class="cropper-buttons">
      <div class="cropper-btn" @tap="getCropperImage">确认</div>
      <div class="cropper-btn" @tap="uploadTap">重新选择</div>
      <div class="cropper-btn" @click="cancel">取消</div>
    </div>
  </main>
</template>
<script>
import MpvueCropper from "mpvue-cropper";

let wecropper;

const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;

export default {
  data() {
    return {
      cropperOpt: {
        id: "cropper",
        width,
        height,
        scale: 1,
        zoom: 8,
        cut: {
          x: (width - 200) / 2,
          y: (height - 200) / 2,
          width: 200,
          height: 200
        }
      }
    };
  },
  props: ['src'],
  components: {
    MpvueCropper
  },
  methods: {
    uploadTap() {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          const src = res.tempFilePaths[0];
          //  获取裁剪图片资源后，给data添加src属性及其值
          wecropper.pushOrigin(src);
        }
      });
    },
    getCropperImage() {
      wecropper
        .getCropperImage()
        .then(src => {
          this.$emit('getImage', src);
        })
        .catch(e => {
          console.error("获取图片失败");
        });
    },
    cancel() {
      this.$emit('getImage');
    }
  },
  mounted() {
    wecropper = this.$refs.cropper;
    wecropper.pushOrigin(this.src);
  }
};
</script>
 
<style lang="scss">
.upload-page {
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99;
}
.cropper-wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #e5e5e5;
}

.cropper-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
}

.cropper-btn {
  flex-grow: 1;
  min-width: 33%;
  text-align: center;
}

.cropper {
  position: absolute;
  top: 0;
  left: 0;
}

.cropper-buttons {
  background-color: rgba(0, 0, 0, 0.95);
  color: #04b00f;
}
</style>