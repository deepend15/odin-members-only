An app where users can submit/read anonymous posts (referred to in-app as "stories"). Any visitor to the site can read stories, but only users who have signed up for an account and are logged in can submit their own stories. Users can edit and delete their own stories.

Additional layers of user rights / authorization include:

- 'anonClub' members, who can see the username and date/time of submission for every story
- admin users, who have access to the above, and in addition can delete any user's stories (not just their own)

Users have the ability to update their account information, and, if they provide the correct secret password, can obtain the privileges listed above.

To run the app, first deploy a local/production database, then run `node db/populatedb.js <db-url>`.

See [.env.example](https://github.com/deepend15/odin-members-only/blob/main/.env.example) for the required environment variables.