import { MessageFormatElement } from 'react-intl';
import { ImageResponse } from './resImg.interface';

export interface Action {
  type: string;
  payload?: any;
}
export interface CounterState {
  value: number;
}
export interface LocateState {
  lang: Record<string, string> | Record<string, MessageFormatElement[]>;
  locale: string;
}

export interface ChangeLanAction {
  type: string;
  payload: string;
}

export interface themeReducer {
  isDarkTheme: boolean;
}

export interface SlideState {
  slides: ImageResponse[];
  error: any;
  isLoading: boolean;
}
export interface propsSlideChild {
  title: string;
  slides?: ImageResponse[];
}
