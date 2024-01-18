import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class NavigatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goBack = () => {
    const { history } = this.props;
    if (history) history.goBack();
  };
  navigateToDelete = () => {
    const { history } = this.props;
    const { location } = history;
    if (history) history.push(`${location.pathname}/handle`);
  };
  // navigateToUpdate = () => {
  //   const { history } = this.props;
  //   const { location } = history;
  //   if (history) history.push(`${location.pathname}/handle`);
  // };
  render() {
    return (
      <div className="d-flex mt-2">
        <button className="btn btn-warning" onClick={this.goBack}>
          Go back
        </button>
        {!this.props.onlyShowGoBack && (
          <>
            <button
              className="btn btn-danger mx-2"
              onClick={this.navigateToDelete}
            >
              Handle
            </button>
          </>
        )}
      </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NavigatorPage));
