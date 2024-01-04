import React, { useEffect, useState } from 'react';
import './userManage.scss';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch, useSelector } from 'react-redux';
import { CommonUtils, LanguageUtils, MAX_FILE_SIZE } from '../../utils';
import * as actions from './../../store/actions';
import validator from 'validator';
import { toast } from 'react-toastify';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import {
  createNewUserService,
  updateUsersService,
} from '../../services/userService';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

const COPY = 'COPY';
const UPDATE = 'UPDATE';
const CREATE = 'CREATE';
const DELETE = 'DELETE';
const READ = 'READ';

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

function ModalUser(props) {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [roleId, setRoleId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [positionId, setPositionId] = useState('');
  const [image, setImage] = useState('');
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  const { language: lang } = useSelector((state) => state.app);
  const {
    isError,
    isLoading,
    genders,
    positions,
    roles,
    statusCode,
    isSuccessCreate,
    isErrorCreate,
    isSuccessRead,
    isErrorRead,
    isSuccessUpdate,
    isErrorUpdate,
    isSuccessDelete,
    isErrorDelete,
  } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const fetchFormInput = () => {
    genders.length < 1 && dispatch(actions.fetchGenderStart());
    positions.length < 1 && dispatch(actions.fetchPositionStart());
    roles.length < 1 && dispatch(actions.fetchRoleStart());
  };

  useEffect(() => {
    fetchFormInput();
  }, []);

  useEffect(() => {
    try {
      if (props?.user) {
        const {
          id: initId,
          email: initEmail,
          firstName: initFirstName,
          lastName: initLastName,
          address: initAddress,
          phoneNumber: initPhoneNumber,
          gender,
          roleId,
          positionId,
        } = props?.user;

        setId(initId || '');
        setEmail(initEmail || '');
        setFirstName(initFirstName || '');
        setLastName(initLastName || '');
        setAddress(initAddress || '');
        setPhoneNumber(initPhoneNumber || '');
        setGender(gender || genders[0]?.key);
        setRoleId(roleId || roles[0]?.key);
        setPositionId(positionId || positions[0]?.key);
      }
    } catch (error) {
      console.log(error);
    }
    return () => {
      setId('');
      setEmail('');
      setFirstName('');
      setLastName('');
      setAddress('');
      setPhoneNumber('');
      setGender('');
      setRoleId('');
      setPositionId('');
      setImage('');
    };
  }, [props.user]);

  const handleChangeInput = {
    email: (event) => {
      setEmail(event.target.value);
    },

    firstName: (event) => {
      setFirstName(event.target.value);
    },

    lastName: (event) => {
      setLastName(event.target.value);
    },

    address: (event) => {
      setAddress(event.target.value);
    },

    genderKey: (event) => {
      setGender(event.target.value);
    },

    roleKey: (event) => {
      setRoleId(event.target.value);
    },

    phoneNumber: (event) => {
      setPhoneNumber(event.target.value);
    },

    positionKey: (event) => {
      setPositionId(event.target.value);
    },
  };

  const submitData = async (event) => {
    event.preventDefault();
    setIsLoadingRequest(true);
    const validateFields = (dataUser) => {
      const { email, password, firstName, lastName, phoneNumber } = dataUser;

      if (!email) {
        toast.error(<FormattedMessage id="validate.emailRequired" />);
        return false;
      }
      // if (!password) {
      //   toast.error(<FormattedMessage id="validate.passwordRequired" />);
      //   return false;
      // }
      if (!firstName) {
        toast.error(<FormattedMessage id="validate.firstNameRequired" />);
        return false;
      }
      if (!lastName) {
        toast.error(<FormattedMessage id="validate.lastNameRequired" />);
        return false;
      }

      if (!validator.isEmail(email)) {
        toast.error(<FormattedMessage id="validate.emailInvalid" />);
        return false;
      }

      // if (!validator.isLength(password, { min: 6 })) {
      //   toast.error(<FormattedMessage id="validate.passwordLength" />);
      //   return false;
      // }

      if (validator.isNumeric(firstName) || validator.isNumeric(lastName)) {
        toast.error(<FormattedMessage id="validate.nameCharacters" />);
        return false;
      }

      if (
        phoneNumber &&
        !validator.isMobilePhone(phoneNumber, 'any', { strictMode: false })
      ) {
        toast.error(<FormattedMessage id="validate.phoneNumberInvalid" />);
        return false;
      }

      return true;
    };

    const dataUser = {
      id,
      email,
      firstName,
      lastName,
      address,
      gender,
      roleId,
      phoneNumber,
      positionId,
      // image: JSON.stringify(await CommonUtils.getBase64(image[0].file)),
      password: 'admin',
    };
    if (!validateFields(dataUser)) {
      return;
    }
    let result = { ...dataUser };
    let response = null;

    if (image[0] && image[0].file) {
      const file = image[0].file;
      if (!file.type.startsWith('image/')) {
        toast.error(<FormattedMessage id={'toast.NotImageFile'} />);
        setIsLoadingRequest(false);
        return;
      }
      if (file?.size > MAX_FILE_SIZE) {
        toast.error(<FormattedMessage id={'toast.OverSizeFile'} />);
        setIsLoadingRequest(false);
        return;
      }
    }
    switch (props.typeModal) {
      case COPY:
      case CREATE:
        if (image[0] && image[0].file) {
          const file = image[0].file;

          if (image[0].data && image[0].type)
            result.image = btoa(
              new Uint8Array(image[0].data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
          else result.image = await CommonUtils.getBase64(file);
        }

        response = await createNewUserService([result]);
        if (
          response.status === 500 ||
          response.data?.statusCode === 500 ||
          response.statusCode === 500
        ) {
          toast.error(<FormattedMessage id={`toast.InternalError`} />);
          setIsLoadingRequest(false);
          return;
        }
        if (response.statusCode === 200 || response.status === 200) {
          toast.success(
            <FormattedMessage
              id="toast.successCreateUser"
              values={{
                br: <br />,
              }}
              tagName="div"
            />
          );
          props.toggleModal();
          setIsLoadingRequest(false);
          dispatch(actions.readUsers());
          return;
        }
        if (response.statusCode === 409 || response.status === 409) {
          toast.error(
            <FormattedMessage
              id="toast.conflictEmail"
              values={{
                br: <br />,
              }}
              tagName="div"
            />
          );
          setIsLoadingRequest(false);
          return;
        }
        toast.error(
          <FormattedMessage
            id="toast.errorUpdateUser"
            values={{
              br: <br />,
            }}
            tagName="div"
          />
        );
        setIsLoadingRequest(false);
        return;
      case UPDATE:
        dataUser.password && delete dataUser.password;
        Object.keys(dataUser).forEach((key) => {
          if (
            key === 'id' ||
            (dataUser[key] !== props.user[key] && dataUser[key])
          ) {
            result = { ...result, [key]: dataUser[key] };
            return;
          }
        });
        if (Object.keys(result).length < 2) {
          setIsLoadingRequest(false);
          return;
        }
        response = await updateUsersService([result]);
        if (!response || Object.keys(response).length < 1) {
          toast.error(
            <FormattedMessage
              id="toast.cantConnectToServer"
              values={{
                br: <br />,
              }}
              tagName="div"
            />
          );
        }
        if (response.statusCode === 200 || response.status === 200) {
          toast.success(
            <FormattedMessage
              id="toast.successUpdateUser"
              values={{
                br: <br />,
              }}
              tagName="div"
            />
          );
          props.toggleModal();
          setIsLoadingRequest(false);
          dispatch(actions.readUsers());
          return;
        }
        if (response.statusCode === 409 || response.status === 409) {
          toast.error(
            <FormattedMessage
              id="toast.conflictEmail"
              values={{
                br: <br />,
              }}
              tagName="div"
            />
          );
          setIsLoadingRequest(false);
          return;
        }
        toast.error(
          <FormattedMessage
            id="toast.errorUpdateUser"
            values={{
              br: <br />,
            }}
            tagName="div"
          />
        );
        setIsLoadingRequest(false);
        return;
      default:
        setIsLoadingRequest(false);
        return;
    }
  };

  const size = useWindowSize();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>Error...</>;
  }

  const { modal, toggleModal, typeModal } = props;

  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        // {...props}
        className="modal-user-container"
        centered={size.width < 576}
        // size="lg"
      >
        <ModalHeader toggle={toggleModal}>
          {/* <FormattedMessage id={props.titlebtn} /> */}
          Test
        </ModalHeader>
        <ModalBody className="model-user-body">
          <form className="col col-12 col-md-10 mx-auto">
            <div className="form-row my-2 row">
              <div
                className={
                  typeModal !== CREATE || typeModal !== COPY
                    ? 'form-group col-12 col-lg-12'
                    : 'form-group col-6 col-lg-6'
                }
              >
                <label htmlFor="inputEmail" className="labelInputModal">
                  <FormattedMessage id="manage-user.email" />
                </label>
                <input
                  onChange={handleChangeInput.email}
                  type="text"
                  className="form-control"
                  id="inputEmail"
                  placeholder={LanguageUtils.getMessageByKey(
                    'manage-user.emailPlaceholder',
                    lang
                  )}
                  value={email}
                  name="email"
                />
              </div>
              <div
                className={
                  typeModal === UPDATE ? 'd-none' : 'form-group  col-12'
                }
              >
                <label htmlFor="inputPassword" className="labelInputModal">
                  <FormattedMessage id="manage-user.password" />
                </label>
                <input
                  // onChange={handleChangeInput.}
                  type="password"
                  className="form-control"
                  id="inputPassword"
                  placeholder={LanguageUtils.getMessageByKey(
                    'manage-user.passwordPlaceholder',
                    lang
                  )}
                  // value={password}
                  name="password"
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="inputFirstName" className="labelInputModal">
                  <FormattedMessage id="manage-user.firstName" />
                </label>
                <input
                  onChange={handleChangeInput.firstName}
                  type="text"
                  className="form-control"
                  id="inputFirstName"
                  placeholder={LanguageUtils.getMessageByKey(
                    'manage-user.firstNamePlaceholder',
                    lang
                  )}
                  name="firstName"
                  value={firstName}
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="inputLastName" className="labelInputModal">
                  <FormattedMessage id="manage-user.lastName" />
                </label>
                <input
                  onChange={handleChangeInput.lastName}
                  type="text"
                  className="form-control"
                  id="inputLastName"
                  placeholder={LanguageUtils.getMessageByKey(
                    'manage-user.lastNamePlaceholder',
                    lang
                  )}
                  name="lastName"
                  value={lastName}
                />
              </div>
            </div>
            <div className="form-row my-2 row">
              <div className="form-group col-12">
                <label htmlFor="inputAddress" className="labelInputModal">
                  <FormattedMessage id="manage-user.address" />
                </label>
                <input
                  onChange={handleChangeInput.address}
                  type="text"
                  className="form-control"
                  id="inputAddress"
                  placeholder={LanguageUtils.getMessageByKey(
                    'manage-user.addressPlaceholder',
                    lang
                  )}
                  name="address"
                  value={address || ''}
                />
              </div>
              <div className="form-group col-6 col-lg-12">
                <label htmlFor="inputPhoneNumber" className="labelInputModal">
                  <FormattedMessage id="manage-user.phoneNumber" />
                </label>
                <input
                  onChange={handleChangeInput.phoneNumber}
                  type="text"
                  name="phoneNumber"
                  className="form-control col-6 col-lg-3"
                  id="inputPhoneNumber"
                  placeholder={LanguageUtils.getMessageByKey(
                    'manage-user.phoneNumberPlaceholder',
                    lang
                  )}
                  value={phoneNumber || ''}
                />
              </div>
              <div className="form-group col-6 col-lg-4 position-relative">
                <label htmlFor="inputGender" className="labelInputModal">
                  <FormattedMessage id="manage-user.gender" />
                </label>
                <i className="fa fa-chevron-down position-absolute arrows"></i>
                <select
                  id="inputGender"
                  className="form-control"
                  name="gender"
                  onChange={handleChangeInput.genderKey}
                >
                  {genders?.length > 0 &&
                    genders.map((item, index) => (
                      <option
                        key={item.id}
                        defaultChecked={item.key === gender}
                        value={item.key}
                      >
                        {lang.toLowerCase() === 'en'
                          ? item.valueEn
                          : item.valueVi}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-6 col-lg-4 position-relative">
                <label htmlFor="inputPosition" className="labelInputModal">
                  <FormattedMessage id="manage-user.position" />
                </label>
                <i className="fa fa-chevron-down position-absolute arrows"></i>
                <select
                  id="inputPosition"
                  className="form-control"
                  name="position"
                  onChange={handleChangeInput.positionKey}
                >
                  {positions?.length > 0 &&
                    positions.map((item, index) => (
                      <option
                        key={item.id}
                        defaultChecked={item.key === positionId}
                        value={item.key}
                      >
                        {lang.toLowerCase() === 'en'
                          ? item.valueEn
                          : item.valueVi}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-6 col-lg-4 position-relative">
                <label htmlFor="inputRoleId" className="labelInputModal">
                  <FormattedMessage id="manage-user.role" />
                </label>
                <i className="fa fa-chevron-down position-absolute arrows"></i>
                <select
                  id="inputRoleId"
                  className="form-control"
                  name="role"
                  onChange={handleChangeInput.roleKey}
                >
                  {roles?.length > 0 &&
                    roles.map((item, index) => {
                      return (
                        <option
                          key={item.id}
                          defaultChecked={roleId === item.key}
                          value={item.key}
                        >
                          {lang.toLowerCase() === 'en'
                            ? item.valueEn
                            : item.valueVi}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
            <div className="form-row my-2 row">
              <div className="form-group col-12 inputImage-container mt-2">
                <label
                  htmlFor="filepond--browser-bsdrbpvlg"
                  className="labelInputModal"
                >
                  <FormattedMessage id="manage-user.image" />
                </label>
                <FilePond
                  files={image}
                  onupdatefiles={setImage}
                  acceptedFileTypes={'image/*'}
                  allowReplace
                  maxFiles={1}
                  // server="/api"
                  name="file1"
                  labelIdle={LanguageUtils.getMessageByKey(
                    'manage-user.filePlaceholder',
                    lang
                  )}
                />
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={submitData}
            disabled={isLoadingRequest}
          >
            <FormattedMessage id="manage-user.save" />
          </button>
          <button className="btn btn-secondary" onClick={toggleModal}>
            <FormattedMessage id="button.cancel" />
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    lang: state.app.language,
    genders: state.admin.genders,
    roles: state.admin.roles,
    positions: state.admin.positions,
    isLoading: state.admin.isLoading,
    isError: state.admin.isError,
    isErrorCreate: state.admin.isErrorCreate,
    isErrorUpdate: state.admin.isErrorUpdate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readUsers: (id) => dispatch(actions.readUsers(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
