<template>
  <PublicLayout>
    <div class="container-fluid">
      <section class="my-5" id="search">
        <div class="row" v-if="item">
          <div class="col">
            <h1>{{ item.name }}</h1>
            <div class="text-muted">{{ item.description }}</div>

            <span v-if="item.tags"
              >Tags:
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="badge bg-info text-dark m-1"
                role="button"
                @click="$router.push('/search/' + tag)"
              >
                {{ tag }}
              </span>
            </span>
            <p class="" v-if="item.url && item.link">
              Web: <a target="_blank" :href="item.link">{{ item.url }}</a>
            </p>
            <p class="" v-else-if="item.link">
              Web: <a target="_blank" :href="item.link">{{ item.link }}</a>
            </p>
            <p
              v-if="item.htmldescription"
              class="card-text"
              v-html="sanitizeHtml(item.htmldescription)"
            ></p>
          </div>
          <div class="col" v-if="item.image">
            <div class="row row-cols-1 g-4">
              <div class="col">
                <div class="card h-100">
                  <div class="card-header">
                    <h5 class="card-title">Cover picture</h5>
                  </div>
                  <img
                    :src="item.image"
                    class="card-img-top"
                    :alt="item.title"
                    role="button"
                    @click="imageClick"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card h-100" v-if="mapShown && this.item">
          <div class="card-header">
            <h5 class="card-title">Location</h5>
            <div
              v-if="this.item.geojson && this.item.geojson.geometry"
              class="text-muted text-end"
            >
              <span>
                GPS Lat: {{ this.item.geojson.geometry.coordinates[1] }}, Lon:
                {{ this.item.geojson.geometry.coordinates[0] }}
              </span>
            </div>
          </div>
          <div class="card-body m-0 p-0">
            <LMap
              class="my-2"
              style="height: 50vh"
              :center="center"
              :zoom="zoom"
              :min-zoom="minZoom"
              :max-zoom="maxZoom"
            >
              <LGeoJson :geojson="item.geojson" :options="geojsonOptions" />
              <LTileLayer
                :url="url"
                :attribution="attribution"
                :options="options"
              />
            </LMap>
            <div
              v-if="item && item.geojson && item.geojson.licence"
              class="text-end"
            >
              <small>GeoJson licence: {{ item.geojson.licence }}</small>
            </div>
          </div>
        </div>
        <div class="row" v-if="item">
          <div class="col" v-if="item.type == 'eshop'">
            <button
              class="btn btn-light m-2"
              role="button"
              @click="$router.push('/edit/eshop/' + item.id)"
            >
              Improve information about this E-Shop
            </button>
          </div>
          <div class="col" v-if="item.type == 'place'">
            <button
              class="btn btn-light m-2"
              role="button"
              @click="$router.push('/edit/place/' + item.id)"
            >
              Improve information about this place
            </button>
          </div>
          <div class="col" v-else>
            <button
              class="btn btn-light m-2"
              role="button"
              @click="$router.push('/edit/service/' + item.id)"
            >
              Improve information about this service
            </button>
          </div>
          <div class="col">
            <button
              v-if="$store.state.config.isAdmin"
              class="btn btn-danger m-2"
              @click="deleteItemClick"
            >
              Delete item
            </button>
          </div>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LGeoJson, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { mapActions } from "vuex";
import PublicLayout from "../layouts/Public.vue";
import xss from "xss";

export default {
  components: {
    PublicLayout,
    LMap,
    LGeoJson,
    LTileLayer,
  },
  data() {
    return {
      item: {
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
      },
      zoom: 13,
      minZoom: 3,
      maxZoom: 18,
      center: [49, 20],
      options: {},
      mapShown: false,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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
  async mounted() {
    this.category = "index";
    console.log("this.$route.params", this.$route.params);
    this.item = await this.getInfo({
      id: this.$route.params.id,
      ip: this.$route.params.ip,
    });
    if (this.item && this.item.geojson) {
      setTimeout(() => {
        this.center = [
          this.item.geojson.geometry.coordinates[1],
          this.item.geojson.geometry.coordinates[0],
        ];
        this.mapShown = true;
      }, 50);
    } else {
      this.mapShown = false;
    }
  },
  methods: {
    ...mapActions({
      getInfo: "api/getInfo",
      openSuccess: "toast/openSuccess",
      openError: "toast/openError",
      deleteItem: "api/deleteItem",
    }),
    sanitizeHtml(data) {
      return xss(data);
    },
    async deleteItemClick(e) {
      e.preventDefault();
      const result = await this.deleteItem({
        id: this.item.id,
        ip: this.item.ip,
      });
      if (result) {
        this.openSuccess("Items deleted: " + result);
        this.$router.push("/admin/");
      } else {
        this.openError("Error occured");
      }
    },
    imageClick() {
      if (this.item && this.item.link) {
        window.open(this.item.link, "_blank").focus();
      }
    },
  },
};
</script>