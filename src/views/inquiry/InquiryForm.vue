<template>
  <div class="inquiry-form">
    <div class="wrapper">
      <h2>01. 문의 내용</h2>
      <form @submit.prevent="postInquiry">
        <base-select
          theme="fixed-label"
          label="문의 유형"
          :options="options"
          place-holder="선택하세요."
          v-model="form.category"
        />
        <base-input
          theme="fixed-label"
          label="제목"
          v-model="form.title"
          minlength="2"
          maxlength="50"
        />
        <base-textarea
          theme="fixed-label"
          label="내용"
          v-model="form.description"
          minlength="1"
          maxlength="500"
        />
        <div class="file-input">
          <div class="top-box">
            <span class="label">사진</span>
            <div class="file-box">
              <span
                v-for="(preview, index) in form.attachedImages"
                :key="preview"
              >
                <img
                  v-if="regex.test(preview)"
                  :src="preview"
                  alt="사용자 업로드 사진"
                />
                <spinner v-else class="spinner" />
                <span class="close" @click="removeImage(index)">
                  <font-awesome-icon :icon="['fal', 'times']" />
                </span>
              </span>
              <span
                v-if="form.attachedImages.length < 5"
                class="file"
                ref="file"
              >
                <input
                  type="file"
                  id="file"
                  accept=".jpg, .png, .jpeg, .jfif"
                  @change="insertFile"
                />
                <label for="file">{{ label }}</label>
              </span>
            </div>
          </div>
          <ul class="caution">
            <li>사진의 최대 5장까지 등록할 수 있습니다.</li>
            <li>사진의 크기는 최대 5MB까지 가능합니다.</li>
            <li>사진의 확장자는 jpg, png, jpeg, jfif만 지원합니다.</li>
          </ul>
        </div>
        <ul>
          <li>
            제목은 최소 2자 이상 최대 50자 이내로 작성하실 수 있으며, 내용은
            최소 1자 이상 최대 500자 이내로 작성하실 수 있습니다.
          </li>
          <li>보내주신 문의를 최대한 빠른 시일내로 답변드리겠습니다.</li>
          <li>
            문의에 욕설, 인격모독 등을 포함한 표현이 있다면 상담이 중단될 수
            있습니다.
          </li>
          <li>남겨주신 문의는 문의내역에서 확인하실 수 있습니다.</li>
        </ul>
        <tool-tip class="submit-box" :messages="errorMessages" theme="error">
          <base-button
            type="submit"
            :disabled="!!errorMessages.length"
            @submit.prevent
          >
            등록
          </base-button>
        </tool-tip>
      </form>
    </div>
  </div>
</template>

<script>
import BaseSelect from '@/components/form/base/BaseSelect'
import BaseInput from '@/components/form/base/BaseInput'
import BaseTextarea from '@/components/form/base/BaseTextarea'
import BaseButton from '@/components/form/base/BaseButton'
import { attachedImageRegex } from '@/assets/data/regex'
import Spinner from '@/components/tool/Spinner'
import { v4 as uuidV4 } from 'uuid'
import { errorHandler, ERROR_TYPE } from '@/modules/errorHandler'
import upload from '@/service/upload'
import ToolTip from '@/components/tool/ToolTip'

