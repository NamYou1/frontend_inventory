import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BellIcon } from "lucide-react";
import { NavUser } from "./nav-user";
import { useTranslation } from "react-i18next";

export function SiteHeader() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "km" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{i18n.t('documents')}</h1>
        <div className="ml-auto flex items-center gap-4">
          {/* Notification bell */}
          <button
            className="p-2 rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label={i18n.t('notifications')}
          >
            <BellIcon className="size-5" />
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-md bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent-foreground hover:text-sidebar-accent transition-colors"
          >
            {i18n.language === "en" ? i18n.t('language_km') : i18n.t('language_en')}
          </button>

          {/* Profile dropdown */}
          <NavUser user={{ name: "User", email: "user@example.com", avatar: "" }} />
        </div>
      </div>
    </header>
  );
}
