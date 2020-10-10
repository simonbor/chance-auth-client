import Vue from 'vue'

Vue.mixin({
    methods: {
        logOff() {
          console.log('Sign out...');
          if (localStorage.getItem('jwt') != null) {
              localStorage.removeItem('jwt');
              localStorage.removeItem('user');
              
              if(this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl);
              }
            else{
                (this.$route.path !== '/') && this.$router.push('/');
            }
        }
      }
    }
  });