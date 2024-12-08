import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { start, done } from "nprogress";
import { useUserStore } from "@/stores/user";
import { loadMyProfile } from "@/App.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/login",
			name: "login",
			component: () => import("../views/Login.vue"),
		},
		{
			path: "/logout",
			name: "logout",
			component: () => import("../views/Logout.vue"),
			async beforeEnter() {
				const user = useUserStore();
				if (user.token) {
					user.logout();
				}
				return { name: "login" };
			},
		},
		{
			path: "/register",
			name: "register",
			component: () => import("../views/Register.vue"),
		},
		{
			path: "/dashboard",
			name: "dashboard",
			component: () => import("../views/Dashboard.vue"),
			async beforeEnter() {
				const user = useUserStore();
				if (!user.token) {
					return { name: "login" };
				}
				return await loadMyProfile(user.token)
					.then((data) => {
						user.setProfile(data);
					})
					.catch(() => ({ name: "login" }));
			},
			children: [
				{
					name: "transactions",
					alias: "transactions",
					path: "",
					component: () => import("../views/Transactions.vue"),
				},
				{
					name: "topUp",
					path: "top-up",
					component: () => import("../views/TopUp.vue"),
				},
				{
					name: "transfer",
					path: "transfer",
					component: () => import("../views/Transfer.vue"),
				},
			],
		},
	],
});

router.beforeEach(async () => {
	start();
	return await new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, 1500);
	});
});
router.afterEach(() => done());

export default router;
