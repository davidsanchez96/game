/**
 *
 * Game
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Board from 'components/Board';
import {
  Container,
  Grid,
  Header,
  Button,
  Label,
  Progress,
  Segment,
} from 'semantic-ui-react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { flash } from 'react-animations';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectGame from './selectors';
import reducer from './reducer';
import saga from './saga';

const bounceAnimation = keyframes`${flash}`;

const AnimButton = styled(Button)`
  animation: ${(props) =>
    props.animate ? `4s ${bounceAnimation} infinite` : ''};
`;

const GAME_STATES = Object.freeze({
  inCourse: 'IN_COURSE',
  finalized: 'FINALIZED',
});

const INITIAL_STATE = {
  boardRows: [
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_'],
  ],
  whiteCount: 0,
  blackCount: 0,
  currentPlayer: null,
  gameState: null,
  movement: null,
  refreshingGameState: false,
  restartingGame: false,
};

export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.updateGame = this.updateGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.updateGameState = this.updateGameState.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
  }

  state = {
    ...INITIAL_STATE,
  };

  componentDidMount() {
    this.updateGame();
  }

  async updateGame() {
    const response = await axios.get(
      'http://35.163.129.163:9000/reversi/game',
      {
        params: {
          token: '32b2c7dc-328c-4568-9d43-d3eb0bc8b3af',
        },
      }
    );
    const {
      boardRows,
      whiteCount,
      blackCount,
      currentPlayer,
      gameState,
    } = response.data;
    this.setState({
      boardRows,
      whiteCount,
      blackCount,
      currentPlayer,
      gameState,
    });
  }

  async restartGame() {
    this.setState({ restartingGame: true });
    await axios.delete(
      'http://35.163.129.163:9000/reversi/game?token=32b2c7dc-328c-4568-9d43-d3eb0bc8b3af'
    );
    this.setState({ ...INITIAL_STATE });
    this.updateGame();
  }

  async updateGameState(x, y) {
    this.setState({ refreshingGameState: true });
    try {
      const response = await axios.post(
        `http://35.163.129.163:9000/reversi/game/movements?token=32b2c7dc-328c-4568-9d43-d3eb0bc8b3af&x=${x}&y=${y}`
      );
      if (response) {
        this.updateGame();
        this.setState({ movement: response.status });
      }
    } catch (error) {
      if (error.response) {
        this.setState({ movement: error.response.status });
      }
    }
    this.setState({ refreshingGameState: false });
  }

  renderMessage() {
    const {
      movement,
      gameState,
      refreshingGameState,
      blackCount,
      whiteCount,
    } = this.state;
    let message = '';
    let success = false;
    let warning = false;
    let error = false;

    if (gameState === GAME_STATES.inCourse) {
      message = 'Game in course';
      success = true;
    }

    if (movement === 204) {
      message = 'The movement was successful';
      success = true;
    }
    if (movement === 400) {
      message = 'The movement is invalid';
      error = true;
    }

    if (gameState === GAME_STATES.finalized) {
      const winner = whiteCount > blackCount ? 'White' : 'Black';
      message = `Game Finished, ${winner} player wins!`;
      warning = true;
    }

    if (refreshingGameState) {
      success = false;
      warning = false;
      error = false;
      message = 'loading';
    }

    return (
      <Segment>
        <Progress
          percent={100}
          warning={warning}
          error={error}
          success={success}
          style={{ width: 432, marginTop: 5, marginBottom: 25 }}
        >
          {message}
        </Progress>
      </Segment>
    );
  }

  render() {
    const {
      boardRows,
      whiteCount,
      blackCount,
      currentPlayer,
      gameState,
      restartingGame,
      refreshingGameState,
    } = this.state;
    return (
      <div>
        <Helmet>
          <title>Reversi Game</title>
          <meta name="description" content="Description of Game" />
        </Helmet>
        <Container style={{ marginTop: '10px' }}>
          <Grid textAlign="center" columns={2} doubling>
            <Grid.Row>
              <Header size="huge">Reversi Game</Header>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <AnimButton
                  as="div"
                  labelPosition="right"
                  size="medium"
                  animate={
                    currentPlayer === 'WHITE' &&
                    gameState !== GAME_STATES.finalized
                  }
                >
                  <Button icon basic>
                    White
                  </Button>
                  <Label as="a" basic pointing="left">
                    {whiteCount}
                  </Label>
                </AnimButton>
                <AnimButton
                  as="div"
                  labelPosition="left"
                  size="medium"
                  animate={
                    currentPlayer === 'BLACK' &&
                    gameState !== GAME_STATES.finalized
                  }
                >
                  <Label as="a" basic pointing="right" color="black">
                    {blackCount}
                  </Label>
                  <Button icon secondary>
                    Black
                  </Button>
                </AnimButton>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Board
                boardRows={boardRows}
                updateGame={this.updateGame}
                updateGameState={this.updateGameState}
                refreshingGameState={refreshingGameState}
              />
            </Grid.Row>
            <Grid.Row>{this.renderMessage()}</Grid.Row>
            <Grid.Row>
              <Button
                basic
                color="blue"
                content="Restart"
                icon="refresh"
                onClick={this.restartGame}
                loading={restartingGame}
              />
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

Game.propTypes = {};

const mapStateToProps = createStructuredSelector({
  game: makeSelectGame(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'game', reducer });
const withSaga = injectSaga({ key: 'game', saga });

export default compose(withReducer, withSaga, withConnect)(Game);
