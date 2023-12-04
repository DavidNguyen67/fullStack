// import UpdateModal from './updateModal';
import DeleteModal from './deleteModal';
export const style = {
  position: 'absolute' as 'absolute',
  top: '10%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '8px',
  p: 4,
};

export interface InputWrapperProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  take: number;
  page: number;
}

export { DeleteModal };
// export { UpdateModal, DeleteModal };
