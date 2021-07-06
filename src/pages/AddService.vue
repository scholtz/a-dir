<template>
  <PublicLayout>
    <div class="container-fluid">
      <div class="my-2">
        <h1>Add your service to the directory</h1>
      </div>
      <form @submit="addServiceClick">
        <div class="mb-3">
          <label for="Name" class="form-label">Service Name</label>
          <input
            class="form-control"
            id="Name"
            placeholder="What is your service name?"
            v-model="data.name"
          />
        </div>
        <div class="mb-3">
          <label for="URL" class="form-label">URL address</label>
          <input
            class="form-control"
            id="URL"
            placeholder="URL address of your service starting with https://"
            maxlength="255"
            v-model="data.link"
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
          <label for="LongDescription" class="form-label"
            >Description - What do you provide?</label
          >
          <Editor editorStyle="height: 200px" v-model="data.htmldescription" />
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label"
            >Your email address (not published - for validation pusposes)</label
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
          @click="addServiceClick"
        >
          Improve information about service
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          @click="addServiceClick"
          v-else
        >
          Add service
        </button>
      </form>
    </div>
  </PublicLayout>
</template>

<script>
import { mapActions } from "vuex";
import PublicLayout from "../layouts/Public.vue";
export default {
  components: {
    PublicLayout,
  },
  data() {
    return {
      data: {
        address: "",
      },
      tags: "",
    };
  },
  watch: {
    tags() {
      this.data.tags = this.makeTags(this.tags);
    },
  },
  async mounted() {
    if (this.$route.params.id) {
      this.data = await this.getInfo({
        id: this.$route.params.id,
        ip: this.$route.params.ip,
      });
      if (this.data && this.data.tags) {
        this.tags = this.data.tags.join(", ");
      }
    }
  },
  methods: {
    ...mapActions({
      getCategoryList: "api/getCategoryList",
      search: "api/search",
      addService: "api/addService",
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
    async addServiceClick(e) {
      e.preventDefault();
      const result = await this.addService(this.data);
      if (result && result.id) {
        this.$router.push("/info/" + result.id);
      }
    },
  },
};
</script>