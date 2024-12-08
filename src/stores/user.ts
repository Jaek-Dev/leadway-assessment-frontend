import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface Profile {
	id: string;
	firstName: string;
	lastName: string;
	emailAddress: string;
	phoneNumber: string;
	balance: number;
}

export const useUserStore = defineStore("user", () => {
	const authToken = ref<string>();
	const myProfile = ref<Profile>();
	const token = computed(() => authToken.value);
	const profile = computed(() => myProfile.value);

	function setToken(value: string) {
		authToken.value = value;
	}

	function setProfile(value: Profile) {
		myProfile.value = value;
	}

	function logout() {
		authToken.value = undefined;
		myProfile.value = undefined;
		sessionStorage.removeItem("token");
	}

	return {
		token,
		profile,
		setProfile,
		setToken,
		logout,
	};
});
