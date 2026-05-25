import { Outlet } from 'react-router-dom'
import DashboadLayout from './DashboadLayout'

const MainLayout = () => {
  return (
    <DashboadLayout>
      <Outlet />
    </DashboadLayout>
  )
}

export default MainLayout