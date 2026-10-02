## Pricing split

- Split the public pricing area into two clearly labeled groups, with **Design Pricing** first and **Video Editing Pricing** second.
- Keep the current three packages under Video Editing.
- Add editable starter packages for Design so the section is populated immediately; all names, prices, descriptions, features, badges, and buttons remain editable in the dashboard.
- Add a pricing-category selector in **Content → Pricing**, allowing each package to be assigned to Design or Video Editing.
- Preserve visibility, featured-card, ordering, draft-safe public filtering, and mobile layouts.

## Technical details

- Add a category field to pricing plans through a database migration, with secure access unchanged.
- Update generated data types, dashboard controls, and public grouping logic.
- Validate both the public section and dashboard on desktop and mobile.
