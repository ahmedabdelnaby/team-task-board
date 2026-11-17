# NOTES.md

## 1. Why useReducer over useState, and why IDs are generated outside the reducer

The app manages a list of tasks plus a set of filters, and every action (add, toggle, update, delete, filter) changes that shared data in a predictable way. With `useState` I would have needed several separate state variables and I would have to manually keep them consistent. `useReducer` lets me describe every possible change as a named action and handle it in one place. It also makes the logic easy to test: I can call the reducer function directly with any action and check what comes out, without rendering anything.

IDs are generated outside the reducer because a reducer must be a pure function — given the same inputs it must always return the same output. `crypto.randomUUID()` is not pure: it returns a different value every time it is called. Putting it inside the reducer would make the reducer impure and impossible to test predictably. So the ID is created in the action creator (inside `TaskProvider`) and passed in as part of the action.

## 2. Why state and dispatch live in separate contexts

If I put both `state` and `dispatch` inside a single context value like `{ state, dispatch }`, React would create a new object reference every time the state changes. Every component that consumes that context — even one that only reads `dispatch` to send an action — would re-render on every state change, even if the dispatch function itself never changed.

By splitting them into two contexts (`TaskStateContext` and `TaskActionsContext`), components that only need to dispatch (like `AddTaskForm`) subscribe only to the actions context. Since the action functions are created with `useCallback` and never change reference, those components never re-render when task data changes. Only components that actually read `state` will re-render when it updates.

## 3. How useReferenceData avoids duplicate requests and ignores stale responses

There are two separate problems being solved. The first is stale responses: if `projectId` changed (or the component unmounted) before a slow network response arrived, that old response could overwrite the current state with outdated data. This is solved with an `ignore` flag. At the start of the effect, `ignore` is `false`. In the cleanup function (which React calls when the effect re-runs or the component unmounts), `ignore` is set to `true`. Inside the `.then()` callback, the state is only updated `if (!ignore)` — so any response that arrives after a re-run or unmount is simply discarded.

The second problem is duplicate in-flight requests: clicking Retry while a request is still loading should do nothing. This is handled by checking `if (prev.type === 'loading') return prev` before incrementing the retry counter. If the status is already `loading`, the state does not change, the retry counter does not increment, and the effect does not re-run.

## 4. One thing I would change with more time

I would extract the form validation logic from `AddTaskForm` into a reusable custom hook, something like `useFormValidation(fields, rules)`. Right now the validation function and the error/touched state are all inside the component, which makes the component longer than it needs to be. A dedicated hook would make it easier to reuse the same validation pattern if a second form (like an edit form) was added later, and it would make the component itself easier to read.
