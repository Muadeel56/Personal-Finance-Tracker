import {
  BanknotesIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  TruckIcon,
  HomeIcon,
  HeartIcon,
  FilmIcon,
  GiftIcon,
  PaperAirplaneIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  BoltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  PaintBrushIcon,
  BookOpenIcon,
  MusicalNoteIcon,
  TicketIcon,
  CakeIcon,
  WrenchScrewdriverIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

export const CATEGORY_ICON_OPTIONS = [
  { id: 'banknotes', label: 'Money', Icon: BanknotesIcon },
  { id: 'currency-dollar', label: 'Dollar', Icon: CurrencyDollarIcon },
  { id: 'shopping-bag', label: 'Shopping', Icon: ShoppingBagIcon },
  { id: 'cake', label: 'Food', Icon: CakeIcon },
  { id: 'truck', label: 'Transport', Icon: TruckIcon },
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'heart', label: 'Health', Icon: HeartIcon },
  { id: 'film', label: 'Entertainment', Icon: FilmIcon },
  { id: 'gift', label: 'Gifts', Icon: GiftIcon },
  { id: 'paper-airplane', label: 'Travel', Icon: PaperAirplaneIcon },
  { id: 'academic-cap', label: 'Education', Icon: AcademicCapIcon },
  { id: 'building-office', label: 'Office', Icon: BuildingOffice2Icon },
  { id: 'bolt', label: 'Utilities', Icon: BoltIcon },
  { id: 'device-phone-mobile', label: 'Mobile', Icon: DevicePhoneMobileIcon },
  { id: 'computer-desktop', label: 'Tech', Icon: ComputerDesktopIcon },
  { id: 'puzzle-piece', label: 'Games', Icon: PuzzlePieceIcon },
  { id: 'trophy', label: 'Sports', Icon: TrophyIcon },
  { id: 'paint-brush', label: 'Creative', Icon: PaintBrushIcon },
  { id: 'book-open', label: 'Books', Icon: BookOpenIcon },
  { id: 'musical-note', label: 'Music', Icon: MusicalNoteIcon },
  { id: 'ticket', label: 'Events', Icon: TicketIcon },
  { id: 'briefcase', label: 'Work', Icon: BriefcaseIcon },
  { id: 'wrench', label: 'Repairs', Icon: WrenchScrewdriverIcon },
];

const ICON_MAP = Object.fromEntries(
  CATEGORY_ICON_OPTIONS.map(({ id, Icon }) => [id, Icon])
);

export const DEFAULT_INCOME_ICON = 'banknotes';
export const DEFAULT_EXPENSE_ICON = 'shopping-bag';

export function resolveCategoryIcon(icon, isIncome = false) {
  if (icon && ICON_MAP[icon]) return ICON_MAP[icon];
  return isIncome ? BanknotesIcon : ShoppingBagIcon;
}

export function getCategoryIconLabel(icon) {
  return CATEGORY_ICON_OPTIONS.find((o) => o.id === icon)?.label ?? 'Default';
}
