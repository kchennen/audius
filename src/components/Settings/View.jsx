import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  MenuItem,
  Select,
  Typography,
  Table,
  TableCell,
  TableBody,
  TableRow,
  Button
} from '@material-ui/core';

import TopAppBar from '../TopAppBar';

const settings = window.require('electron-settings');

const styles = theme => ({
  table: {
    width: '80%',
    border: 'none',
    marginTop: 50,
    marginLeft: -20
  },
  tablerow: {
    border: 'none'
  },
  text: {
    fontSize: 16,
    fontWeight: 500
  }
});

class Settings extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.selectDirectory = this.selectDirectory.bind(this)
  }

  state = {
    defaultAudioOut: settings.get('defaultAudioOut'),
    downloadDirectory: settings.get('downloadDirectory')
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    settings.set(event.target.name, event.target.value);
  };

  selectDirectory = () => {
    const { BrowserWindow, dialog } = window.require('electron').remote;
    dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
      properties: ['openDirectory']
    }, (path) => {
      if (path) {
        this.setState({ downloadDirectory: path[0] });
        settings.set('downloadDirectory', path[0]);
      }
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{disply: 'block', width: '87%', margin: 'auto', marginTop: 10, textAlign: 'left'}}>
        <Typography variant="display1" style={{color: 'hsl(348, 100%, 61%)', fontSize: '18', marginBottom: 10}}>
          Settings
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell className={classes.tablerow}><Typography className={classes.text}>Download Format</Typography></TableCell>
              <TableCell className={classes.tablerow}>
                <Select
                  value={this.state.defaultAudioOut}
                  onChange={this.handleChange}
                  name="defaultAudioOut">
                  <MenuItem value={'mp3'}>MP3</MenuItem>
                  <MenuItem value={'m4a'}>M4A</MenuItem>
                </Select>
              </TableCell>
              <TableCell className={classes.tablerow}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tablerow}><Typography className={classes.text}>Download Location</Typography></TableCell>
              <TableCell className={classes.tablerow}><Typography>{this.state.downloadDirectory}</Typography></TableCell>
              <TableCell className={classes.tablerow}><Button variant="raised" onClick={this.selectDirectory} size="small" color="primary">Change</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
