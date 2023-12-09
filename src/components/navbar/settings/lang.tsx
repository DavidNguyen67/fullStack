import Box from '@mui/material/Box';
import { VN, EN, FR } from '../../../redux/type';
import Vietnamese from '../../../lang/vn.json';
import English from '../../../lang/en.json';
import French from '../../../lang/fr.json';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useIntl } from 'react-intl';
import {
  keyRootReducers,
  useAppDispatch,
  useAppSelector,
} from '../../../redux';
import { LocateState } from '../../../utils/interfaces/redux.interface';
import { changeLang } from '../../../redux/actions/locates.action';

export default function Locales() {
  const dataLanguages = [
    {
      locale: VN,
      lang: Vietnamese,
    },
    {
      locale: EN,
      lang: English,
    },
    {
      locale: FR,
      lang: French,
    },
  ];
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { locale } = useAppSelector((state: keyRootReducers) => state.locate);

  const handleChange = (event: any) => {
    dispatch(changeLang(event.target.value));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">
          {intl.formatMessage({ id: 'menu.dropdown.languages' })}
        </InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          label={intl.formatMessage({ id: 'menu.dropdown.languages' })}
          onChange={handleChange}
          value={locale}
        >
          {dataLanguages.map((data: LocateState) => (
            <MenuItem key={data.locale} value={data.locale}>
              {data.locale}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
