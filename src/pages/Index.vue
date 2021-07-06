<template>
  <PublicLayout>
    <div class="container-fluid">
      <section class="my-5" id="search">
        <div class="row">
          <form @submit="searchClick">
            <div class="offset-md-3 col-md-6">
              <div class="input-group flex-nowrap">
                <input
                  type="text"
                  class="form-control"
                  v-model="search"
                  placeholder="Search category, website, exchange, wallet, eshop and more ..."
                  :suggestions="filteredTagsBasic"
                  @complete="searchTag($event)"
                  field="name"
                />
                <input
                  type="submit"
                  class="btn btn-outline-primary"
                  @click="searchClick"
                  value="Search"
                />
              </div>
            </div>
          </form>
        </div>
        <div class="row">
          <div class="offset-md-3 col-md-6">
            Example:
            <span role="button" @click="this.addTag('Exchange')">Exchange</span
            >, <span role="button" @click="this.addTag('Wallet')">Wallet</span>,
            <span role="button" @click="this.addTag('E-Shop')">E-Shop</span>,
            <span role="button" @click="this.addTag('Place')">Place</span>,
            <span role="button" @click="this.addTag('News')">News</span>
          </div>
        </div>
      </section>

      <section class="my-5" id="search">
        <h5>
          Browse solutions
          <span v-if="category && tags && tags.length > 0"
            >Tags:
            <span
              v-for="tag in tags"
              :key="tag"
              class="badge bg-info text-dark m-1"
              role="button"
              @click="removeTag(tag)"
            >
              {{ tag }}
            </span>
          </span>
        </h5>
        <div
          class="
            row
            row-cols-1
            row-cols-sm-2
            row-cols-md-3
            row-cols-lg-4
            row-cols-xl-5
            row-cols-xxl-6
            g-4
          "
          v-if="list && list.length > 0"
        >
          <div class="col" v-for="item in list" :key="item.id">
            <div
              class="card h-100"
              @click="$router.push('/info/' + item.id)"
              role="button"
            >
              <img :src="item.image" class="card-img-top" :alt="item.name" />
              <div class="card-body">
                <h5 class="card-title">{{ item.name }}</h5>

                <p class="card-text">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="alert alert-danger my-5"
          v-if="!loading && (!list || list.length == 0)"
        >
          The search did not return any results. Please click on a tag to remove
          it from the search.
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script>
import { mapActions } from "vuex";
import PublicLayout from "../layouts/Public.vue";
import TagService from "../shared/TagService";
import xss from "xss";

export default {
  components: {
    PublicLayout,
  },
  data() {
    return {
      category: "",
      list: [],
      search: null,
      filteredTagsBasic: [],
      loading: false,
    };
  },
  tagService: null,
  created() {
    this.tagService = new TagService();
  },
  computed: {
    tags() {
      return this.makeTags(this.category);
    },
    newTag() {
      return this.$route.params.newTag;
    },
  },
  watch: {
    async category() {
      this.downloadCategory();
    },
    newTag() {
      return this.addNewTag();
    },
  },
  mounted() {
    this.addNewTag();
    this.downloadCategory();
  },
  methods: {
    ...mapActions({
      getCategoryList: "api/getCategoryList",
    }),
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
    async downloadCategory() {
      this.loading = true;
      this.list = await this.getCategoryList({ cat: this.category });
      this.loading = false;
      localStorage.setItem("AD_search", this.search);
    },
    addNewTag() {
      this.search = localStorage.getItem("AD_search");
      if (this.$route.params.newTag) {
        const tags = this.makeTags(
          this.search + ", " + this.$route.params.newTag
        );
        this.search = tags.join(", ");
      }
      this.category = this.search;
      this.cleanUpStart();
    },
    addTag(str) {
      this.search = localStorage.getItem("AD_search");
      if (str) {
        const tags = this.makeTags(this.search + ", " + str);
        this.search = tags.join(", ");
      }
      this.category = this.search;
      this.cleanUpStart();
    },
    removeTag(tag) {
      const tags = this.makeTags(this.search);
      const index = tags.indexOf(tag.trim());
      if (index >= 0) tags.splice(index, 1);
      this.search = tags.join(", ");
      this.category = this.search;
      this.cleanUpStart();
    },
    cleanUpStart() {
      if (this.search.length > 1) {
        if (this.search.substring(0, 2) == ", ") {
          this.search = this.search.substring(2);
          this.category = this.search;
        }
      }
    },
    searchTag(event) {
      this.filteredTagsBasic = this.tagService.search(event.query, this);
    },
    searchClick(e) {
      e.preventDefault();
      this.category = this.search;
      console.log("this.category ", this.category, this.tags);
    },
    sanitizeHtml(data) {
      return xss(data);
    },
  },
};
</script>