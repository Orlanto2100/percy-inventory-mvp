import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  ConfigProvider,
  Layout,
  Menu,
} from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type {
  SidebarMenuItem,
} from './menuItems'

const { Sider } = Layout

interface SidebarProps {
  menuItems: SidebarMenuItem[]
}

function Sidebar({
  menuItems,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

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
    // Only navigate to actual routes.
    //
    // Section keys such as:
    // inventory
    // sales
    // purchasing
    // reports
    // administration
    //
    // are submenu keys, not routes.

    if (key.startsWith('/')) {
      navigate(key)
    }
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <Sider
      collapsed={collapsed}
      trigger={null}
      width={240}
      collapsedWidth={80}
      style={{
        height: '100vh',
        flexShrink: 0,
        background: '#1f2937',
        overflow: 'hidden',
      }}
    >
      {/* =================================================
          Sidebar Header
          ================================================= */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 64,
          padding: '0 16px',
          gap: 8,
          borderBottom:
            '1px solid #334155',
          flexShrink: 0,
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() =>
            setCollapsed(
              (value) => !value,
            )
          }
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            color: '#cbd5e1',
            fontSize: 18,
          }}
        />

        {!collapsed && (
          <span
            style={{
              color: '#f8fafc',
              fontSize: 18,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {t(
              'common.inventorySystem',
            )}
          </span>
        )}
      </div>

      {/* =================================================
          Scrollable Navigation
          ================================================= */}

      <div
        style={{
          height:
            'calc(100vh - 64px)',
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

            openKeys={
              collapsed
                ? []
                : openKeys
            }

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
    </Sider>
  )
}

export default Sidebar