<template>
  <div id="tabmenu-container" class="q-pr-sm q-py-md animated fadeInLeft">
    <div id="tabmenu" class="q-py-sm shadow-1">

      <!-- ROWS -->
      <div class="row">
        <div class="col-12 header">
          Tabs
        </div>

        <div
          class="col-12"
          :class="{ 'active': $parent.activeTab === Number(index) }"
          v-for="(tab, index) in $parent.tabs"
          :key="`tab-${index}`"
          @click="$parent.setActiveTab(Number(index))"
        >
          <i v-if="$parent.showTooltip && (Number(index) + 1 <= 10)">
            {{ index + 1 }}
          </i>

          {{ tab.name }}

          <tab-context @rename="$parent.renameTab(Number(index))"
                       @archive="$parent.archiveTab(Number(index))"
                       @close="$parent.removeTab(Number(index))"
          ></tab-context>
        </div>

        <div class="col-12 header hr"></div>

        <div class="col-12 header">
          Archive
        </div>

        <div
          class="col-12"
          v-for="(note, index) in $parent.archived"
          :key="`archive-${index}`"
          @click="$parent.restoreArchivedTab(Number(index))"
        >
          {{ note.name }}
        </div>
      </div>
      <!-- END ROWS -->

    </div>
  </div>
</template>

<script>
import TabContext from './TabContext'

export default {
  components: {
    TabContext
  },

  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
#tabmenu-container {
  width: 100%; // TODO: maybe remove this

  #tabmenu {
    border-top-right-radius: 7.5px;
    border-bottom-right-radius: 7.5px;
  }
  // Tab items
  .col-12 {
    width: 100%;
    padding: 4px 0;
    padding-left: 12px;

    &.header {
      font-style: italic;
      // Divided, it neads header so it wont have hover effetcs
      &.hr {
        border-bottom: 1px solid lightgrey;
        margin-bottom: 8px;
      }
    }
    &:hover:not(.header) {
      cursor: pointer;
      background-color: lighten(#027be3, 50%);
    }

    &.active {
      background-color: #027be3;
      color: #ffffff;

      &:hover {
        background-color: darken(#027be3, 3%);
      }
    }
  }
}
</style>
