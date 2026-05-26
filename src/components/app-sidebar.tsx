import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, CommandIcon, LayersIcon, PackageIcon, ScaleIcon, GitCompareIcon, ShoppingBagIcon, ArrowLeftRightIcon, FileSpreadsheetIcon, CircleDollarSignIcon } from "lucide-react"
import { getUser } from "@/utils/auth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = getUser();
  
  // Set up default fallback info
  const userName = currentUser?.username || "Guest User";
  const userEmail = currentUser?.email || "guest@acme.com";
  
  // Dynamically compute navigation based on roles
  const navItems = React.useMemo(() => {
    const roles = currentUser?.roles || [];
    
    // Store Admin (ROLE_ADMIN) sees restricted set
    if (roles.includes("ROLE_ADMIN") && !roles.includes("ROLE_SUPER_ADMIN")) {
      return [
        {
          title: "Store Management",
          url: "/store",
          icon: <CommandIcon />,
        },
        {
          title: "Stock",
          url: "/stocks",
          icon: <CommandIcon />,
        },
        {
          title: "Product Catalog",
          url: "/product",
          icon: <PackageIcon />,
        },
        {
          title: "Stock Adjustments",
          url: "/adjustment",
          icon: <GitCompareIcon />,
        },
        {
          title: "Purchase Orders",
          url: "/purchase",
          icon: <ShoppingBagIcon />,
        },
        {
          title: "Stock Transfers",
          url: "/transfer",
          icon: <ArrowLeftRightIcon />,
        },
        {
          title: "Sales Orders",
          url: "/sale",
          icon: <FileSpreadsheetIcon />,
        },
        {
          title: "POS Register",
          url: "/pos",
          icon: <CircleDollarSignIcon />,
        },
        {
          title: "Staff & Users",
          url: "/users",
          icon: <LayersIcon />,
        }
      ];
    }
    
    // Staff cashiers (ROLE_STAFF) only see Sales Orders and POS Register
    if (roles.includes("ROLE_STAFF") && !roles.includes("ROLE_ADMIN") && !roles.includes("ROLE_SUPER_ADMIN")) {
      return [
        {
          title: "Sales Orders",
          url: "/sale",
          icon: <FileSpreadsheetIcon />,
        },
        {
          title: "POS Register",
          url: "/pos",
          icon: <CircleDollarSignIcon />,
        }
      ];
    }
    
    // Super admin sees everything
    return [
      {
        title: "Dashboard",
        url: "/",
        icon: <LayoutDashboardIcon />,
      },
      {
        title: "Product Catalog",
        url: "/product",
        icon: <PackageIcon />,
      },
      {
        title: "Category",
        url: "/category",
        icon: <LayoutDashboardIcon />,
      },
      {
        title: "Subcategory",
        url: "/subcategory",
        icon: <LayersIcon />,
      },
      {
        title: "Inventory Units",
        url: "/unit",
        icon: <ScaleIcon />,
      },
      {
        title: "Stock Adjustments",
        url: "/adjustment",
        icon: <GitCompareIcon />,
      },
      {
        title: "Purchase Orders",
        url: "/purchase",
        icon: <ShoppingBagIcon />,
      },
      {
        title: "Stock Transfers",
        url: "/transfer",
        icon: <ArrowLeftRightIcon />,
      },
      {
        title: "Sales Orders",
        url: "/sale",
        icon: <FileSpreadsheetIcon />,
      },
      {
        title: "POS Register",
        url: "/pos",
        icon: <CircleDollarSignIcon />,
      },
      {
        title: "Store Management",
        url: "/store",
        icon: <CommandIcon />,
      },
      {
        title: "Staff & Users",
        url: "/users",
        icon: <LayersIcon />,
      },
      {
        title: "Security Roles",
        url: "/roles",
        icon: <CommandIcon />,
      },
      {
        title: "Permissions Explorer",
        url: "/permissions",
        icon: <LayoutDashboardIcon />,
      }
    ];
  }, [currentUser]);

  const userData = {
    name: userName,
    email: userEmail,
    avatar: "", // Will fall back to initials in avatar component
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
