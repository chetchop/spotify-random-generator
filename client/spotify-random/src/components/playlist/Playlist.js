import React, { Component } from 'react';

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {apiResponse: ""};
    }

    callAPI() {
        fetch("http://localhost:8888/getuser")
            .then(res => res.text())
            .then(res => this.setState({apiResponse: JSON.parse(res)}))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }
    render() {
        const songs = this.props.songs
        return (
            <div>
                <h1>PlaylistName</h1>
                <h1>{JSON.stringify(this.state.apiResponse)}</h1>
                <ul>
                    {/* {songs.map(function(song) {
                        return <li>sdfhfks</li>
                    })} */}
                </ul>
            </div>
        )
    }
} 

