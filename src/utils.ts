import interpolate from 'color-interpolate';
import { Dimensions } from 'react-native';

export const { width } = Dimensions.get('window');
export const { PI, cos, sin } = Math;
export const colors = ['#206374', '#2bc3ee'];
export const palette = interpolate(colors);
export const size = width * 0.5;
export const strokeWidth = 20;
export const radius = size / 2 - strokeWidth / 2;
export const cx = size / 2;
export const cy = size / 2;
export const x = (α: number) => cx - radius * cos(α);
export const y = (α: number) => cy - radius * sin(α);
export const A = PI * 2;
export const sampling = 2;
export const step = A / sampling;
export const arcs: string[] = new Array(sampling).fill(0).map((_, i) => {
  const a = i * step;
  return `M ${x(a)} ${y(a)} A ${radius} ${radius} 0 0 1 ${x(a + step)} ${y(a + step)}`;
});
export const circumference = 2 * Math.PI * radius;
