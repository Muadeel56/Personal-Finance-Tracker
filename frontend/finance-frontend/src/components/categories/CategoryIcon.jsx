import { resolveCategoryIcon } from '../../utils/categoryIcons';

const CategoryIcon = ({ icon, isIncome = false, className = 'h-5 w-5', style }) => {
  const Icon = resolveCategoryIcon(icon, isIncome);
  return <Icon className={className} style={style} aria-hidden="true" />;
};

export default CategoryIcon;
