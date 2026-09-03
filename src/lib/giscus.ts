// Giscus (GitHub Discussions-based comments) configuration.
//
// SETUP REQUIRED before comments will actually work — see
// docs/superpowers/specs/giscus-setup-guide.md for the full walkthrough.
// Until repoId/categoryId below are filled in, the embed script will render
// but show a "Configuration error" message instead of a comment box.
export const giscusConfig = {
  repo: 'yunjiewuw/personal_website' as const,
  repoId: 'REPLACE_ME', // from giscus.app, after connecting the repo
  category: 'Comments',
  categoryId: 'REPLACE_ME', // from giscus.app, after picking the Discussion category
  mapping: 'pathname' as const,
  theme: 'light' as const,
};
