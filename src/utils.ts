import { Dimensions } from 'react-native';

export const { width: WINDOW_WIDTH } = Dimensions.get('window');
export const { PI, cos, sin } = Math;
export const A = 2 * PI;
export const sampling = 2;
export const step = A / sampling;
