<template>
  <NuxtLayout>
    <PageTransition v-slot="{ transition }">
      <NuxtPage :page-key="(pageRoute) => pageRoute.fullPath" :transition="transition" />
    </PageTransition>
  </NuxtLayout>
</template>
