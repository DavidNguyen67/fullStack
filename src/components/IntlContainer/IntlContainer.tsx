import { IntlProvider } from 'react-intl';
import { keyRootReducers, useAppSelector } from '../../redux';
import { PropsWithChildren } from 'react';

const IntlContainer = (props: PropsWithChildren) => {
  const { lang, locale } = useAppSelector(
    (state: keyRootReducers) => state.locate
  );

  return (
    <IntlProvider locale={locale} messages={lang}>
      {props.children}
    </IntlProvider>
  );
};

export default IntlContainer;
