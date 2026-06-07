import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getCssVar } from '../utils/chartTheme';

export function useChartTheme() {
  const { theme } = useTheme();

  return useMemo(() => {
    const grid = getCssVar('--chart-grid') || getCssVar('--grid-line');
    const text = getCssVar('--chart-text') || getCssVar('--text-secondary');
    const tooltipBg = getCssVar('--chart-tooltip-bg') || getCssVar('--surface-2');
    const tooltipText = getCssVar('--text-primary');
    const border = getCssVar('--border-subtle');

    return {
      theme,
      colors: {
        grid,
        text,
        tooltipBg,
        tooltipText,
        border,
        income: getCssVar('--income'),
        expense: getCssVar('--expense'),
      },
      scales: {
        x: {
          grid: { color: grid, drawBorder: false },
          ticks: { color: text, font: { family: getCssVar('--font-body') || 'DM Sans' } },
        },
        y: {
          grid: { color: grid, drawBorder: false },
          ticks: { color: text, font: { family: getCssVar('--font-mono') || 'JetBrains Mono' } },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: text,
            font: { family: getCssVar('--font-body') || 'DM Sans' },
          },
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: text,
          borderColor: border,
          borderWidth: 1,
        },
      },
    };
  }, [theme]);
}
