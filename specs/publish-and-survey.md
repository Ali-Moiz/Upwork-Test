# Flow: Publish a project + take its survey
Precondition: logged in (storageState); at least one project exists
Start URL: /projects -> open a project -> /projects/<uuid>

## Steps
1. Open a project from the list.
2. Click "Publish" — `getByRole('button',{name:/^publish$/i})` (top-right)
3. Confirm publish dialog if shown; capture public survey/share link.
4. Open the share link in a fresh context (as a respondent).
5. Start survey, answer first prompt (textarea/contenteditable), submit/next.

## Success assertion
- respondent page shows acknowledgement (thank you / next question / submitted)

## Notes
- share URL only available if surfaced in the publish dialog; test skips gracefully otherwise.
