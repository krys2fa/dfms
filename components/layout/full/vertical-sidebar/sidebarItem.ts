import {
  ApertureIcon,
  CopyIcon,
  LayoutDashboardIcon,
  LoginIcon,
  MoodHappyIcon,
  TypographyIcon,
  UserPlusIcon,
  ReportMoneyIcon,
  ReportIcon,
  ManualGearboxIcon,
  SettingsIcon,
  GasStationIcon,
  BuildingStoreIcon,
} from "vue-tabler-icons";

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    to: "/dashboard",
  },
  {
    title: "Stations",
    icon: BuildingStoreIcon,
    to: "/stations",
  },
  {
    title: "Fuel Types",
    icon: GasStationIcon,
    to: "/fueltypes",
  },
  {
    title: "Transactions",
    icon: ReportMoneyIcon,
    to: "/transactions",
  },
  {
    title: "Reports",
    icon: ReportIcon,
    to: "/reports",
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    to: "/settings",
  },
  //   { header: "Home" },
  //   {
  //     title: "Dashboard",
  //     icon: LayoutDashboardIcon,
  //     to: "/",
  //   },
  //   { header: "utilities" },
  //   {
  //     title: "Typography",
  //     icon: TypographyIcon,
  //     to: "/ui/typography",
  //   },
  //   {
  //     title: "Shadow",
  //     icon: CopyIcon,
  //     to: "/ui/shadow",
  //   },
  //   { header: "auth" },
  //   {
  //     title: "Login",
  //     icon: LoginIcon,
  //     to: "/auth/login",
  //   },
  //   {
  //     title: "Register",
  //     icon: UserPlusIcon,
  //     to: "/auth/register",
  //   },
  //   { header: "Extra" },
  //   {
  //     title: "Icons",
  //     icon: MoodHappyIcon,
  //     to: "/icons",
  //   },
  //   {
  //     title: "Sample Page",
  //     icon: ApertureIcon,
  //     to: "/sample-page",
  //   },
];

export default sidebarItem;
