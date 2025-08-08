- Create a route called ideas (`/ideas`)
- use prisma for orm and db migration
- Also create the following model (db migration):
IdeaTopic: id (guid), name (string), description (string), tags (array<string>), ideas (array<Idea>)
Idea: id (guid), name (string), description (string), tags (array<string>), rating (int), feedback (string), ideaTopicId (guid)
- Use zod for validation
- Use sqlite for data storage
- db is supabase (.env.local already has the necessary configuration)
- tailwindcss and daisyUI for components
- for unit testing use vitest
- the ideas page should have a list of cards for IdeaTopics. it should also have a search bar with filter as you type.
- clicking on a topic card should navigate to the topic details page. this page should have information about the topic, a similar search bar, and a list of ideas related to the topic also as a card list.
- clicking on an idea card should navigate to the idea details page. this page should have information about the idea. Also add ability to leave feedback and rate the idea.
- on the home page, have a card list for and only include one card which is "Ideas". clicking it should navigate to the ideas page.
- the name of this app is "Within Our Sacred Walls Apps"
