<template>
  <PublicLayout>
    <div class="container-fluid">
      <div class="my-2">
        <h1>Add your place to the directory</h1>
      </div>
      <form @submit="addPlaceClick">
        <div class="mb-3">
          <label for="Name" class="form-label">Place Name</label>
          <input
            class="form-control"
            id="Name"
            placeholder="What is your store name?"
            v-model="data.name"
          />
        </div>
        <div class="mb-3">
          <label for="Description" class="form-label"
            >Short description - max 50 chars</label
          >
          <input
            class="form-control"
            id="Description"
            placeholder="Short description is shown in the search below picture"
            maxlength="50"
            v-model="data.description"
          />
        </div>
        <div class="mb-3">
          <label for="Tags" class="form-label"
            >Tags - Separated by comma (,)</label
          >
          <input
            class="form-control"
            id="Tags"
            placeholder="Please provide all tags - all categories, language options, location ..."
            maxlength="200"
            v-model="tags"
          />
        </div>
        <div class="mb-3" v-if="data.tags">
          <span
            v-for="tag in data.tags"
            :key="tag"
            class="badge bg-info text-dark m-1"
          >
            {{ tag }}
          </span>
        </div>
        <div class="mb-3">
          <label for="Picture" class="form-label"
            >Cover picture - please provide resolution 1920x1050, jpg &lt; 1
            MB</label
          >
          <input
            type="file"
            class="form-control"
            id="Picture"
            @change="onFileChange"
          />
        </div>
        <div class="mb-3">
          <form @submit="findAddressClick">
            <label for="Address" class="form-label">Address</label>
            <div class="input-group mb-3">
              <input
                class="form-control"
                id="Address"
                placeholder="Where is your store located?"
                v-model="data.address"
              />
              <button
                class="btn"
                :class="
                  this.mapVisible ? 'btn-outline-secondary' : 'btn-primary'
                "
                type="button"
                id="button-addon2"
                @click="findAddressClick"
              >
                Lookup
              </button>
            </div>
          </form>
        </div>

        <ul class="list-group my-2">
          <li
            class="list-group-item"
            :class="
              geo &&
              geo.properties &&
              this.location &&
              this.location.properties &&
              geo.properties.place_id == this.location.properties.place_id
                ? 'active'
                : ''
            "
            v-for="geo in geojson.features"
            :key="geo"
            @click="geoClick(geo)"
            role="button"
          >
            <span v-if="geo && geo.properties && geo.properties.display_name">
              {{ geo.properties.display_name }}
            </span>
          </li>
        </ul>
        <div v-if="geojson.licence" class="text-end">
          <small>GeoJson licence: {{ geojson.licence }}</small>
        </div>
        <div v-if="mapVisible">
          <button
            class="my-2 btn btn-primary"
            @click="addLocation"
            :disabled="
              !(
                this.location &&
                this.location.geometry &&
                this.location.geometry.coordinates
              )
            "
          >
            Add place
          </button>
          <LMap
            style="height: 50vh"
            class="my-2"
            :center="center"
            :zoom="zoom"
            :min-zoom="minZoom"
            :max-zoom="maxZoom"
          >
            <LGeoJson :geojson="geojson" :options="geojsonOptions" />
            <LTileLayer
              :url="url"
              :attribution="attribution"
              :options="options"
            />
          </LMap>
        </div>
        <div v-if="geojson.licence">
          <label class="form-label"
            >Addresses - Add another address by searching the address
            again</label
          >
          <ul class="list-group mb-2">
            <li
              class="
                list-group-item
                d-flex
                justify-content-between
                align-items-center
              "
              v-for="geo in this.data.locations"
              :key="geo"
            >
              {{ geo.properties.display_name }}
              <span
                class="badge bg-light text-dark rounded-pill text-end"
                role="button"
                @click="removeLocation(geo)"
                >Remove</span
              >
            </li>
          </ul>

          <div class="mb-3">
            <label for="LongDescription" class="form-label"
              >Description - What do you sell, how to find the place</label
            >
            <Editor
              editorStyle="height: 200px"
              v-model="data.htmldescription"
            />
          </div>
          <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label"
              >Your email address (not published - for validation
              pusposes)</label
            >
            <input
              type="email"
              class="form-control"
              id="exampleFormControlInput1"
              placeholder="name@example.com"
              v-model="data.email"
            />
          </div>
          <button
            v-if="$route.params.id"
            type="submit"
            class="btn btn-primary"
            @click="addPlaceClick"
          >
            Improve information about this place
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            @click="addPlaceClick"
            v-else
          >
            Add place
          </button>
          <button
            v-if="$store.state.config.isAdmin"
            class="btn btn-danger"
            @click="deletePlaceClick"
          >
            Delete place
          </button>
        </div>
      </form>
    </div>
  </PublicLayout>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LGeoJson, LTileLayer } from "@vue-leaflet/vue-leaflet";

