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
  UsersIcon,
  FileUploadIcon,
  TruckIcon,
  TransferOutIcon,
  ChartLineIcon,
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
  { header: "Fuel Station Management" },
  {
    title: "Stations",
    icon: BuildingStoreIcon,
    to: "/stations",
  },
  {
    title: "Fuel Pumps",
    icon: GasStationIcon,
    to: "/fuelpumps",
  },
  {
    title: "Fuel Tankers",
    icon: TruckIcon,
    to: "/fueltankers",
  },
  {
    title: "Fuel Sales",
    icon: ChartLineIcon,
    to: "/fuelsales",
  },
  {
    title: "Fuel Transfers",
    icon: TransferOutIcon,
    to: "/fueltransfers",
  },
  { header: "Staff Management" },
  {
    title: "Tanker Drivers",
    icon: UsersIcon,
    to: "/tankerdrivers",
  },
  {
    title: "Attendants",
    icon: UsersIcon,
    to: "/attendants",
  },
  {
    title: "Owners",
    icon: UsersIcon,
    to: "/owners",
  },
  { header: "Accounting" },
  {
    title: "Transactions",
    icon: ReportMoneyIcon,
    to: "/transactions",
  },
  {
    title: "Documents",
    icon: FileUploadIcon,
    to: "/documents",
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
