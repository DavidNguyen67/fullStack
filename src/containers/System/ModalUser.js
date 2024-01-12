import React, { useEffect, useState } from 'react';
import './userManage.scss';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  CommonUtils,
  LANGUAGES,
  LanguageUtils,
  MAX_FILE_SIZE,
} from '../../utils';
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
import Select from 'react-select';

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
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [roleId, setRoleId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [positionId, setPositionId] = useState('');
  const [image, setImage] = useState('');
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  const { language: lang } = useSelector((state) => state.app);
  const { isError, isLoading, genders, positions, roles } = useSelector(
    (state) => state.admin
  );
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
          genderData,
          roleData,
          positionData,
        } = props?.user;

        setId(initId || '');
        setEmail(initEmail || '');
        setFirstName(initFirstName || '');
        setLastName(initLastName || '');
        setAddress(initAddress || '');
        setPhoneNumber(initPhoneNumber || '');
        setGender(
          {
            value: genderData?.keyMap,
            label:
              lang === LANGUAGES.VI ? genderData?.valueVi : genderData?.valueEn,
          } || {
            value: genders[0]?.keyMap,
            label:
              lang === LANGUAGES.VI ? genders[0]?.valueVi : genders[0]?.valueEn,
          }
        );
        setRoleId(
          {
            value: roleData?.keyMap,
            label:
              lang === LANGUAGES.VI ? roleData?.valueVi : roleData?.valueEn,
          } || {
            value: roles[0]?.keyMap,
            label:
              lang === LANGUAGES.VI ? roles[0]?.valueVi : roles[0]?.valueEn,
          }
        );
        setPositionId(
          {
            value: positionData?.keyMap,
            label:
              lang === LANGUAGES.VI
                ? positionData?.valueVi
                : positionData?.valueEn,
          } || {
            value: positions[0]?.keyMap,
            label:
              lang === LANGUAGES.VI
                ? positions[0]?.valueVi
                : positions[0]?.valueEn,
          }
        );
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

    password: (event) => {
      setPassword(event.target.value);
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

    genderKey: (selectedGender) => {
      setGender(selectedGender);
    },

    roleKey: (selectedRole) => {
      setRoleId(selectedRole);
    },

    phoneNumber: (event) => {
      setPhoneNumber(event.target.value);
    },

    positionKey: (selectedPosition) => {
      setPositionId(selectedPosition);
    },
  };

  const submitData = async (event) => {
    event.preventDefault();

    const validateFields = (dataUser) => {
      const { email, password, firstName, lastName, phoneNumber } = dataUser;
      const { typeModal } = props;

      if (!email) {
        toast.error(<FormattedMessage id="validate.emailRequired" />);
        return false;
      }
      if (typeModal && typeModal === CREATE && !password) {
        toast.error(<FormattedMessage id="validate.passwordRequired" />);
        return false;
      }
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

      if (
        typeModal &&
        typeModal === CREATE &&
        !validator.isLength(password, { min: 6 })
      ) {
        toast.error(<FormattedMessage id="validate.passwordLength" />);
        return false;
      }

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
      gender: gender.value,
      roleId: roleId.value,
      phoneNumber,
      positionId: positionId.value,
      image,
      // image: JSON.stringify(await CommonUtils.getBase64(image[0].file)),
      password,
    };

    if (!validateFields(dataUser)) {
      return;
    }
    let result = { ...dataUser };

    let response = null;

    if (image[0] && image[0].file) {
      const file = image[0].file;
      if (!file.type.startsWith('image/') && !file.type.includes('svg')) {
        toast.error(<FormattedMessage id={'toast.NotImageFile'} />);
        return;
      }
      if (file?.size > MAX_FILE_SIZE) {
        toast.error(<FormattedMessage id={'toast.OverSizeFile'} />);
        return;
      }
    }
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
      dataUser.image = result.image;
    }

    switch (props.typeModal) {
      case COPY:
      case CREATE:
        for (const key of Object.keys(result)) {
          if (!result[key]) delete result[key];
        }
        setIsLoadingRequest(true);

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
          return;
        }
        result.email && delete result.email;
        for (const key of Object.keys(result)) {
          if (!result[key]) delete result[key];
        }
        setIsLoadingRequest(true);
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

  const listGender = genders.map((item) => {
    return {
      value: item.keyMap,
      label: lang === LANGUAGES.EN ? item.valueEn : item.valueVi,
    };
  });
  const listPosition = positions.map((item) => {
    return {
      value: item.keyMap,
      label: lang === LANGUAGES.EN ? item.valueEn : item.valueVi,
    };
  });
  const listRole = roles.map((item) => {
    return {
      value: item.keyMap,
      label: lang === LANGUAGES.EN ? item.valueEn : item.valueVi,
    };
  });
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
                  disabled={typeModal === UPDATE}
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
                  onChange={handleChangeInput.password}
                  type="password"
                  className="form-control"
                  id="inputPassword"
                  placeholder={LanguageUtils.getMessageByKey(
                    'manage-user.passwordPlaceholder',
                    lang
                  )}
                  value={password}
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
                <Select
                  value={gender}
                  name="gender"
                  onChange={handleChangeInput.genderKey}
                  options={listGender}
                  id="inputGender"
                />
              </div>
              <div className="form-group col-6 col-lg-4 position-relative">
                <label htmlFor="inputPosition" className="labelInputModal">
                  <FormattedMessage id="manage-user.position" />
                </label>
                <i className="fa fa-chevron-down position-absolute arrows"></i>
                <Select
                  value={positionId}
                  name="positionId"
                  onChange={handleChangeInput.positionKey}
                  options={listPosition}
                  id="inputPosition"
                />
              </div>
              <div className="form-group col-6 col-lg-4 position-relative">
                <label htmlFor="inputRoleId" className="labelInputModal">
                  <FormattedMessage id="manage-user.role" />
                </label>
                <i className="fa fa-chevron-down position-absolute arrows"></i>
                <Select
                  value={roleId}
                  onChange={handleChangeInput.roleKey}
                  options={listRole}
                  id="inputRoleId"
                  name="roleId"
                />
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
