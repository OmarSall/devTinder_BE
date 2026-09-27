# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

or

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you the profiles of other users on platform

Status: ignored, interested, accepted, rejected

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)