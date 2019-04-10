import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    backgroundColor: 'grey',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class NestedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {playlists: [],
                      open: false};

    }

    getPlaylists() {
        fetch("http://localhost:8888/getplaylists2")
            .then(res => res.text())
            .then(res => this.setState({playlists: JSON.parse(res)}))
            .catch(err => err);
    }
  
    componentDidMount() {
        this.getPlaylists();
    }

    componentDidUpdate() {
      this.getPlaylists();
    }
        

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handlePlaylistSelection = (playlist) => {
    this.props.loadPlaylist(playlist);
  }

  render() {
    const { classes } = this.props;
    const playlistsArray = []
    for (var i in this.state.playlists) {
      playlistsArray.push(this.state.playlists[i])
    }

    return (
      <List
        component="nav"
        // subheader={<ListSubheader component="div">{this.props.listTitle}</ListSubheader>}
        className={classes.root}
      >
        {/* <ListItem button>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText inset primary="Sent mail" />
        </ListItem> */}
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText inset primary={this.props.listTitle} />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {playlistsArray.map(value => (
                <ListItem button className={classes.nested} onClick={this.handlePlaylistSelection.bind(this, value)} key={value.playListID}>
                {/* <ListItemIcon>
                    <StarBorder />
                </ListItemIcon> */}
                <ListItemText inset primary={value.playListName} />
                </ListItem>

            ))}

          </List>
        </Collapse>
      </List>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NestedList);