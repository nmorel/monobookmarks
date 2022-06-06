import {lazy} from 'react'

const remoteEntryCache = new Map<string, Promise<boolean>>()
const remoteModuleCache = new Map<string, Promise<any>>()
const remoteComponentCache = new Map<string, ReturnType<typeof lazy>>()

function loadRemoteEntry(remote: string): Promise<boolean> {
  let remoteEntryPromise = remoteEntryCache.get(remote)
  if (remoteEntryPromise) {
    return remoteEntryPromise
  }

  remoteEntryPromise = new Promise((resolve, reject) => {
    const remoteEntryUrl = `/static/${remote}/remoteEntry.js`
    const element = document.createElement('script')

    element.src = remoteEntryUrl
    element.type = 'text/javascript'
    element.async = true

    element.onload = () => {
      resolve(true)
    }

    element.onerror = () => {
      reject(`Failed to load ${remoteEntryUrl}`)
    }

    document.head.appendChild(element)
  })
    .then(() =>
      // Initializes the share scope. This fills it with known provided modules from this build and all remotes
      // @ts-expect-error defined by webpack
      __webpack_init_sharing__('default')
    )
    .then(() =>
      // Initialize the container, it may provide shared modules
      // @ts-expect-error defined by webpack
      window[remote].init(__webpack_share_scopes__.default)
    )
  remoteEntryCache.set(remote, remoteEntryPromise)
  return remoteEntryPromise
}

export function loadRemoteModule(remote: string, module: string) {
  const key = `${remote}/${module}`
  let remoteModulePromise = remoteModuleCache.get(key)
  if (remoteModulePromise) {
    return remoteModulePromise
  }
  remoteModulePromise = loadRemoteEntry(remote)
    .then(() =>
      // @ts-expect-error defined by webpack
      window[remote].get(`./${module}`)
    )
    .then(factory => factory())
  remoteModuleCache.set(key, remoteModulePromise)
  return remoteModulePromise
}

export function getRemoteComponent(remote: string, componentName: string) {
  const key = `${remote}/${componentName}`
  let component = remoteComponentCache.get(key)
  if (component) {
    return component
  }
  component = lazy(() => loadRemoteModule(remote, componentName))
  remoteComponentCache.set(key, component)
  return component
}
