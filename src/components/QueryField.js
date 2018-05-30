import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  MenuItem,
  TextField,
  Button
} from '@material-ui/core';

const { BrowserWindow } = window.require('electron').remote;
const path = require('path');

const styles = theme => ({
  container: {
    marginTop: 150
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 500
  },
  button: {
    display: 'block',
    margin: 'auto',
    marginTop: 50
  }
});

class QueryField extends React.Component {


  state = {
    query: '',
  };

  handleChange = name => event => {
    this.setState({
      query: event.target.value,
    });
  };

  handleSearch = () => {
    console.log(this.state.query);
    BrowserWindow.getFocusedWindow().loadURL(process.env.NODE_ENV == 'development' ? 'http://localhost:3000?Query&val=' + this.state.query : `file://${path.join(__dirname, '../build/index.html?Query&val=' + this.state.query)}`);
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="query"
          label="Enter Song Name, Spotify or YouTube Link"
          className={classes.textField}
          value={this.state.query}
          onChange={this.handleChange('query')}
          margin="normal"
        />
        <Button color="primary" variant="raised" onClick={this.handleSearch} className={classes.button}>
          Search
        </Button>
      </form>
    );
  }
}

QueryField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryField);
