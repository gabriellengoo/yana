<script setup>
defineProps({
  blocks: {
    type: Array,
    default: () => []
  }
})

const imageUrl = (image) => sanityImage(image)
const linkTarget = (link) => {
  if (!link) return ''
  return link.linkType === 'external' ? link.externalUrl : link.internalPath
}
</script>

<template>
  <section v-if="blocks.length" class="content-blocks">
    <article
      v-for="(block, index) in blocks"
      :key="block._key || `${block.blockType}-${index}`"
      class="content-block"
      :class="`content-block--${block.blockType}`"
    >
      <template v-if="block.blockType === 'textSection'">
        <div class="content-text">
          <h2 v-if="block.heading">{{ block.heading }}</h2>
          <p v-if="block.body" class="rich-text">{{ block.body }}</p>
        </div>
      </template>

      <template v-else-if="block.blockType === 'pullQuote'">
        <blockquote class="pull-quote">
          <p>{{ block.body }}</p>
        </blockquote>
      </template>

      <template v-else-if="block.blockType === 'creditsSection'">
        <div class="content-text">
          <h2 v-if="block.heading">{{ block.heading }}</h2>
          <ul class="info-list">
            <li v-for="credit in block.credits || []" :key="`${credit.role}-${credit.name}`">
              <span>{{ credit.role }}</span>
              <strong>{{ credit.name }}</strong>
            </li>
          </ul>
        </div>
      </template>

      <template v-else-if="block.blockType === 'fullWidthVideo' || block.blockType === 'embeddedMedia'">
        <iframe
          v-if="block.embedUrl || block.videoUrl"
          class="video-frame"
          :src="block.embedUrl || block.videoUrl"
          :title="block.heading || 'Embedded media'"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        />
      </template>

      <template v-else-if="block.blockType === 'twoColumnMedia' || block.blockType === 'portraitLandscapePairing'">
        <div class="media-pair">
          <figure v-if="imageUrl(block.image)">
            <img :src="imageUrl(block.image)" :alt="block.image?.alt || block.heading || ''" loading="lazy" />
          </figure>
          <figure v-if="imageUrl(block.secondaryImage)">
            <img :src="imageUrl(block.secondaryImage)" :alt="block.secondaryImage?.alt || block.heading || ''" loading="lazy" />
          </figure>
        </div>
      </template>

      <template v-else-if="block.blockType === 'threeImageRow' || block.blockType === 'imageGallery'">
        <div class="block-gallery" :class="{ 'block-gallery--three': block.blockType === 'threeImageRow' }">
          <figure v-for="image in block.images || []" :key="image._key">
            <img v-if="imageUrl(image)" :src="imageUrl(image)" :alt="image.alt || block.heading || ''" loading="lazy" />
          </figure>
        </div>
      </template>

      <template v-else-if="block.blockType === 'externalLink'">
        <a
          v-if="linkTarget(block.link)"
          class="project-kicker"
          :href="linkTarget(block.link)"
          :target="block.link?.openInNewTab ? '_blank' : undefined"
          :rel="block.link?.openInNewTab ? 'noreferrer' : undefined"
        >
          {{ block.link?.label || 'External Link' }}
        </a>
      </template>

      <template v-else>
        <figure v-if="imageUrl(block.image)" class="content-image">
          <img :src="imageUrl(block.image)" :alt="block.image?.alt || block.heading || ''" loading="lazy" />
        </figure>
        <div v-if="block.heading || block.body" class="content-text">
          <h2 v-if="block.heading">{{ block.heading }}</h2>
          <p v-if="block.body" class="rich-text">{{ block.body }}</p>
        </div>
      </template>
    </article>
  </section>
</template>
