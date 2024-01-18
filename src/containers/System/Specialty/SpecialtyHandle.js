import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavigatorPage from '../../../components/NavigatorPage/NavigatorPage';
import { FormattedMessage } from 'react-intl';
import Pagination from 'react-js-pagination';
import { deleteSpecialty, readSpecialty } from '../../../services/userService';
import Lightbox from 'react-image-lightbox';
import { toast } from 'react-toastify';
import ModalSpecialty from './ModalSpecilty';

class SpecialtyHandle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      specialties: [],
      totalCount: 0,
      persistSpecialties: [],

      isOpenModal: false,
      specialtyId: 0,
    };
  }
  async componentDidMount() {
    const { activePage } = this.state;
    const response = await readSpecialty(activePage);

    if (response && response.data) {
      this.setState({
        specialties: response?.data?.specialties?.map((item) => ({
          ...item,
          isShow: false,
        })),
        totalCount: response.data?.totalCount,
      });
    }
  }
  async handlePageChange(pageNumber) {
    let newState = { activePage: pageNumber };
    const response = await readSpecialty(pageNumber);
    if (response && response.data) {
      newState = {
        ...newState,
        specialties: response.data?.specialties?.map((item) => ({
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
      const specialties = prevState.specialties.map((item) =>
        item.id === id ? { ...item, isShow: true } : { ...item }
      );
      return {
        ...prevState,
        specialties,
      };
    });
  };
  handleCloseLightBox = (id) => {
    this.setState((prevState) => {
      const specialties = prevState.specialties.map((item) =>
        item.id === id ? { ...item, isShow: false } : { ...item }
      );
      return {
        ...prevState,
        specialties,
      };
    });
  };

  handleClickDelete = async (id) => {
    let persistIndex = 0;
    let newSpecialties = this.state.specialties.filter(
      (item) => item.id !== id
    );
    let persistSpecialties = this.state.specialties.filter((item, index) => {
      item.id === id && (persistIndex = index);
      return item.id === id;
    });
    this.setState({
      specialties: newSpecialties,
      persistSpecialties,
    });
    const undoJob = setTimeout(async () => {
      const response = await deleteSpecialty(id);
      if (response.status === 200) {
        toast.success('oke');
        persistSpecialties = [];
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
        specialties: insert(
          newSpecialties,
          persistIndex,
          ...persistSpecialties
        ),
      }));
    };

    toast.info(
      <>
        Do you wanna undo <button onClick={clear}>Undo</button>
      </>
    );
  };

  toggleModal = () => {
    this.setState({ isOpenModal: !this.state.isOpenModal });
  };

  handleClickUpdate = (id) => {
    this.toggleModal();
    this.setState({ specialtyId: id });
  };
  render() {
    const { specialties, totalCount, isOpenModal, specialtyId } = this.state;
    return (
      <>
        <NavigatorPage onlyShowGoBack={true} />
        <div className="row">
          {specialties.length > 0 && (
            <>
              <div className="col-12" key={1}>
                <table className="table">
                  <thead className="thead-dark" key={2}>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Image</th>
                      <th scope="col">Name</th>
                      <th scope="col">Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specialties.map((item, index) => {
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
        <ModalSpecialty
          isOpenModal={isOpenModal}
          toggleModal={this.toggleModal}
          specialtyId={specialtyId}
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

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyHandle);
