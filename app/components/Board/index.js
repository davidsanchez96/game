/**
 *
 * Board
 *
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Cell from 'components/Cell';

const BoardContainer = styled.div`
  border-top: 1px solid #07a63c;
  border-left: 1px solid #07a63c;
`;

const Row = styled.div`
  display: block;
  height: 54px;
`;

class Board extends React.Component {
  renderCells() {
    const {
      boardRows,
      updateGame,
      updateGameState,
      refreshingGameState,
    } = this.props;

    return boardRows.map((row, idY) => {
      const rowKey = idY;
      return (
        <Row key={rowKey}>
          {row.map((value, idX) => {
            const cellKey = `${idX}${idY}`;
            return (
              <Cell
                key={cellKey}
                x={idX}
                y={idY}
                value={value}
                updateGame={updateGame}
                updateGameState={updateGameState}
                refreshingGameState={refreshingGameState}
              />
            );
          })}
        </Row>
      );
    });
  }

  render() {
    return <BoardContainer>{this.renderCells()}</BoardContainer>;
  }
}

Board.propTypes = {
  boardRows: PropTypes.array.isRequired,
  updateGame: PropTypes.func.isRequired,
  updateGameState: PropTypes.func.isRequired,
  refreshingGameState: PropTypes.bool.isRequired,
};

export default Board;
