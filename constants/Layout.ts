/**
 * Layout constants pro spacing, velikosti, atd.
 */
const Layout = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  minTouchSize: 44, // Minimální velikost pro touch target (iOS HIG)
};

export default Layout;
export const spacing = Layout.spacing;
export const borderRadius = Layout.borderRadius;
export const fontSize = Layout.fontSize;
export const iconSize = Layout.iconSize;
export const minTouchSize = Layout.minTouchSize;
