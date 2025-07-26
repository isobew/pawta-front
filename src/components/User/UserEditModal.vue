<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div v-if="currentUserId == null">
      <FullPageLoader />
    </div>
    <div class="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto"
    v-if="currentUserId !== null"
    >
      <h2 class="text-2xl font-semibold mb-4 text-[#525392]">Edit User</h2>

      <input
        v-model="name"
        type="text"
        placeholder="Name"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
        :class="{ 'border-red-500': nameError }"
      />
      <p v-if="nameError" class="text-red-500 text-sm mb-4">Name is required</p>

      <input
        v-model="email"
        type="email"
        placeholder="E-mail"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
        :class="{ 'border-red-500': emailError }"
      />
      <p v-if="emailError" class="text-red-500 text-sm mb-4">
        E-mail is required
      </p>

      <select
        v-if="!isOwnAccount"
        v-model="is_admin"
        class="w-full border border-gray-300 rounded px-3 py-2 text-[#353535] focus:outline-none focus:ring-2 focus:ring-[#525392] mb-4"
        :class="{ 'border-red-500': is_adminError }"
      >
        <option value="1">Yes</option>
        <option value="0">No</option>
      </select>
      <p v-if="is_adminError" class="text-red-500 text-sm mb-4">
        Option is required
      </p>

      <div class="flex gap-4">
        <button
          class="flex-1 bg-[#525392] text-white py-2 rounded hover:opacity-90"
          @click="save"
          :disabled="isSaving"
        >
          {{ isSaving ? "Saving..." : "Save" }}
        </button>

        <button
          class="flex-1 border border-[#525392] text-[#525392] py-2 rounded hover:bg-[#525392] hover:text-white transition"
          @click="close"
          :disabled="isSaving"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch, onMounted, computed } from "vue";
import api from "../../services/api";
import FullPageLoader from "../../components/FullPageLoader.vue";
import { useToast } from 'vue-toast-notification';

const $toast = useToast();

const props = defineProps<{
  visible: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
  };
}>();

const emit = defineEmits(["close", "updated"]);

const name = ref("");
const email = ref("");
const is_admin = ref(0);

const isSaving = ref(false);
const users = ref<{ id: number; name: string }[]>([]);
const currentUserId = ref<number | null>(null);
const isOwnAccount = computed(() => props.user.id === currentUserId.value);

const nameError = ref(false);
const emailError = ref(false);
const is_adminError = ref(false);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      name.value = newUser.name || "";
      email.value = newUser.email || "";
      is_admin.value = String(newUser.is_admin ?? 0);
      // reset errors
      nameError.value = false;
      emailError.value = false;
      is_adminError.value = false;
    }
  },
  { immediate: true }
);

const close = () => {
  if (!isSaving.value) emit("close");
};

const isValidForm = computed(() => {
  return (
    name.value.trim() !== "" &&
    email.value.trim() !== "" &&
    is_admin.value !== ""
  );
});

const save = async () => {
  nameError.value = name.value.trim() === "";
  emailError.value = email.value.trim() === "";
  is_adminError.value = is_admin.value === "";

  if (!isValidForm.value) return;

  isSaving.value = true;
  try {
    const valor = await api.put(`/api/update-user/${props.user.id}`, {
      name: name.value.trim(),
      email: email.value.trim(),
      is_admin: is_admin.value,
    });

    const response = await api.get(`/api/user`);

    emit("updated", response.data);
    close();
    const msg = 'User updated successfully!';
    $toast.success(msg);
  } catch (err) {
    console.error("Error updating task:", err);
    const msg = err.response?.data?.message || 'Error.';
    $toast.error(msg);
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  try {
    const [usersRes, currentUserRes] = await Promise.all([
      api.get("/api/users-list"),
      api.get("/api/user"),
    ]);

    users.value = usersRes.data;
    currentUserId.value = currentUserRes.data.id;
  } catch (err) {
    console.error("Error loading data:", err);
  }
});
</script>
