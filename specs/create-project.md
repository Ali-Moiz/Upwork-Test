# Flow: Create a project
Precondition: logged in (storageState)
Start URL: /projects

## Steps
1. Click "Add project" — `getByRole('button',{name:/add project/i})`
2. "Create" modal opens with cards: AI User Test / AI Interview / AI Survey / AI Poll
3. Click a type card — `getByText('AI Survey',{exact:true})`
4. Click confirm — `getByRole('button',{name:/^Create AI Survey$/i})` (label mirrors selection)

## Success assertion
- URL matches `/projects/<uuid>` (new project detail)
- project detail tablist visible (Questions/Settings/Analytics/...)

## Notes
- gotcha: confirm button text changes with the selected type.
