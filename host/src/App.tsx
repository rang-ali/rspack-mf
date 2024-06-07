import React, { useState, useEffect, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import './index.scss'
import { init, loadRemote } from '@module-federation/runtime'

const modules = [
  {
    scope: 'remote',
    entry: 'http://localhost:8081/remoteEntry.js',
    module: 'Counter',
    label: 'React',
  },
  {
    scope: 'iframe',
    entry: 'http://localhost:8082/remoteEntry.js',
    module: 'IframeContainer',
    label: 'Iframe',
  },
  {
    scope: 'vue',
    entry: 'http://localhost:8083/remoteEntry.js',
    module: 'counterMounter',
    label: 'Vue',
  },
]

init({
  name: 'host',
  remotes: [...modules.map(({ scope, entry }) => ({ name: scope, entry }))],
})

// @ts-ignore
function useDynamicImport({ module, scope }) {
  const [component, setComponent] = useState(null)

  useEffect(() => {
    if (!module && !scope) return
    const loadComponent = async () => {
      // @ts-ignore
      const { default: component } = await loadRemote(`${scope}/${module}`)
      setComponent(() => component)
    }
    loadComponent()
  }, [module, scope])
  const fallback = () => null
  return component || fallback
}

// @ts-ignore
function useDynamicVueImport({ module, scope, ref }) {
  if (!module && !scope) return
  const mountFunc = async (element: ReactNode) => {
    // @ts-ignore
    const { default: func } = await loadRemote(`${scope}/${module}`)
    func(element)
  }
  mountFunc(ref.current)
}

const App = () => {
  // @ts-ignore
  const [{ module, scope }, setSystem] = React.useState({})
  const Component = useDynamicImport({ module, scope })
  const ref = React.useRef(null)

  return (
    <div className="flex w-screen h-screen bg-gray-100">
      <div className="flex flex-col items-start px-2 py-4">
        <div className="pl-2 text-xs text-gray-400">Apps</div>
        <button className={`h-8 rounded-xl px-2 text-left ${!scope ? 'text-gray-900' : 'text-gray-500'}`} onClick={() => setSystem({})}>
          Home
        </button>
        {modules
          .filter((x) => x.scope !== 'vue')
          .map((app) => (
            <button
              key={app.label}
              className={`h-8 rounded-xl px-2 text-left ${scope === app.scope ? 'text-gray-900' : 'text-gray-500'}`}
              onClick={() => setSystem({ scope: app.scope, module: app.module })}>
              {app.label}
            </button>
          ))}
        {/* Handle Vue separately */}
        <button
          className={`h-8 rounded-xl px-2 text-left text-gray-500`}
          onClick={() => {
            setSystem({})
            useDynamicVueImport({ module: 'counterMounter', scope: 'vue', ref })}
          }
        >
          Vue
        </button>
      </div>
      <div className="flex-auto p-4 bg-gray-100 border-l rounded-l-lg">
        <React.Suspense fallback="loading...">
          <div className="w-full h-full overflow-hidden bg-white shadow-2xl rounded-xl">
            <ErrorBoundary
              fallback={
                <div className="flex flex-col items-center justify-center w-full h-full bg-red-200">
                  <div className="text-lg font-medium">Something went wrong in a Remote-app</div>
                  <div className="opacity-50">
                    The error was caught by an {'<'}ErrorBoundary /{'>'} in the host app.
                  </div>
                </div>
              }>
              {scope ? <Component /> : <div ref={ref} className="grid w-full h-full text-lg font-medium place-items-center">Pick an app from the sidebar</div>}
            </ErrorBoundary>
          </div>
        </React.Suspense>
      </div>
    </div>
  )
}
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)
