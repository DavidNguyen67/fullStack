CRUD now is done, update and fix someBugs,

- method UPDATE, CREATE only work for ARRAY of object,
- method GET use query as a parameter (ex: ?id=123,125,ascaa,fsaf => [123, 125] )
- method DELETE use body as a parameter logic handle is same as GET method (ex: ?id=123,125,ascaa,fsaf => [123, 125] )
