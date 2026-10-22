<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">✦</span>
        <span>Contactly</span>
      </RouterLink>
      <nav class="topnav" aria-label="Navigation principale">
        <RouterLink to="/">Mes contacts</RouterLink>
      </nav>
    </header>
    <main class="page-container">
      <RouterView />
    </main>
  </div>
</template>
