# Partify

### Demo
- Crowdsource a party playlist
	- Guests add songs to playlist using smartphone
	- Host provides client computer with spotify
	- Guests can upvote songs other guests have added to playlist
- [ERD](<img src="/blob/master/party_playlist.png">)
- Request Cycle
	- User searches for song
		- Autocomplete
	- User selects desired song
	- Spotify API call
	- Song info persisted to DB
	- Song plays on host client through Spotify desktop app
	
### Deep Dive
- Problem? 
	- Host isn't a DJ, musically 'inclined'
	- Unable to cater to the tastes of all guests
	- Doesn't have time to dynamically adjust music to mood of party 
- App crowdsources DJ role to guests
- Alternatives? 
	- Spartify: not a great UX experience
- Code walkthrough...
- Hurdles
	- Spotify rolled out new APIs, deprecated old ones
	- Dynamic JavaScript playlist
		- Too many daisy-chained functions
	- Multiple API calls
	- Voting functionality, replicated in real-time

### Team Workflow
- GitHub instead of pivotal tracker
	- Simpler, fewer defined features
- Division of labor?
	- Backend / Frontend
		- Montessori?
		- Self-sorting Hogwarts hat?
	- Weekend sprint immensely helpful!!!
- Team comms/sync
	- Hipchat
	- Scrums/mini-scrums/whatever
- Work delivery
	- Dilineating end-of-day deliverables,	 feature goals crucial
- Problems:
	- Sharing work?
	- Resolution?
	
 