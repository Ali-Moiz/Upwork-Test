# Flow: Upload a document via Teach AI
Precondition: logged in (storageState)
Start URL: /home/teach-ai

## Steps
1. Page "Contextualize Your AI" loads.
2. Click "Add file" — `getByRole('button',{name:/add file/i})`
3. Provide file to the file input / file chooser — fixtures/sample-teach-ai.txt

## Success assertion
- uploaded file name appears on the page

## Notes
- "Add file" may open a menu/section rather than a native chooser; prefer setInputFiles on input[type=file] if present.
