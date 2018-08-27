# Create a Call Whisper with the conversation action of the NCCO
* This app adds a Voice Whisper to combine unique inbound numbers to identify the source of the call.
* A business could advertise a phone number specific to a marketing campaign or one route of the campaign.
* When someone calls the number, the call is forwarded to an existing customer service call centre.
* An audio is played to help identify the purpose of the call, before the caller is connected.

## Prerequisites
* [Nexmo account](https://dashboard.nexmo.com/sign-up)
* [Nexmo CLI](https://github.com/Nexmo/nexmo-cli)
* [Ngrok](https://ngrok.com/)


## Step by Step Guide
1. Reuse the source code
```sh
git clone https://github.com/nexmo/node-call-whisper.git
cd node-call-whispher
npm install
```
2. Post local web server to public with [ngrok_url]
```sh
> ./ngrok http 5000
```
3. Prepare numbers [nexmo_number_x], application [nexmo_app], and link them
```sh
# create the nexmo application
> nexmo app:create "whisper-conversation" [ngrok_url]/answer [ngrok_url]/event --keyfile private.key
Application created: [nexmo_app]
Private Key saved to: private.key
# purchase two nexmo numbers
> nexmo number:buy -c US --confirm
Number purchased: [nexmo_number_1]
> nexmo number:buy -c US --confirm
Number purchased: [nexmo_number_2]
# link the numbers to the application ID
> nexmo link:app [nexmo_number_1] [nexmo_app]
> nexmo link:app [nexmo_number_2] [nexmo_app]
```

### Run Server

The next step is to set up all of our variables in a `.env` file. You can start off by copying the example file.

```sh
mv .env.example .env
```

Fill in the values in `.env` as appropriate, where `INBOUND_NUMBER_1` and `INBOUND_NUMBER_2` are the numbers you just purchased, `CALL_CENTER_NUMBER` is the number you want them to direct to, and `NEXMO_APP_FILE_NAME` is the file name of your application key (`app.key`). Finally, `DOMAIN` is the public domain or hostname your server is available on.

With this in place you can start the server.

```sh
npm start
```

The application should be available on <http://localhost:5000>. For this to work full though, make sure to expose your server on a public domain (e.g. `your.domain` in the example above) using a tool like [Ngrok](https://ngrok.com/).

## Using the App

To use the app you need two phones, or a phone and something like Skype to make the first call.

With your server running, call either of the 2 numbers you purchased. Nexmo will then make a call to `http://your.domain/answer_inbound` which puts the inbound call on hold. A call is then made to the `CALL_CENTER_NUMBER`(your other phone) where a message is played regarding the nature of the call before both parties are connected to the same conference.