export default {
  components: {
    ToolTip,
    Spinner,
    BaseButton,
    BaseTextarea,
    BaseInput,
    BaseSelect,
  },
  data() {
    return {
      form: {
        category: '',
        title: '',
        description: '',
        attachedImages: [],
      },
      options: [
        {
          value: '허위매물 신고',
          label: '허위매물 신고',
        },
        {
          value: '버그 신고',
          label: '버그 신고',
        },
        {
          value: '개선사항',
          label: '개선사항',
        },
        {
          value: '기타',
          label: '기타',
        },
      ],
      regex: attachedImageRegex,
      label: '사진 추가',
    }
  },
  computed: {
    errorMessages() {
      const messages = []

      if (
        !['허위매물 신고', '버그 신고', '개선사항', '기타'].includes(
          this.form.category
        )
      ) {
        messages.push('문의 유형을 선택해주세요.')
      }

      if (
        !(this.form.title
          ? this.form.title.length >= 2 && this.form.title.length <= 50
          : false)
      ) {
        messages.push('제목을 작성해주세요.')
      }

      if (
        !(this.form.description ? this.form.description.length <= 500 : false)
      ) {
        messages.push('내용을 작성해주세요.')
      }

      const urlRegex = attachedImageRegex
      if (!(this.form.attachedImages.length <= 5)) {
        messages.push('사진을 최대 5장 이하로 등록해주세요.')
      } else if (!this.form.attachedImages.every((url) => urlRegex.test(url))) {
        messages.push('사진을 업로드 중 입니다.')
      }

      return messages
    },
  },
  methods: {
    postInquiry() {
      if (!this.errorMessages.length) {
        this.$store
          .dispatch('postInquiry', this.form)
          .then((id) => {
            this.$store.dispatch('insertNotification', {
              content:
                '문의사항을 전달하였습니다.<br>빠른 시일내에<br>답변드리겠습니다.',
            })
            this.$router.push({ name: 'MyInquiryDetail', params: { id } })
          })
          .catch(errorHandler)
      } else {
        this.$store.dispatch('insertNotification', {
          type: 'error',
          content: '잘못된 접근입니다.',
        })
      }
    },
    removeImage(index) {
      this.form.attachedImages.splice(index, 1)
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
        this.form.attachedImages.push(id)

        upload
          .postAttachedImage(file)
          .then((response) => {
            const index = this.form.attachedImages.indexOf(id)
            this.form.attachedImages.splice(index, 1, response.data)
            this.label = '사진 추가'
            fileInput.classList.remove('error')
          })
          .catch((error) => errorHandler(error, ERROR_TYPE.FILE))
      }
    },
    validFileType(file) {
      const fileTypes = ['image/jpeg', 'image/png']
      return fileTypes.includes(file.type)
    },
  },
}
</script>

<style lang="scss" scoped>
.inquiry-form {
  padding: 5em 0;
  background-color: $background-foundation;
  display: flex;
  justify-content: center;

  .wrapper {
    width: 1080px;
    padding: 4em;
    background-color: $background-default;

    h2 {
      margin: 0 0 2em;
      font: {
        size: 1.375em;
        family: 'Noto Sans KR', sans-serif;
        weight: 400;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      border-top: 2px solid $border-default;

      .button {
        align-self: center;
        padding: 0.8em 4em;
        border-radius: 0;
        font: {
          weight: 400;
          family: 'Noto Sans KR', sans-serif;
          size: 1em;
        }
      }

      ul {
        list-style-position: inside;
        padding-left: 1em;
        font: {
          weight: 400;
        }

        li {
          margin: 0.5em 0;
        }
      }

      > div,
      > ul {
        padding: {
          top: 2em;
          right: 2em;
          bottom: 2em;
        }
        border-top: 1px solid $border-disable;
      }

      .textarea {
        height: 460px;
      }

      .file-input {
        display: flex;
        flex-direction: column;
        gap: 2em;

        .top-box {
          display: flex;
          gap: 1em;
          align-items: center;

          .label {
            width: 5em;
            flex-shrink: 0;
            font: {
              size: 1.125em;
              weight: 500;
            }
          }

          .file-box {
            flex-grow: 1;
            padding: 40px 50px;
            display: flex;
            flex-wrap: wrap;
            gap: 28px;
            border: 1px solid $border-disable;

            > span {
              width: 120px;
              height: 120px;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                max-width: 100%;
                max-height: 100%;
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
            }
          }
        }
      }
    }
  }
}
@media (max-width: 1024px) {
  .inquiry-form {
    padding: 0;

    .wrapper {
      width: auto;
      padding: 2em 1em;

      h2 {
        font: {
          size: 1.375em;
        }
      }

      form {
        .button {
          border-radius: 1em;
        }

        ul {
          padding-left: 0.5em;
          font-size: 0.8em;
        }

        > div,
        > ul {
          padding: {
            top: 1em;
            right: 0;
            bottom: 1em;
          }
        }

        .textarea {
          height: 300px;
        }

        .file-input {
          gap: 1em;

          .top-box {
            gap: 0;

            .file-box {
              padding: 1em;
              gap: 1em;
            }
          }
        }
      }
    }
  }
}
</style>
