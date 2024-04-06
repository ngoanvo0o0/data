  <template>
    <header>
            <div id="header-layout2" class="header-style5">
                <div class="header-top-bar">
                    <div class="top-bar-top box-layout">
                        <div class="container">
                            <div class="row">
                                <div class="col-6">
                                    <ul class="news-info-list">
                                        <li>
                                            <i class="fa fa-calendar" aria-hidden="true"></i>{{moment().format('MM-DD-YYYY')}}</li>
                                        <li>
                                            <i class="fa fa-clock-o" aria-hidden="true"></i>{{time}}</li>
                                    </ul>
                                </div>

                                <div class="col-6">
                                    <ul class="news-info-list text-right">
                                        <li>
                                            <a v-if="!user?.name" class="sign-in" href="/sign-in">{{ user?.name ||'Đăng Nhập'}}</a>
                                            <div v-else class="position-relative text-left">
                                                <span class="cursor-pointer" @click="isOpenActionDropdown = !isOpenActionDropdown"> {{ user?.name }}</span>
                                                <div v-if="isOpenActionDropdown" class="user-action-dropdown rounded">
                                                    <a href="/user-info">Thông Tin Cá Nhân</a>
                                                    <a href="/change-password">Đổi Mật Khẩu</a>
                                                    <a href="/rao-vat/tao-bai-viet">Tạo Bài Viết</a>
                                                    <hr class="m-0">
                                                    <div class="logout" @click="logout()">Đăng Xuất</div>
                                                </div>
                                            </div>
                                        </li>
                                        <li style="margin-right: -8px;">
                                            <div class="d-flex align-items-center">
                                                <div id="google_translate_element"></div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="bg-body box-layout">
                            <div class="top-bar-bottom pt-20 pb-20">
                                <div class="row d-flex align-items-center ">
                                    <div class="col-lg-4 d-none d-lg-block">
                                        <div class="logo-area">
                                            <a href="/" class="img-fluid">
                                                    <nuxt-img  style="height: 70px;" src="/img/logotapnews.png" alt="Người Việt Plus logo" />
                                                    <figure class="m-0 logo-figure">Tiếng Nói Người Việt Toàn Cầu</figure>
                                                </a>
                                        </div>
                                    </div>
                                    <div class="col-lg-8 col-md-12">
                                        <div class="">
                                            <nuxt-img quality="80" format="webp"  style="width: 100%;" src="/img/banner/header-banner.png" alt="ad" class="img-fluid" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main-menu-area border" id="sticker">
                    <div class="container">
                        <div class="bg-body box-layout">
                            <div class="">
                                <div class="row no-gutters d-flex align-items-center">
                                    <div class="col-lg-11 col-md-11 d-none d-lg-block position-static min-height-none">
                                        <div class="ne-main-menu">
                                            <nav id="dropdown">
                                                <ul>
                                                    <li>
                                                        <router-link to="/" active-class="active">Trang chủ</router-link>
                                                    </li>
                                                    <li v-for="item in menus?.data" >
                                                        <router-link :to="`/${item.slug}`" active-class="active">{{ item.name }}</router-link>
                                                        <ul class="ne-dropdown-menu" v-if="item.childCategories?.length">
                                                            <li v-for="child in item.childCategories">
                                                                <router-link :to="`/${child.slug}`" active-class="active">{{ child.name }}</router-link>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <router-link to="/rao-vat" active-class="active">Rao vặt</router-link>
                                                        <ul class="ne-dropdown-menu" v-if="raoVatCategories?.length">
                                                            <li v-for="category in raoVatCategories">
                                                                <a :href="getHrefRaoVat(category.slug)">{{ category.name }}</a>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                    <div class="col-lg-1 col-md-1 col-sm-4 text-right position-static min-height-none">
                                        <div class="header-action-item on-mobile-fixed">
                                            <ul>
                                                <li>
                                                    <form id="top-search-form" class="header-search-light">
                                                        <input v-model="keyword" type="text" id="search-input" class="search-input" placeholder="Tìm kiếm...." required style="display: none;" @keyup.enter="searchKeyword()">
                                                        <button class="search-button">
                                                                <i class="fa fa-search" aria-hidden="true"></i>
                                                            </button>
                                                    </form>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
</template>
<script setup lang="ts">
import moment from "moment";
import { useFetch, useRouter, useRuntimeConfig } from "nuxt/app";
import { useUserStore } from "~/stores/user";
import { onMounted } from "vue";
import { ref } from "vue";
import { CategoryDto } from "~/models/category.model";
import { GetMenuResponse } from "~/models/menu.model";
import { storeToRefs } from "pinia";

const $config = useRuntimeConfig();
const $router = useRouter()
const keyword = ref()
const {user} = storeToRefs(useUserStore())
const isOpenActionDropdown = ref(false);

const logout = () => {
    useUserStore().logout()
}

const searchKeyword = async () => {
    await $router.push({ path: `/tim-kiem/${keyword.value}` })
    keyword.value = ''
}
const getMenus = async () => {
  return await useFetch<GetMenuResponse>("/api/admin-console/menus", {
    baseURL: $config.public.apiURL,
  }).data;
}

const getRaoVatCategories = async () => {
  const { data } = await useFetch<CategoryDto[]>("/api/categories", {
    baseURL: $config.public.apiURL,
    query: {
        type: 'raovat'
    }
  })

  const createNewPath = {
    name: 'Tạo bài viết',
    slug: 'tao-bai-viet'
  }

  return [...data?.value, createNewPath]
}

const getHrefRaoVat = (slug: string) => {
    if (slug !== 'tao-bai-viet') {
        return `/rao-vat?categorySlug=${slug}`
    }

    return '/rao-vat/tao-bai-viet'
}

const [menus, raoVatCategories] = await Promise.all([getMenus(), getRaoVatCategories()]);
const interval = ref()
const timeFormat = 'hh:mm:ss A'
const time = ref(moment().format(timeFormat))
onMounted(() => {
  interval.value = setInterval(() => {
    // Concise way to format time according to system locale.
    // In my case this returns "3:48:00 am"
    time.value = moment().format(timeFormat)
  }, 1000)
})

</script>

<style lang="scss" scoped>
.top-bar-top {
    background-color: #fde9e1;
}

.sign-in,
.sign-up,
a:has(+ .ne-dropdown-menu .active),
.active {
    color: #e53935 !important;
}

a:has(+ .ne-dropdown-menu .active):hover,
.active:hover {
    color: #fff !important;
}

.user-action-dropdown {
    background-color: white;
    position: absolute;
    top: 105%;
    width: 160px;
    z-index: 100;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

    & > div, a {
        display: block;
        padding: 4px 12px;
        cursor: pointer;
        transition: background-color 0.3s;
        color: black;

        &.logout {
            color: #e53935;
        }

        &:hover {
            background-color: #e53935;
            color: #fff;
        }
    }

    @media screen and (max-width: 768px) {
        right: 0rem;
    }
}

</style>
