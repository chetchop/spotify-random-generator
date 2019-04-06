import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Nestedlist from './NestedList'
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import PlaylistInfoTile from './PlaylistInfoTile'





const drawerWidth = 300;



var paperStyle = {
  color: 'black'
}

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    paddingTop: 100

  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,

  },
  drawerPaper: {
    width: drawerWidth,

  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,

  },

  toolbar: theme.mixins.toolbar,

});

const style2 = {
  height: '200',
  width: '200'
}

const buttonStyle = {
  marginLeft: -12,
  marginRight: 20
}

class MainBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentlySelectedPlaylist: "",
                  currentSong: ""
    };
  }

  testClick = (playList) => {
    this.setState({currentlySelectedPlaylist: playList.playListImage, currentSong: playList.playListID});
  }


  
  render() {
    const { classes } = this.props;
    return (

      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Randomize your Spotify Playlists
            </Typography>
            <Button color="inherit" href="http://localhost:8888/">Login</Button>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          {['Original Playlists', 'Randomized Playlists'].map(listTitle => (
            <div>
              <Nestedlist listTitle={listTitle} testClick={this.testClick}  classes={{color: 'red'}}/>
              <Divider/>
            </div>
          ))}
          
          
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          
          
          <Paper width={100} height={100}><img src={this.state.currentlySelectedPlaylist}></img></Paper>
          
        </main>
      </div>
 
      
    );
  }  
}

MainBoard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainBoard);





            {/* <Grid container className={classes.demo} justify="center" spacing={48}>
              <Grid  item>
                <Paper className={classes.paper} style={style2}>
                  <img src={this.state.currentlySelectedPlaylist}></img>
                </Paper>
              </Grid>
              <Grid  item>
                <Paper className={classes.paper} style={style2}>
                  <PlaylistInfoTile/>
                </Paper>
              </Grid>
            </Grid>
            <Grid container className={classes.demo} justify="center" spacing={48}>
              <Grid  item>
                <Paper className={classes.paper} style={style2}>
                <iframe src={"https://open.spotify.com/embed/playlist/"+this.state.currentSong} width="800" height="500" frameborder="0" allowtransparency="false" allow="encrypted-media"></iframe>
                </Paper>
              </Grid>
            </Grid> */}