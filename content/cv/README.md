# CV folder

Drop Itay's CV PDF in this folder (e.g. `itay-haephrati-cv.pdf`).

- `npm run sync-profile` will detect the first PDF here, extract its text, and add it to the knowledge base (`content/generated/cv.md`).
- The same PDF is copied to `public/cv.pdf` so the "Download CV" button works.
- Until a PDF exists, the Download CV button links to the LinkedIn profile as a fallback.
