import store from '@/store'
import router from '@/router'

export const ERROR_TYPE = {
  FILE: 'file_error',
  AUTH: 'auth_error',
  PAGINATION: 'pagination_error',
  WISHLIST: 'wishlist_error',
  VERIFICATION: 'verification_error',
}

/**
 *
 * @param { import("axios").AxiosError<{statusCode: number, timestamp: Date, path: string, message: {}, id: string}> } error axios 에러
 * @param { typeof ERROR_TYPE[keyof ERROR_TYPE] } errorType 에러 타입
 */
export async function errorHandler(error, errorType) {
  const responseStatus = error.response.status
  const errorId = error.response.data?.id

  switch (errorType) {
    case ERROR_TYPE.FILE:
      return await fileErrorHandler(responseStatus, errorId)
    case ERROR_TYPE.AUTH:
      return await signErrorHandler(responseStatus, errorId)
    case ERROR_TYPE.PAGINATION:
      return await pageErrorHandler(responseStatus, errorId)
    case ERROR_TYPE.WISHLIST:
      return await wishErrorHandler(responseStatus, errorId)
    case ERROR_TYPE.VERIFICATION:
      return await verificationErrorHandler(responseStatus, errorId)
    default:
      return await defaultErrorHandler(responseStatus, errorId)
  }
}

async function defaultErrorHandler(status, errorId) {
  //로그인창 열기 여부
  let isOpenSignInModal = false
  let action = {}

  switch (status) {
    case 400:
      action = {
        type: 'error',
        content: '잘못된 요청입니다.',
      }
      break
    case 401:
      action = {
        content: '로그인이 필요한 서비스입니다.',
      }
      isOpenSignInModal = true
      break
    case 403:
      action = {
        type: 'error',
        content: '권한이 없습니다.<br>고객센터에 문의해 주세요.',
      }
      break
    case 400:
    case 404:
      action = {
        type: 'error',
        content: '대상을 찾을 수 없습니다.<br>고객센터에 문의해 주세요.',
      }
      break
    case 423:
      action = {
        type: 'error',
        content: '차단된 계정입니다.<br>고객센터에 문의해 주세요.',
      }
      break
    case 429:
      action = {
        type: 'error',
        content: '서버가 혼잡합니다.<br>잠시 후 다시 시도해주세요.',
      }
      break
    case 492:
      action = {
        type: 'error',
        content: '올바르지 않는 주소입니다.',
      }
      break
    case 502:
      action = {
        type: 'error',
        content: '서버를 점검 중입니다.<br>잠시 후 시도해주세요.',
      }
      break
    default:
      action = {
        type: 'error',
        content: '알 수 없는 오류가 발생했습니다.<br>고객센터에 문의해 주세요.',
      }
      break
  }

  await dispatch(errorId, action, isOpenSignInModal)
}

async function fileErrorHandler(status, errorId) {
  //로그인창 열기 여부
  let isOpenSignInModal = false
  let action = {}

  switch (status) {
    case 400:
      action = {
        type: 'error',
        content: '지원하지 않는 확장자입니다.',
      }
      break
    case 401:
      action = {
        content: '로그인이 필요한 서비스입니다.',
      }
      isOpenSignInModal = true
      break
    case 413:
      action = {
        type: 'error',
        content: '파일의 용량이 너무 큽니다.',
      }
      break
    case 423:
      action = {
        type: 'error',
        content: '차단된 계정입니다.<br>고객센터에 문의해 주세요.',
      }
      break
    case 429:
      action = {
        type: 'error',
        content: '서버가 혼잡합니다.<br>잠시 후 다시 시도해주세요.',
      }
      break
    case 502:
      action = {
        type: 'error',
        content: '서버를 점검 중입니다.<br>잠시 후 시도해주세요.',
      }
      break
    default:
      action = {
        type: 'error',
        content: '알 수 없는 오류가 발생했습니다.<br>고객센터에 문의해 주세요.',
      }
      break
  }

  await dispatch(errorId, action, isOpenSignInModal)
}

async function signErrorHandler(status, errorId) {
  //로그인창 열기 여부
  let isOpenSignInModal = false
  let action = {}

  switch (status) {
    case 401:
      action = {
        content:
          '유효시간 만료로 인해<br>자동 로그아웃 되었습니다.<br>다시 로그인해 주세요.',
      }
      isOpenSignInModal = true
      break
    case 404:
      action = {
        content: '존재하지 않는 계정입니다.<br>다시 가입해 주세요.',
      }
      isOpenSignInModal = true
      break
    case 423:
      action = {
        type: 'error',
        content: '계정이 차단조치 되었습니다.<br>고객센터로 문의해 주세요.',
      }
      break
    case 429:
      action = {
        type: 'error',
        content: '서버가 혼잡합니다.<br>잠시 후 다시 시도해주세요.',
      }
      break
    case 502:
      action = {
        type: 'error',
        content: '서버를 점검 중입니다.<br>잠시 후 시도해주세요.',
      }
      break
    default:
      action = {
        type: 'error',
        content: '알 수 없는 오류가 발생했습니다.<br>고객센터로 문의해 주세요.',
      }
      break
  }

  await dispatch(errorId, action, isOpenSignInModal)
}

