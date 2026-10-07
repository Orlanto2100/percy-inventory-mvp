import { useEffect, useMemo, useState } from 'react'
import {
  ConfigProvider,
  Drawer,
  Menu,
} from 'antd'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type {
  SidebarMenuItem,
} from './menuItems'

interface MobileSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  menuItems: SidebarMenuItem[]
}

function MobileSidebar({
  open,
  setOpen,
  menuItems,
}: MobileSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const [openKeys, setOpenKeys] = useState<string[]>([])

  // =====================================================
  // Translate menu labels
  // =====================================================

  const translatedMenuItems = useMemo(() => {
    return menuItems.map((item) => {
      if ('children' in item) {
        return {
          ...item,
          label: t(item.label),

          children: item.children.map(
            (child) => ({
              ...child,
              label: t(child.label),
            }),
          ),
        }
      }

      return {
        ...item,
        label: t(item.label),
      }
    })
  }, [menuItems, t])

  // =====================================================
  // Automatically open the section containing
  // the current route
  // =====================================================

  useEffect(() => {
    const currentSectionKeys = menuItems
      .filter(
        (item) =>
          'children' in item &&
          item.children.some(
            (child) =>
              child.key === location.pathname,
          ),
      )
      .map((item) => item.key)

    setOpenKeys((current) => {
      const merged = new Set([
        ...current,
        ...currentSectionKeys,
      ])

      return Array.from(merged)
    })
  }, [
    menuItems,
    location.pathname,
  ])

  // =====================================================
  // Navigation
  // =====================================================

  const handleMenuClick = ({
    key,
  }: {
    key: string
  }) => {
    // Parent submenu keys:
    // inventory
    // sales
    // purchasing
    // reports
    // administration
    //
    // are not routes.

    if (!key.startsWith('/')) {
      return
    }

    navigate(key)

    // Close drawer after selecting
    // an actual page.
    setOpen(false)
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <Drawer
      placement="left"
      open={open}
      onClose={() => setOpen(false)}
      closable={false}
      width={240}
      styles={{
        body: {
          padding: 0,
          background: '#1f2937',
          height: '100%',
          overflow: 'hidden',
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >

        {/* ===============================================
            Sidebar Header
            =============================================== */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 64,
            minHeight: 64,
            padding: '0 16px',
            color: '#f8fafc',
            fontSize: 18,
            fontWeight: 600,
            borderBottom:
              '1px solid #334155',
            flexShrink: 0,
          }}
        >
          {t(
            'common.inventorySystem',
          )}
        </div>

        {/* ===============================================
            Scrollable Navigation
            =============================================== */}

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  darkItemBg:
                    '#1f2937',

                  darkItemColor:
                    '#cbd5e1',

                  darkItemHoverColor:
                    '#ffffff',

                  darkItemHoverBg:
                    '#273449',

                  darkItemSelectedColor:
                    '#ffffff',

                  darkItemSelectedBg:
                    '#334155',

                  darkSubMenuItemBg:
                    '#1f2937',
                },
              },
            }}
          >
            <Menu
              mode="inline"
              theme="dark"

              items={
                translatedMenuItems
              }

              selectedKeys={[
                location.pathname,
              ]}

              openKeys={openKeys}

              onOpenChange={
                setOpenKeys
              }

              onClick={
                handleMenuClick
              }

              style={{
                borderInlineEnd: 0,
              }}
            />
          </ConfigProvider>
        </div>
      </div>
    </Drawer>
  )
}

export default MobileSidebar