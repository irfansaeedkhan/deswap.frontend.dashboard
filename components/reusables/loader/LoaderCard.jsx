import React from 'react'

function LoaderCard(data) {
  return (
    <div className={`customloaderModal ${data.loading && 'loaderopen'}`}>
    <div className="customloaderContainer">
       <div className="customloader"></div>
     </div>
     </div>
  )
}

export default LoaderCard