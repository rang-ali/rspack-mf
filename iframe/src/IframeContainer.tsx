import React from 'react'
import './index.scss'

const IframeContainer = () => {
  return (
    <iframe
      style={{
        width: "100%",
        height: '100%',
      }}
      src="https://codesandbox.io/p/sandbox/react-new?file=/src/index.js"
    ></iframe>
  )
}

export default IframeContainer
