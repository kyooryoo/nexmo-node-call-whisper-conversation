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
> nexmo app:create "whisper-conversation" [ngrok_url]/answer_inbound [ngrok_url]/event --keyfile private.key
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
4. Copy example .env file, fill in variables, then run the web server
```sh
mv .env.example .env
```
Set up all environment variables in the `.env` file.
* `INBOUND_NUMBER_1` and `INBOUND_NUMBER_2` are the Nexmo numbers you purchased.
* `CALL_CENTER_NUMBER` is the number you want them to direct to.
* `NEXMO_APP_FILE_NAME` is the file name of your application key (`private.key`).
* `DOMAIN` is the public domain [ngrok_url] your server is available on.
```sh
npm start
```
5. Test the App
* Call either of the 2 numbers you purchased.
* Nexmo will make a call to `http://your.domain/answer_inbound` and puts the inbound call on hold.
* A call is then made to the `CALL_CENTER_NUMBER`(your other phone).
* A message is played regarding the nature of the call before both parties are connected to the same conference.
