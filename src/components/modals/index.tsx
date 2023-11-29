import UpdateModal from './updateModal';
import DeleteModal from './deleteModal';
export const style = {
  position: 'absolute' as 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export interface InputWrapperProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
}

export { UpdateModal, DeleteModal };
