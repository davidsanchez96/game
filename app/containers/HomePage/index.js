/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import Board from 'components/Board';
import {
  Container,
  Grid,
  Header,
  Button,
  Icon,
  Label,
} from 'semantic-ui-react';

export default class HomePage extends React.PureComponent {
  state = {};

  render() {
    return (
      <Container style={{ marginTop: '10px' }}>
        <Grid textAlign="center" columns={2} doubling>
          <Grid.Row>
            <Header size="huge">Reversi Game</Header>
          </Grid.Row>
          <Grid.Row>
            <Board />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button as="div" labelPosition="left">
                <Label basic pointing="right">
                  64
                </Label>
                <Button icon basic>
                  White
                  <Icon inverted color="grey" name="circle" />
                </Button>
              </Button>
            </Grid.Column>

            <Grid.Column>
              <Button as="div" labelPosition="right">
                <Button icon basic>
                  <Icon name="circle" />
                  Black
                </Button>
                <Label basic pointing="left">
                  64
                </Label>
              </Button>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Button basic color="blue" content="Restart" icon="refresh" />
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
