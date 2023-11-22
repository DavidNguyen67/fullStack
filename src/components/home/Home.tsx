import React from 'react';
import { connect } from 'react-redux';
import {
  decreaseCounter,
  increaseCounter,
} from '../../redux/actions/counterActions';

interface HomeProps {
  count: number;
  increaseCounter: () => void;
  decreaseCounter: () => void;
}

class Home extends React.Component<HomeProps> {
  render(): React.ReactNode {
    const { count, increaseCounter, decreaseCounter } = this.props;

    return (
      <>
        <div className="App">
          <div>Count: {count}</div>

          <button onClick={increaseCounter}>Increase Count</button>

          <button onClick={decreaseCounter}>Decrease Count</button>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    count: state.counter.count,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    increaseCounter: () => dispatch(increaseCounter()),
    decreaseCounter: () => dispatch(decreaseCounter()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
