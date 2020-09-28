<template>
    <div>
        <h4>Login</h4>
        <form>
            <label for="phone" >Mobile Number</label>
            <div>
                <input id="phone" type="phone" v-model="phone" required autofocus>
            </div>
            <label for="password">Password</label>
            <div>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <label></label>
            <div>
                <button type="submit" @click="handleSubmit">
                    Login
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
    label {
        margin-top: 5px;
    }
</style>

<script>
    const config = require('config');
    export default {
        data(){
            return {
                phone : "",
                password : ""
            }
        },
        methods : {
            handleSubmit(e){
                e.preventDefault()
                if (this.password.length > 0) {

                    fetch(`${config.authUrl}/login`, {
                        method: 'post',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            User: {
                                MobileNum: this.phone,
                                Password: this.password
                            }
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        let is_admin = data.user.RoleId;
                        localStorage.setItem('user',JSON.stringify(data.user));
                        localStorage.setItem('jwt', data.token);

                        if (localStorage.getItem('jwt') != null){
                            this.$emit('loggedIn')
                            if(this.$route.params.nextUrl != null){
                                this.$router.push(this.$route.params.nextUrl)
                            }
                            else {
                                if(is_admin == 1){
                                    this.$router.push('admin')
                                }
                                else {
                                    this.$router.push('dashboard')
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        console.error(error.response);
                    });
                }
            }
        }
    }
</script>