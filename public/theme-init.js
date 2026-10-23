document.documentElement.dataset.introState = window.matchMedia('(prefers-reduced-motion: reduce)')
  .matches
  ? 'complete'
  : 'pending'
try {
  const theme = localStorage.getItem('ar-theme')
  document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark'
} catch {
  document.documentElement.dataset.theme = 'dark'
}
document
  .querySelector('meta[name="theme-color"]')
  ?.setAttribute(
    'content',
    document.documentElement.dataset.theme === 'light' ? '#fafafa' : '#080808',
  )
