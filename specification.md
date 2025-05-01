# Payment Spreader

## Overview

Sometimes when a payment is received by a company it wants to booked to the accounts over a period of time. For example, a company might receive a payment of $1000 and want to book it to the accounts over a period of 12 months. This is known as a spread payment.

## Features

### Inputs

1. The Narration to be used.
2. The amount to be spread.
3. The date the payment was received.
4. The number of months to spread the payment over.
5. The account to be credited.
6. The account to be debited.
7. The tax code to be applied on the credit account.
8. The tax code to be applied on the debit account.

### Outputs

1. A list of journal entries as a CSV that can be uploaded into the accounting system.

The format should be a CSV with the following columns:

* Narration
* Date
* Description
* AccountCode
* TaxRate
* Amount

## Hosting

The application will be hosted on google pages so should be written in react.js