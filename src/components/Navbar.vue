<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="light" fixed="top" >
      <b-navbar-brand :to="{ name: 'HelloWorld' }">Home</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'Userboard' }">Dashboard</b-nav-item>
          <b-nav-item :to="{ name: 'Admin' }">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <b-dropdown-item :to="{ name: 'Login' }">Profile</b-dropdown-item>
            <b-dropdown-item href="#" @click="signOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
  export default {
    props : ["nextUrl"],
    name: 'Navbar',
    methods : {
      signOut(e) {
        e.preventDefault();

        if (localStorage.getItem('jwt') != null) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');

            if(this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl)
            }
            else{
                this.$router.push('/')
            }
        }
      }
    }
  };
</script>