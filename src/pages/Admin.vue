<template>
  <PublicLayout>
    <h1>Admin</h1>
    <DataTable
      v-if="items"
      :value="items"
      responsiveLayout="scroll"
      selectionMode="single"
      v-model:selection="selection"
      :paginator="true"
      :rows="20"
    >
      <template #empty> No data to review</template>
      <Column field="id" header="id" :sortable="true"></Column>
      <Column field="name" header="name" :sortable="true"></Column>
      <Column
        field="description"
        header="description"
        :sortable="true"
      ></Column>
      <Column field="type" header="type" :sortable="true"></Column>
      <Column field="ip" header="ip" :sortable="true"></Column>
      <Column field="created" header="created" :sortable="true">
        <template #body="slotProps">
          <div v-if="slotProps.column.props.field in slotProps.data">
            {{
              $filters.formatDateTime(
                slotProps.data[slotProps.column.props.field]
              )
            }}
          </div>
        </template></Column
      >
      <Column field="updated" header="updated" :sortable="true"
        ><template #body="slotProps">
          <div v-if="slotProps.column.props.field in slotProps.data">
            {{
              $filters.formatDateTime(
                slotProps.data[slotProps.column.props.field]
              )
            }}
          </div>
        </template></Column
      >
      <Column
        ><template #body="slotProps">
          <div class="btn btn-primary" @click="goto(slotProps)">Show</div>
        </template></Column
      >
      <Column
        ><template #body="slotProps">
          <div class="btn btn-danger" @click="deleteItemClick(slotProps)">
            Delete
          </div>
        </template></Column
      >
    </DataTable>
  </PublicLayout>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import PublicLayout from "../layouts/Public.vue";
export default {
  components: {
    PublicLayout,
  },
  data() {
    return {
      items: [],
      selection: null,
    };
  },
  async mounted() {
    try {
      this.setAdmin(true);

      this.items = Object.values(await this.getUnresolved());
      console.log("this.items", this.items);
    } catch (e) {
      console.log("e", e);
    }
  },
  methods: {
    ...mapMutations({
      setAdmin: "config/setAdmin",
    }),
    ...mapActions({
      getUnresolved: "api/getUnresolved",
      deleteItem: "api/deleteItem",
      openSuccess: "toast/openSuccess",
    }),
    async deleteItemClick(slotProps) {
      if (confirm("Rally?")) {
        console.log("slotProps", slotProps);
        const count = await this.deleteItem({
          id: slotProps.data.id,
          ip: slotProps.data.ip,
        });
        this.items = Object.values(await this.getUnresolved());
        this.openSuccess("Items deleted: " + count);
      }
    },
    goto(slotProps) {
      console.log("slotProps", slotProps);
      if (slotProps.data.type == "place") {
        this.$router.push(
          "/edit/place/" + slotProps.data.id + "/" + slotProps.data.ip
        );
      } else if (slotProps.data.type == "eshop") {
        this.$router.push(
          "/edit/eshop/" + slotProps.data.id + "/" + slotProps.data.ip
        );
      } else {
        this.$router.push(
          "/edit/service/" + slotProps.data.id + "/" + slotProps.data.ip
        );
      }
    },
  },
};
</script>