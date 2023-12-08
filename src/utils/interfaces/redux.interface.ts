import { MessageFormatElement } from 'react-intl';

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
