<template>
  <div>
    <div style="width: 100%; text-align: center;">
      <q-btn-group>
        <q-btn
          label="About"
          :color="activeTab === 'about' ? 'primary' : 'white'"
          :text-color="activeTab === 'about' ? 'white' : 'color'"
          @click="activeTab = 'about'"
        />
        <q-btn
          label="Dependencies"
          :color="activeTab === 'dependencies' ? 'primary' : 'white'"
          :text-color="activeTab === 'dependencies' ? 'white' : 'color'"
          @click="activeTab = 'dependencies'"
        />
      </q-btn-group>
    </div>

    <hr>

    <div style="width: 100%; text-align: center; max-width: 500px;">
      <div class="animated fadeIn"
           v-show="activeTab === 'about'"
      >
        <h4>{{ packageInfo.productName }} <small>(v. {{ packageInfo.version }})</small></h4>
        <p>{{ packageInfo.description }}</p>

        <br>

        <div class="row q-pa-sm">
          <div class="col-12">
            <b>Source</b>
          </div>
          <div class="col-12">
            <a :href="packageInfo.homepage">{{ packageInfo.homepage }}</a>
          </div>
        </div>

        <div class="row q-pa-sm">
          <div class="col-12">
            <b>License</b>
          </div>
          <div class="col-12 ">
            {{ packageInfo.license }}
          </div>
        </div>

        <div class="row q-pa-sm">
          <div class="col-12">
            <b>Author</b>
          </div>
          <div class="col-12">
            {{ packageInfo.author }}
          </div>
        </div>
      </div>
      <div class="animated fadeIn" v-show="activeTab === 'dependencies'">
        <p>{{ packageInfo.productName }} only works because of these libraries</p>

        <br>

        <div style="max-height: 50vh; overflow-y: scroll">
          <div class="row">
            <div
              class="col-12 col-xs-12 col-md-6 col-xl-4"
              v-for="(version, packageName) in dependencieList"
              :key="packageName"
            >
              <a :href="`https://npmjs.com/package/${packageName}`">
                {{ packageName }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr>
  </div>
</template>

<script>
export default {
  props: ['packageInfo'],

  data () {
    return {
      activeTab: 'about',
      dependencieList: Object.assign(this.packageInfo.dependencies, this.packageInfo.devDependencies)
    }
  }
}
</script>

<style>
</style>
