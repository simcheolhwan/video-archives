import React from 'react'
import routes from '../routes'
import './AppMain.css'

const AppMain = () => {
  return (
    <main className="AppMain">
      <div className="PageWrapper">
        {routes}
      </div>
    </main>
  )
}

export default AppMain
