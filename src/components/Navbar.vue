<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="light" fixed="top" >
      <b-navbar-brand :to="{ name: 'HelloWorld' }">Home</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'Map' }">Map</b-nav-item>
          <b-nav-item :to="{ name: 'HelloWorld' }">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!user" :to="{ name: 'Login' }">Login</b-nav-item>
          <b-nav-item-dropdown v-if="user" right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{ user }}</em>
            </template>
            <b-dropdown-item href="#" @click="signOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
  import EventBus from '../event-bus.js'
  export default {
    props : ["nextUrl"],
    name: 'Navbar',
    components: {
      EventBus
    },
    data() {
      if (localStorage.getItem('user') != null) {
        const user = JSON.parse(localStorage.getItem('user'));
        return { user: user.FirstName };
      }

      return { user: '' };
    },
    mounted () {
      const that = this;
      EventBus.$on('loggedIn', function () {
        if (localStorage.getItem('user') != null) {
          const user = JSON.parse(localStorage.getItem('user'));
          that.user = user.FirstName;
        }
      })
    },
    methods : {
      signOut(e) {
        e.preventDefault();

        if (localStorage.getItem('jwt') != null) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            this.user = '';

            if(this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl)
            }
            else{
                (this.$route.path !== '/') && this.$router.push('/')
            }
        }
      }
    }
  };
</script>