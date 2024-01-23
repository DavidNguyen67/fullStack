import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavigatorPage from '../../../components/NavigatorPage/NavigatorPage';
import { FormattedMessage } from 'react-intl';
import Pagination from 'react-js-pagination';
import { deleteClinic, readClinic } from '../../../services/userService';
import Lightbox from 'react-image-lightbox';
import { toast } from 'react-toastify';
import ModalClinic from '../../Patient/Clinic/ModalClinic';

class ClinicHandle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      clinics: [],
      totalCount: 0,
      persistClinic: [],

      isOpenModal: false,
      clinicId: 0,
    };
  }
  async componentDidMount() {
    const { activePage } = this.state;
    const response = await readClinic(activePage);
    if (response && response.data) {
      this.setState({
        clinics: response.data?.clinics.map((item) => ({
          ...item,
          isShow: false,
        })),
        totalCount: response.data?.totalCount,
      });
    }
  }
  async handlePageChange(pageNumber) {
    let newState = { activePage: pageNumber };
    const response = await readClinic(pageNumber);
    if (response && response.data) {
      newState = {
        ...newState,
        clinics: response.data?.clinics.map((item) => ({
          ...item,
          isShow: false,
        })),
        totalCount: response.data?.totalCount,
      };
    }
    if (Object.keys(newState).length > 0)
      this.setState((prevState) => ({
        ...prevState,
        ...newState,
      }));
  }
  handleOpenLightBox = (id) => {
    this.setState((prevState) => {
      const clinics = prevState.clinics.map((item) =>
        item.id === id ? { ...item, isShow: true } : { ...item }
      );
      return {
        ...prevState,
        clinics,
      };
    });
  };
  handleCloseLightBox = (id) => {
    this.setState((prevState) => {
      const clinics = prevState.clinics.map((item) =>
        item.id === id ? { ...item, isShow: false } : { ...item }
      );
      return {
        ...prevState,
        clinics,
      };
    });
  };

  handleClickDelete = async (id) => {
    let persistIndex = 0;
    let newClinics = this.state.clinics.filter((item) => item.id !== id);
    let persistClinic = this.state.clinics.filter((item, index) => {
      item.id === id && (persistIndex = index);
      return item.id === id;
    });
    this.setState({
      clinics: newClinics,
      persistClinic,
    });
    const undoJob = setTimeout(async () => {
      const response = await deleteClinic(id);
      if (response.status === 200) {
        toast.success('oke');
        persistClinic = [];
      }
    }, 5000);
    const clear = () => {
      const insert = (arr, index, newItem) => [
        ...arr.slice(0, index),
        newItem,
        ...arr.slice(index),
      ];
      clearTimeout(undoJob);
      this.setState((prevState) => ({
        ...prevState,
        clinics: insert(newClinics, persistIndex, ...persistClinic),
      }));
    };

    toast.info(
      <>
        Do you wanna undo <button onClick={clear}>Undo</button>
      </>,
    );
  };

  toggleModal = () => {
    this.setState({ isOpenModal: !this.state.isOpenModal });
  };

  handleClickUpdate = (id) => {
    this.toggleModal();
    this.setState({ clinicId: id });
  };
  render() {
    const { clinics, totalCount, isOpenModal, clinicId } = this.state;
    return (
      <>
        <NavigatorPage onlyShowGoBack={true} />
        <div className="row">
          {clinics.length > 0 && (
            <>
              <div className="col-12" key={1}>
                <table className="table">
                  <thead className="thead-dark" key={2}>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Image</th>
                      <th scope="col">Name</th>
                      <th scope="col">Address</th>
                      <th scope="col">Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinics.map((item, index) => {
                      const base64 = btoa(
                        new Uint8Array(item.image?.data)?.reduce(
                          (data, byte) => data + String.fromCharCode(byte),
                          ''
                        )
                      );
                      const imageSrc = base64
                        ? `data:image/png;base64,${base64}`
                        : '';
                      return (
                        <>
                          <tr key={item.id} className="p-3">
                            <th scope="row">
                              {(this.state.activePage - 1) * 8 + index + 1}
                            </th>
                            <th
                              scope="row"
                              style={{
                                background: `url(${imageSrc}) no-repeat center top / contain`,
                              }}
                              onClick={() => this.handleOpenLightBox(item.id)}
                            ></th>
                            <th scope="row">{item.name}</th>
                            <th scope="row">{item.address}</th>
                            <th scope="row">
                              <button
                                className="btn btn-danger"
                                onClick={() => this.handleClickDelete(item.id)}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-warning"
                                onClick={() => this.handleClickUpdate(item.id)}
                              >
                                Update
                              </button>
                            </th>
                          </tr>
                          {item.isShow && (
                            <Lightbox
                              mainSrc={item.previewImgUrl || imageSrc}
                              onCloseRequest={() =>
                                this.handleCloseLightBox(item.id)
                              }
                            />
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col-12" key={3}>
                <div className="d-flex justify-content-end mt-3">
                  <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={8}
                    totalItemsCount={totalCount}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <ModalClinic
          isOpenModal={isOpenModal}
          toggleModal={this.toggleModal}
          clinicId={clinicId}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ClinicHandle);
