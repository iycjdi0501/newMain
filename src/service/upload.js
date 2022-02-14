import { apiClient } from '@/service/index'

export default {
  postRoomImage(image) {
    const formData = new FormData()
    formData.append('roomImage', image)
    return apiClient.post('/s3/image-upload/room-image', formData, {
      headers: {
        accept: 'multipart/form-data',
        'content-type': 'multipart/form-data',
      },
    })
  },
  postAttachedImage(image) {
    const formData = new FormData()
    formData.append('attachedImage', image)
    return apiClient.post('/s3/image-upload/inquiry', formData, {
      headers: {
        accept: 'multipart/form-data',
        'content-type': 'multipart/form-data',
      },
    })
  },
}
