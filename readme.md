Task list: 

Venmo: 
This is the developer's site: 
http://iosdevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
That's important. Here's how I see what we need to do: We're going to do the thing above. Then, we're going to redirect them to the web using something like this: http://stackoverflow.com/questions/12416469/how-to-launch-safari-and-open-url-from-ios-app 
After they've signed in, they'll be redirected to our base uri. It looks like they'll also make a post to our server, which has a code. With the code, we make a post to *their* server, which will respond with a whole bunch of stuff. Mainly, the access token, the refresh token, and stuff like the phone number. We'll need the user info so that we can automate payments. 

If we can get that all to work, it's going to be fucking awesome.


##Note: We get really shitty errors when we try and do the post request to getUsersWithPrefix. I really don't know what it is, but it's usually a 500 error, but sometimes an unacceptable content type error.

##Also, Derick, look over that one app.use() I put in server.js to make sure I'm not crazy.
