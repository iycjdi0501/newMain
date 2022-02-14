import { createStore } from 'vuex'
import { sign } from '@/store/sign'
import { tool } from '@/store/tool'
import { estate } from '@/store/estate'
import { inquiry } from '@/store/inquiry'
import { sale } from '@/store/sale'
import { slide } from '@/store/slide'

export default createStore({
  modules: { sign, tool, estate, inquiry, sale, slide },
})
