/**
 *
 * Cell
 *
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Square = styled.button`
  position: relative;
  background: rgba(32, 191, 85, 1);
  min-width: 54px;
  max-width: 54px;
  min-height: 54px;
  max-height: 54px;
  border-bottom: 1px solid #07a63c;
  border-right: 1px solid #07a63c;
  cursor: default;
  user-select: none;
  display: inline-block;
  margin: 0;
  cursor: ${(props) => (props.refreshingGameState ? 'wait' : 'pointer')};
  &:hover {
    background: ${(props) => (!props.disabled ? 'rgba(1, 186, 239, 1)' : '')};
  }
`;

const Disk = styled.div`
  width: 44px;
  height: 44px;
  position: absolute;
  border-radius: 100%;
  top: 5px;
  left: 5px;
`;

const BlackDisk = Disk.extend`
  background: rgba(117, 117, 117, 1);
`;

const WhiteDisk = Disk.extend`
  background: rgba(251, 251, 255, 1);
`;

const CELL_STATES = Object.freeze({
  empty: '_',
  black: 'B',
  white: 'W',
});

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.handleResetButton = this.handleResetButton.bind(this);
    this.handleBlackDisk = this.handleBlackDisk.bind(this);
    this.handleWhiteDisk = this.handleWhiteDisk.bind(this);
    this.renderDot = this.renderDot.bind(this);
    this.cellClicked = this.cellClicked.bind(this);
  }

  state = {
    isNew: true,
    diskColor: null,
  };

  async cellClicked() {
    const { x, y, updateGameState, refreshingGameState } = this.props;
    if (!refreshingGameState) {
      updateGameState(x, y);
    }
  }

  handleResetButton() {
    this.setState({
      isNew: true,
      diskColor: null,
    });
  }

  handleBlackDisk() {
    this.setState({
      isNew: false,
      diskColor: 'black',
    });
  }

  handleWhiteDisk() {
    this.setState({
      isNew: false,
      diskColor: 'white',
    });
  }

  renderDot() {
    const { value } = this.props;
    let item;
    switch (value) {
      case CELL_STATES.black:
        item = <BlackDisk />;
        break;
      case CELL_STATES.white:
        item = <WhiteDisk />;
        break;
      default:
        item = null;
    }
    return item;
  }

  render() {
    const { value, refreshingGameState } = this.props;
    return (
      <Square
        disabled={value !== '_'}
        onClick={this.cellClicked}
        refreshingGameState={refreshingGameState}
      >
        {this.renderDot()}
      </Square>
    );
  }
}

Cell.propTypes = {
  value: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  updateGameState: PropTypes.func.isRequired,
  refreshingGameState: PropTypes.bool.isRequired,
};

export default Cell;