import { mapActions } from "vuex";
import PublicLayout from "../layouts/Public.vue";
export default {
  components: {
    PublicLayout,
    LMap,
    LGeoJson,
    LTileLayer,
  },
  data() {
    return {
      data: {
        address: "",
      },
      tags: "",
      center: [49, 20],
      mapVisible: false,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 10,
      minZoom: 3,
      maxZoom: 18,
      location: {},
      geojson: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              place_id: 160598789,
              osm_type: "way",
              osm_id: 283543577,
              display_name:
                "AAA Insurance, 650, 2nd Street West, Sonoma, Sonoma County, California, 95476, United States",
              place_rank: 30,
              category: "office",
              type: "insurance",
              importance: 0.5584454244094003,
            },
            geometry: {
              type: "Point",
              coordinates: [-122.46132401796646, 38.28958405],
            },
          },
        ],
      },
      options: {},
      mapIsReady: false,
      geojsonOptions: {
        // Options that don't rely on Leaflet methods.
      },
    };
  },
  async beforeMount() {
    // HERE is where to load Leaflet components!
    const { circleMarker } = await import("leaflet/dist/leaflet-src.esm");

    // And now the Leaflet circleMarker function can be used by the options:
    this.geojsonOptions.pointToLayer = (feature, latLng) =>
      circleMarker(latLng, { radius: 8 });
    this.mapIsReady = true;
  },
  watch: {
    tags() {
      this.data.tags = this.makeTags(this.tags);
    },
  },
  async mounted() {
    this.geojson.features = [];
    console.log("mounted", {
      id: this.$route.params.id,
      ip: this.$route.params.ip,
    });
    if (this.$route.params.id) {
      this.data = await this.getInfo({
        id: this.$route.params.id,
        ip: this.$route.params.ip,
      });
      if (this.data && this.data.tags) {
        this.tags = this.data.tags.join(", ");
      }
      //      this.geojson.features = this.data.geojson;
      this.locations = this.data.geojson;
      await this.geoClick(this.data.geojson);
      this.mapVisible = false;
      this.geojson.licence = "© OpenStreetMap";
      console.log("this.data.geojson", this.data.geojson);
    }
  },

  methods: {
    ...mapActions({
      getCategoryList: "api/getCategoryList",
      search: "api/search",
      addPlace: "api/addPlace",
      getInfo: "api/getInfo",
    }),
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    makeTags(str) {
      let ret = [];
      const arr = str.split(",");
      for (let index in arr) {
        const item = arr[index].trim();
        console.log("str", item);
        if (ret.indexOf(item) < 0) ret.push(item);
      }
      return ret;
    },
    createImage(file) {
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        vm.data.image = e.target.result;
      };
      reader.readAsDataURL(file);
      console.log("this.data", this.data);
    },
    async addPlaceClick(e) {
      e.preventDefault();
      const result = await this.addPlace(this.data);
      console.log("addPlaceClick", this.data, result);
      if (result && result.id) {
        this.$router.push("/info/" + result.id);
      }
    },
    async findAddressClick(e) {
      e.preventDefault();
      this.geojson = await this.search({ searchQuery: this.data.address });
      if (this.geojson.features && this.geojson.features.length > 0) {
        await this.geoClick(this.geojson.features[0]);
      }
      console.log("found", this.geojson);
      this.mapVisible = true;
    },
    async geoClick(geo) {
      console.log("geo", geo);
      if (geo && geo.geometry && geo.geometry.coordinates) {
        this.center = [
          geo.geometry.coordinates[1],
          geo.geometry.coordinates[0],
        ];
        if (!this.data.locations) {
          this.data.locations = [];
        }
        this.location = geo;
      }
    },
    async addLocation() {
      if (this.location && this.location.geometry.coordinates) {
        if (!this.data.locations) {
          this.data.locations = [];
        }
        const find = this.data.locations.find(
          (p) => p.properties.place_id == this.location.properties.place_id
        );
        console.log("find", find);
        if (!find) {
          this.data.locations.push(this.location);
          this.mapVisible = false;
        }
        this.geojson.features = [];
      }
    },
    removeLocation(geo) {
      const find = this.data.locations.find(
        (p) => p.properties.place_id == geo.properties.place_id
      );
      if (find) {
        const index = this.data.locations.indexOf(find);
        this.data.locations.splice(index, 1);
      }
      if (this.data.locations.length == 0) {
        this.geojson.licence = "";
      }
    },
    async deletePlaceClick(e) {
      e.preventDefault();
      const result = await this.deleteItem({
        id: this.data.id,
        ip: this.data.ip,
      });
      if (result) {
        this.$router.push("/admin/");
      }
    },
  },
};
</script>