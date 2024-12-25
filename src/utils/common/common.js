import dayjs from 'dayjs'
import { NTooltip } from 'naive-ui'

/**
 * @desc  格式化时间
 * @param {(Object|string|number)} time
 * @param {string} format
 * @returns {string | null}
 */
export function formatDateTime(time = undefined, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}

export function formatDate(date = undefined, format = 'YYYY-MM-DD') {
  return formatDateTime(date, format)
}

/**
 * @desc  函数节流
 * @param {Function} fn
 * @param {Number} wait
 * @returns {Function}
 */
export function throttle(fn, wait) {
  var context, args
  var previous = 0

  return function () {
    var now = +new Date()
    context = this
    args = arguments
    if (now - previous > wait) {
      fn.apply(context, args)
      previous = now
    }
  }
}

/**
 * @desc  函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(method, wait, immediate) {
  let timeout
  return function (...args) {
    let context = this
    if (timeout) {
      clearTimeout(timeout)
    }
    // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
    if (immediate) {
      /**
       * 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
       * 这样确保立即执行后wait毫秒内不会被再次触发
       */
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        method.apply(context, args)
      }
    } else {
      // 如果immediate为false，则函数wait毫秒后执行
      timeout = setTimeout(() => {
        /**
         * args是一个类数组对象，所以使用fn.apply
         * 也可写作method.call(context, ...args)
         */
        method.apply(context, args)
      }, wait)
    }
  }
}

/**
 *
 * @param {HTMLElement} el
 * @param {Function} cb
 * @return {ResizeObserver}
 */
export function useResize(el, cb) {
  const observer = new ResizeObserver((entries) => {
    cb(entries[0].contentRect)
  })
  observer.observe(el)
  return observer
}

/**
 * tooltip
 * @return {*}
 */
export const toolTipWrap = (tooltipText = '', triggerVNode) => {
  return h(
    NTooltip,
    { trigger: 'hover' },
    { default: () => tooltipText, trigger: () => triggerVNode }
  )
}

/* tooltip */
export const renderTooltip = ({ node, option }) =>
  option.value
    ? h(NTooltip, null, {
        trigger: () => node,
        default: () => option.value,
      })
    : node

const isEqual = (obj1, obj2) => {
  // 如果是同一个对象，直接返回 true
  if (obj1 === obj2) {
    return true
  }

  // 如果两个对象类型不同，返回 false
  if (typeof obj1 !== typeof obj2) {
    return false
  }

  // 如果两个对象都为 null，返回 true
  if (obj1 === null || obj2 === null) {
    return obj1 === obj2
  }

  // 如果是数组，逐项比较
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!isEqual(obj1[i], obj2[i])) {
        return false
      }
    }
    return true
  }

  // 如果是对象，逐属性比较
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    const keys1 = Object.keys(obj1).sort()
    const keys2 = Object.keys(obj2).sort()

    if (keys1.length !== keys2.length) {
      return false
    }

    for (let key of keys1) {
      if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
        return false
      }
    }
    return true
  }

  // 其他情况，直接比较值
  return obj1 === obj2
}

export const hasDuplicate = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (isEqual(arr[i], arr[j])) {
        return true
      }
    }
  }
  return false
}