async function pageErrorHandler(status, errorId) {
  //로그인창 열기 여부
  let isOpenSignInModal = false
  let isMoveToNotfoundPage = false
  let action = {}

  switch (status) {
    case 401:
      action = {
        content: '로그인이 필요한 서비스입니다.',
      }
      isOpenSignInModal = true
      break
    case 403:
      action = {
        type: 'error',
        content: '권한이 없습니다.<br>고객센터에 문의해 주세요.',
      }
      break
    case 400:
    case 404:
      action = {
        type: 'error',
        content: '대상을 찾을 수 없습니다.<br>고객센터에 문의해 주세요.',
      }
      isMoveToNotfoundPage = true
      break
    case 429:
      action = {
        type: 'error',
        content: '서버가 혼잡합니다.<br>잠시 후 다시 시도해주세요.',
      }
      break
    case 502:
      action = {
        type: 'error',
        content: '서버를 점검 중입니다.<br>잠시 후 시도해주세요.',
      }
      break
    default:
      action = {
        type: 'error',
        content: '알 수 없는 오류가 발생했습니다.<br>고객센터에 문의해 주세요.',
      }
      break
  }

  await dispatch(errorId, action, isOpenSignInModal)

  if (isMoveToNotfoundPage) {
    await router.push({ name: 'NotFound' })
  }
}

async function wishErrorHandler(status, errorId) {
  //로그인창 열기 여부
  let isOpenSignInModal = false
  let action = {}

  switch (status) {
    case 401:
      action = {
        content: '로그인이 필요한 서비스입니다.',
      }
      isOpenSignInModal = true
      break
    case 404:
      action = {
        type: 'error',
        content: '해당 매물을 찾을 수 없습니다.<br>고객센터에 문의해 주세요.',
      }
      break
    case 405:
      action = {
        type: 'error',
        content: '내 매물에는 찜할 수 없습니다.',
      }
      break
    case 423:
      action = {
        type: 'error',
        content: '차단된 계정입니다.<br>고객센터에 문의해 주세요.',
      }
      break
    case 480:
      action = {
        content: '이미 찜한 매물입니다.',
      }
      break
    case 429:
      action = {
        type: 'error',
        content: '서버가 혼잡합니다.<br>잠시 후 다시 시도해주세요.',
      }
      break
    case 502:
      action = {
        type: 'error',
        content: '서버를 점검 중입니다.<br>잠시 후 시도해주세요.',
      }
      break
    default:
      action = {
        type: 'error',
        content: '알 수 없는 오류가 발생했습니다.<br>고객센터에 문의해 주세요.',
      }
      break
  }

  await dispatch(errorId, action, isOpenSignInModal)
}

async function verificationErrorHandler(status, errorId) {
  //로그인창 열기 여부
  let isOpenSignInModal = false
  let action = {}

  switch (status) {
    case 400:
      action = {
        type: 'error',
        content: '잘못된 요청입니다.',
      }
      isOpenSignInModal = true
      break
    case 401:
      action = {
        content: '로그인이 필요한 서비스입니다.',
      }
      isOpenSignInModal = true
      break
    case 403:
      action = {
        type: 'error',
        content: '권한이 없습니다.<br>고객센터에 문의해 주세요.',
      }
      break
    case 404:
      action = {
        type: 'error',
        content: '해당 인증을 찾지 못했습니다.',
      }
      break
    case 405:
      action = {
        type: 'error',
        content: '기존의 명의와 동일한 명의로 인증 해야 합니다.',
      }
      break
    case 429:
      action = {
        type: 'error',
        content: '서버가 혼잡합니다.<br>잠시 후 다시 시도해주세요.',
      }
      break
    case 480:
      action = {
        type: 'error',
        content: '이미 다른 계정으로 본인인증 되어있습니다.',
      }
      break
    case 502:
      action = {
        type: 'error',
        content: '서버를 점검 중입니다.<br>잠시 후 시도해주세요.',
      }
      break
    default:
      action = {
        type: 'error',
        content: '알 수 없는 오류가 발생했습니다.<br>고객센터에 문의해 주세요.',
      }
      break
  }

  await dispatch(errorId, action, isOpenSignInModal)
}

const INSERT_NOTIFICATION_ACTION_ID = 'insertNotification'

/**
 * @param {string} errorId 에러 고유아이디(uuid)
 * @param {{type?: string, content: string}} action 디스패치할 데이터
 * @param {boolean} isOpenSignInModal 로그인모달 띄울건지 여부
 */
async function dispatch(errorId, action, isOpenSignInModal) {
  action['errorId'] = errorId

  await store.dispatch(INSERT_NOTIFICATION_ACTION_ID, action)

  if (isOpenSignInModal) {
    store.commit('OPEN_SIGN_IN_MODAL')
  }
}
