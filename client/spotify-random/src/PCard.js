import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

var cardStyle = {
  //display: 'block',
  width: '50%',
  marginLeft: 'auto', 
  marginRight: 'auto'

  //transitionDuration: '0.3s',
  //height: '100%'
}

class RecipeReviewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {apiResponseSongs: [],
                  apiResponseImages: [],
                  expanded: false,
                  currentlyPlaying: ["1MzFmVDSl7Vm00f3Hw4Xfx"] };
  };

  getSongs() {
    fetch("http://localhost:8888/getsongs/" + this.props.playListID)
        .then(res => res.text())
        .then(res => this.setState({apiResponseSongs: JSON.parse(res)}))
        .catch(err => err);
  };

  getPlaylistImages() {
    fetch("http://localhost:8888/getplaylistimage/" + this.props.playListID)
        .then(res => res.text())
        .then(res => this.setState({apiResponseImages: JSON.parse(res)}))
        .catch(err => err);
  };

  componentDidMount() {
    this.getSongs();
    this.getPlaylistImages(); 
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  processSongs(songs) {
    this.setState({apiResponseSongs: songs})
  }

  onClick = () => {
    const {apiResponseSongs}  = this.state;

    let indexToSwap = apiResponseSongs.length

    while (indexToSwap > 0) {
      let randomIndex = Math.floor(Math.random() * apiResponseSongs.length);
      indexToSwap--;
      let temp = apiResponseSongs[indexToSwap];
      apiResponseSongs[indexToSwap] = apiResponseSongs[randomIndex];
      apiResponseSongs[randomIndex] = temp;
    }

    this.setState({
      apiResponseSongs: apiResponseSongs
    })
  }

  changeTrack = (id) => {
    const {currentlyPlaying} = this.state;
    currentlyPlaying[0] = id
    this.setState({currentlyPlaying:currentlyPlaying}) 
  }

  render() {
    const { classes } = this.props;

    const { apiResponseSongs } = this.state; 
    const { apiResponseImages} = this.state;
    

    // Try and remove this (understand why you have to do this stupid shit better)
    const images = [];
    for (var i in this.state.apiResponseImages) {
      images.push(this.state.apiResponseImages[i].url)
    }



    
   
    return (
      <Card className={classes.card}>
        
        <CardHeader
          // avatar={
          //   <Avatar aria-label="Recipe" className={classes.avatar}>
          //     R
          //   </Avatar>
          // }
          //Three dots button that shows options --> maybe a change playlist name or a open in spotify here
          // action={
          //   <IconButton>
          //     <MoreVertIcon />
          //   </IconButton>
          // }
          title={this.props.playListName}
          subheader={"Subheader"}
        />
        <CardMedia
          className={classes.media}

          style={cardStyle}
          image={images[0]}
          title="Paella dish"
        />
        <CardContent>
          <Typography component="p">
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton  onClick={this.onClick}>
            <FavoriteIcon />
          </IconButton>
          {/* <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton> */}
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <ul>
              {apiResponseSongs.map(song => (
                <li>
                        <Button  onClick={this.changeTrack.bind(this, song.id)}>
                          {song.name}
                        </Button>
                </li>
               
                // <li>{song.name}</li>
              ))}
            </ul>
            {/* <Typography paragraph>Method:</Typography>
            <Typography paragraph>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
              minutes.
            </Typography> */}
            <iframe src={"https://open.spotify.com/embed/track/"+this.state.currentlyPlaying} width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeReviewCard);