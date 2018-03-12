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
import {
  Container,
  Header,
} from 'semantic-ui-react';

export default class HomePage extends React.PureComponent {
  state = {};

  render() {
    return (
      <Container style={{ marginTop: '10px' }}>
        <Header size="huge">Prueba Tecnica</Header>
      </Container>
    );
  }
}
