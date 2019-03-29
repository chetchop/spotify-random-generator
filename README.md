# The Problem
Spotify is straight garbo when it comes to shuffling. I have many songs saved but if I shuffle those songs then
I end up getting many of those recently saved songs in this 'shuffled' state.

# The Solution
With `spotify-random-generator` we will be able to create playlists that are much more random than Spotify provides.
This will be done through a web app that uses the [Spotify API](https://developer.spotify.com/documentation/web-api/)

# Stories
## Signing In
### Home page
As a user I want to be able to navigate to the home page and see a button to sign in.

As a user I want to be able to click the sign in button and be directed to Spotify's OAuth flow in order to
provide authorization for `spotify-random-generator`.

As a user I want to see a page that says `Welcome ${spotifyUsername}` when I am redirected from the oauth flow

As a user I want to see a list of all my playlists when I am at the home page. This list will be below the 
welcome message

### Playlists
As a user I want to be able to click on a playlist

As a user when I click on a playlist I am shown a different view that has all songs in that playlist

## More TBD 
                  
