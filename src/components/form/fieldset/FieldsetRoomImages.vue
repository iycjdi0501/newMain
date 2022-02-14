<template>
  <base-fieldset legend="사진 등록" class="fieldset-room-images">
    <ul class="caution">
      <li>
        첫 번째로 등록한 사진이 대표 사진이 되며 대표 사진은 변경할 수 있습니다.
      </li>
      <li>
        사진은 최소 1장 이상 등록해야 하며 최대 10장까지 등록할 수 있습니다.
      </li>
      <li>사진의 크기는 최대 5MB까지 가능합니다.</li>
      <li>사진의 확장자는 jpg, png, jpeg, jfif만 지원합니다.</li>
    </ul>
    <div class="image-box">
      <span
        v-for="(preview, index) in roomImages"
        :key="preview"
        :class="{ representative: index === 0 }"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragend="onDragEnd"
        @dragover.prevent
        @dragenter.prevent="onDragEnter"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop($event, index)"
      >
        <img
          v-if="regex.test(preview)"
          :src="preview"
          alt="사용자 업로드 사진"
          draggable="false"
        />
        <spinner v-else class="spinner" />
        <span class="close" @click="removeImage(index)">
          <font-awesome-icon :icon="['fal', 'times']" />
        </span>
      </span>
      <span v-if="roomImages.length < 10" class="file" ref="file">
        <input
          type="file"
          id="file"
          accept=".jpg, .png, .jpeg, .jfif"
          @change="insertFile"
        />
        <label for="file">{{ label }}</label>
      </span>
    </div>
    <error-field v-if="errors" :errors="errors" :margin="'0 0 0.5em 1em'" />
  </base-fieldset>
</template>

<script>
import BaseFieldset from '@/components/form/base/BaseFieldset'
import { v4 as uuidV4 } from 'uuid'
import Spinner from '@/components/tool/Spinner'
import { roomImageRegex } from '@/assets/data/regex'
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'
import upload from '@/service/upload'
import ErrorField from '@/components/form/ErrorField'

export default {
  components: { ErrorField, Spinner, BaseFieldset },
  props: {
    roomImages: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      label: '사진 추가하기',
      regex: roomImageRegex,
      errors: [],
    }
  },
  created() {},
  methods: {
    confirm() {
      const errors = []

      const urlRegex = roomImageRegex
      if (!(this.roomImages.length >= 1 && this.roomImages.length <= 10)) {
        errors.push('사진을 최소 1장 이상 최대 10장 이하로 등록해주세요.')
      } else if (!this.roomImages.every((url) => urlRegex.test(url))) {
        errors.push('사진을 업로드 중 입니다.')
      }

      this.errors = errors
      this.$emit('update:errors', this.errors)
    },
    insertFile(event) {
      const file = event.target.files[0]
      const fileInput = this.$refs.file

      if (!file) {
        this.label = '사진을 선택해주세요.'
        fileInput.classList.add('error')
      } else if (!this.validFileType(file)) {
        this.label = '지원하지 않는 확장자입니다.'
        fileInput.classList.add('error')
      } else if (file.size > 5242880) {
        this.label = '사진의 용량이 5MB를 초과했습니다.'
        fileInput.classList.add('error')
      } else {
        const id = uuidV4()
        const cloneArray = this.roomImages.slice()
        cloneArray.push(id)
        this.$emit('update:roomImages', cloneArray)

        upload
          .postRoomImage(file)
          .then((response) => {
            const cloneArray = this.roomImages.slice()
            const index = cloneArray.indexOf(id)
            cloneArray.splice(index, 1, response.data)
            this.$emit('update:roomImages', cloneArray)
            this.label = '사진 추가하기'
            fileInput.classList.remove('error')
          })
          .catch((error) => errorHandler(error, ERROR_TYPE.FILE))
      }
    },
    validFileType(file) {
      const fileTypes = ['image/jpeg', 'image/png']
      return fileTypes.includes(file.type)
    },
    removeImage(index) {
      let cloneArray = this.roomImages.slice()
      cloneArray.splice(index, 1)
      this.$emit('update:roomImages', cloneArray)
    },
    onDragStart(event, dragIndex) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'

      event.target.classList.add('dragged')

      event.dataTransfer.setData('drag-index', dragIndex)
    },
    onDragEnd(event) {
      event.target.classList.remove('dragged')
    },
    onDragEnter(event) {
      event.target.classList.add('drag-over')
    },
    onDragLeave(event) {
      event.target.classList.remove('drag-over')
    },
    onDrop(event, dropIndex) {
      event.target.classList.remove('drag-over')

      const dragIndex = Number.parseInt(
        event.dataTransfer.getData('drag-index')
      )
      let cloneArray = this.roomImages.slice()

      const tempFile = cloneArray[dropIndex]
      cloneArray[dropIndex] = cloneArray[dragIndex]
      cloneArray[dragIndex] = tempFile

      this.$emit('update:roomImages', cloneArray)
    },
  },
}
</script>

<style lang="scss" scoped>
.fieldset-room-images {
  .caution {
    list-style-position: inside;
    padding: 0 1em;

    li {
      margin: 0.5em 0;
      font: {
        weight: 400;
      }

      &::marker {
        font-size: 0.1em;
      }
    }
  }

  .image-box {
    border: 1px solid $border-disable;
    margin-top: 5em;
    padding: 1.5em;
    display: flex;
    flex-wrap: wrap;
    gap: 2em;

    > span {
      width: 180px;
      height: 100px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $background-foundation;

      img {
        width: auto;
        height: 100%;
        pointer-events: none;
      }

      .close {
        display: none;
        position: absolute;
        top: 0.1em;
        right: 0.5em;
        color: $color-contrast;
        mix-blend-mode: difference;
        cursor: pointer;
      }

      &.representative {
        position: relative;

        &:before {
          content: '대표 사진';
          position: absolute;
          padding: 0.2em 1em;
          top: 0;
          left: 0;
          color: $color-contrast;
          background-color: $background-primary;
          font: {
            family: 'Noto Sans KR', sans-serif;
            size: 13px;
            weight: 400;
          }
        }
      }

      &.file {
        input {
          opacity: 0;
          position: absolute;
        }

        label {
          width: 100%;
          height: 100%;
          padding: 1em;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid $border-primary;
          font: {
            size: 13px;
            weight: 400;
          }
        }

        &.error {
          label {
            border: 2px solid $border-error;
          }
        }
      }

      &:hover .close {
        display: block;
      }

      &.dragged {
        opacity: 0.5;
      }

      &.drag-over {
        border: 2px solid $border-primary;
      }
    }
  }
}
</style>
