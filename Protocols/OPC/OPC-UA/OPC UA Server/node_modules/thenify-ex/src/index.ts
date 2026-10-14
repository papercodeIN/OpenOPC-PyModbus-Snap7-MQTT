export interface ICreateWrapperOptions {
  withCallback?: boolean
  multiArgs?: boolean | string[]
}
/**
 * Turn async functions into promises
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

export function thenify(
  fn: Function,
  options: ICreateWrapperOptions,
): Function {
  if (!(typeof fn === 'function')) throw new Error("expect `fn` to be a function");
  return createWrapper(fn, options)
}

/**
 * Turn async functions into promises and backward compatible with callback
 */

export function withCallback<T extends Function>(fn: Function, options?: ICreateWrapperOptions): T {
  if (!(typeof fn === 'function')) throw new Error("expect `fn` to be a function");
  options = options || {}
  options.withCallback = true
  return createWrapper(fn, options) as T;
}

function createCallback(
  resolve: Function,
  reject: Function,
  multiArgs?: boolean | string[],
): Function {
  // default to true
  if (multiArgs === undefined) multiArgs = true
  return function (err: Error, value: any) {
    if (err) return reject(err)
    const length = arguments.length

    if (length <= 2 || !multiArgs) return resolve(value)

    if (Array.isArray(multiArgs)) {
      const values: Record<string, any> = {}
      for (let i = 1; i < length; i++) {
        values[(multiArgs as string[])[i - 1]] = arguments[i]
      }
      return resolve(values)
    }

    const values = new Array(length - 1)
    for (let i = 1; i < length; ++i) values[i - 1] = arguments[i]
    resolve(values)
  }
}

function createWrapper(
  fn: Function,
  options?: ICreateWrapperOptions,
): Function {
  options = options || {}
  let name = fn.name
  name = (name || '').replace(/\s|bound(?!$)/g, '')
  const newFn = function (this: Function) {
    const self: Function = this
    const len = arguments.length
    if (options!.withCallback) {
      const lastType = typeof arguments[len - 1]
      if (lastType === 'function') return fn.apply(self, arguments)
    }
    const args = new Array(len + 1)
    for (let i = 0; i < len; ++i) args[i] = arguments[i]
    const lastIndex = len
    return new Promise(function (resolve, reject) {
      args[lastIndex] = createCallback(resolve, reject, options?.multiArgs)
      fn.apply(self, args)
    })
  }
  Object.defineProperty(newFn, 'name', { value: name })
  return newFn
}
