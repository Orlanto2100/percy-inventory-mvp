import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ConfigProvider,
  Grid,
  Layout,
} from 'antd'
import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import Sidebar from './Sidebar'
import MobileSidebar from './MobileSidebar'
import AppHeader from './Header'

import {
  getMenuItemsForRole,
  userMenuItems,
  type Role,
} from './menuItems'

import { getPageTitle } from './pageTitles'

const { Content } = Layout
const { useBreakpoint } = Grid

function MainLayout() {
  const screens = useBreakpoint()
  const isMobile = !screens.lg

  const [drawerOpen, setDrawerOpen] =
    useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // =====================================================
  // Current user role
  // =====================================================

  const role =
    localStorage.getItem('role') as Role | null

  // =====================================================
  // Role-based navigation
  // =====================================================

  const visibleMenuItems = useMemo(() => {
    if (!role) {
      return []
    }

    return getMenuItemsForRole(role)
  }, [role])

  // =====================================================
  // Page title
  // =====================================================

  const pageTitle = t(
    getPageTitle(location.pathname),
  )

  // =====================================================
  // Render
  // =====================================================

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#334155',
        },
      }}
    >
      <Layout
        style={{
          height: '100vh',
          overflow: 'hidden',
        }}
      >

        {/* =================================================
            Navigation
            ================================================= */}

        {isMobile ? (
          <MobileSidebar
            open={drawerOpen}
            setOpen={setDrawerOpen}
            menuItems={visibleMenuItems}
          />
        ) : (
          <Sidebar
            menuItems={visibleMenuItems}
          />
        )}

        {/* =================================================
            Main Application
            ================================================= */}

        <Layout
          style={{
            minWidth: 0,
            height: '100vh',
            overflow: 'hidden',
            background: '#dfe4ea',
          }}
        >

          {/* Header */}

          <AppHeader
            isMobile={isMobile}
            setDrawerOpen={setDrawerOpen}
            pageTitle={pageTitle}
            userMenuItems={userMenuItems}
            navigate={navigate}
          />

          {/* Page Content */}

          <Content
            style={{
              padding: 24,
              minWidth: 0,
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <Outlet />
          </Content>

        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default MainLayout