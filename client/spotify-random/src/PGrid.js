import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PCard from './PCard';

export default class GuttersGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {apiResponse: ""};
  }

  getPlaylists() {
      fetch("http://localhost:8888/getplaylists")
          .then(res => res.text())
          .then(res => this.setState({apiResponse: JSON.parse(res)}))
          .catch(err => err);
  }

  componentDidMount() {
      this.getPlaylists();
  }

  render() {
    const playLists = []
    for (var i in this.state.apiResponse) {
      playLists.push(this.state.apiResponse[i])
    }
    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify="center" spacing="40">
            {playLists.map(value => (
              <Grid key={value} item>
                <PCard playListName={value.name} playListID={value.id}/> 
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
  
  
