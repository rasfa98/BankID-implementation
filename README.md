# BankID implementation

A simple and quick BankID implementation made in Node.js and Express.

## Example .env

The key and certificate should be placed in a `certificates` folder in the root directory.

```
KEY=key.p12
CERTIFICATE=certificate.cert
PASSPHRASE=mysecretpassword
API_URL=https://appapi2.test.bankid.com/rp/v5.1
```

## Routes

`/start-auth`

A GET route used to initiate the auth process. Takes an optional parameter `ssn` which is a swedish personal number. Returns an `orderRef` that can be used to poll the login attempt using the `/collect-auth` route. If an `ssn` was not provided an `autoStartToken` is returned as well that can be used to open the BankID app.

`/collect-auth`

A GET route used to poll the login attempt. If success the user is returned in the response. The `orderRef` obtained from `/start-auth` should be sent using a `ref` parameter.
